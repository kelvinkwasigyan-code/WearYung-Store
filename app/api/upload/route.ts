import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

    const userEmail = (user.email || '').toLowerCase();
    const isAdminByEmail = userEmail === 'admin@wearyung.com' ||
      (!!process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL.toLowerCase());

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

    // 2. Extract File from FormData or raw body
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

    // Use admin client with service role for reliable storage upload
    const adminSupabase = createAdminClient();

    // Primary bucket: 'products', Fallback bucket: 'product-images'
    let bucketToUse = 'products';
    let { error: uploadError } = await adminSupabase.storage
      .from(bucketToUse)
      .upload(filePath, buffer, {
        contentType: fileType.startsWith('image/') ? fileType : 'image/jpeg',
        cacheControl: '31536000',
        upsert: true,
      });

    // If 'products' bucket not found, retry with 'product-images'
    if (uploadError && (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket'))) {
      bucketToUse = 'product-images';
      const retryResult = await adminSupabase.storage
        .from(bucketToUse)
        .upload(filePath, buffer, {
          contentType: fileType.startsWith('image/') ? fileType : 'image/jpeg',
          cacheControl: '31536000',
          upsert: true,
        });
      uploadError = retryResult.error;
    }

    if (uploadError) {
      console.error('[Upload API] Storage error:', uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // 5. Get public image URL
    const { data: urlData } = adminSupabase.storage
      .from(bucketToUse)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      filename,
      bucket: bucketToUse,
    });
  } catch (error: any) {
    console.error('[Upload API] Unhandled error:', error);
    return NextResponse.json({ error: error.message || 'Upload processing failed' }, { status: 500 });
  }
}
