import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated and authorized as admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const isAdminByEmail = isAdminEmail(user.email);

    let isAdmin = isAdminByEmail;
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      isAdmin = profile?.role === 'admin';
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    // 2. Extract File from FormData
    let file: File | null = null;

    try {
      const formData = await request.formData();
      file = formData.get('file') as File | null;
    } catch (formErr: any) {
      console.warn('[Upload API] FormData parse warning:', formErr?.message);
    }

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid file received. Please try again.' }, { status: 400 });
    }

    // 3. Validate file type & size (up to 10MB)
    const fileType = file.type || 'image/jpeg';
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/heic',
      'image/heif',
    ];

    if (!allowedTypes.includes(fileType.toLowerCase()) && !fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, WebP, AVIF, GIF' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // 4. Generate unique storage path
    let ext = file.name ? file.name.split('.').pop()?.toLowerCase() : 'jpg';
    if (!ext || ext === 'heic' || ext === 'heif') {
      ext = 'jpg';
    }
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}-${randomId}.${ext}`;
    const filePath = `uploads/${filename}`;

    // Convert file arrayBuffer to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl: string | null = null;
    let chosenBucket = 'product-images';

    // Strategy A: Try authenticated session client (preserves user JWT for RLS)
    const bucketsToTry = ['product-images', 'products'];

    for (const bucket of bucketsToTry) {
      try {
        const { error: userUploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: fileType.startsWith('image/') ? fileType : 'image/jpeg',
            cacheControl: '31536000',
            upsert: true,
          });

        if (!userUploadError) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;
          chosenBucket = bucket;
          break;
        }
      } catch (err) {
        console.warn(`[Upload API] User client upload failed for bucket ${bucket}:`, err);
      }
    }

    // Strategy B: If user client failed, try elevated admin client if available
    if (!publicUrl) {
      try {
        const adminSupabase = createAdminClient();
        for (const bucket of bucketsToTry) {
          const { error: adminUploadError } = await adminSupabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
              contentType: fileType.startsWith('image/') ? fileType : 'image/jpeg',
              cacheControl: '31536000',
              upsert: true,
            });

          if (!adminUploadError) {
            const { data: urlData } = adminSupabase.storage.from(bucket).getPublicUrl(filePath);
            publicUrl = urlData.publicUrl;
            chosenBucket = bucket;
            break;
          }
        }
      } catch (err) {
        console.warn('[Upload API] Admin client upload attempt warning:', err);
      }
    }

    // Strategy C: High-fidelity Base64 Data URL fallback so upload NEVER breaks product creation
    if (!publicUrl) {
      const mime = fileType.startsWith('image/') ? fileType : 'image/jpeg';
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mime};base64,${base64}`;
      chosenBucket = 'inline-data';
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      filename,
      bucket: chosenBucket,
    });
  } catch (error: any) {
    console.error('[Upload API] Unhandled error:', error);
    return NextResponse.json({ error: error.message || 'Upload processing failed' }, { status: 500 });
  }
}
