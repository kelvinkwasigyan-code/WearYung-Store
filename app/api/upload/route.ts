import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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

    // 2. Cleanly extract FormData and File
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err: any) {
      console.error('[Upload API] FormData parse error:', err);
      return NextResponse.json({ error: 'Failed to parse body as FormData' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid file provided under "file" key.' }, { status: 400 });
    }

    // 3. Validate file type & size (max 5MB)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    const fileType = file.type || 'image/jpeg';

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPG, PNG, WebP, AVIF, GIF' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // 4. Generate unique storage path
    const ext = file.name ? file.name.split('.').pop() : 'jpg';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const filename = `${timestamp}-${randomId}.${ext || 'jpg'}`;
    const filePath = `uploads/${filename}`;

    // Convert file arrayBuffer to Uint8Array/Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use admin client with service role for reliable storage upload
    const adminSupabase = createAdminClient();

    // Primary bucket: 'products', Fallback bucket: 'product-images'
    let bucketToUse = 'products';
    let { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from(bucketToUse)
      .upload(filePath, buffer, {
        contentType: fileType,
        cacheControl: '31536000',
        upsert: true,
      });

    // If 'products' bucket not found, retry with 'product-images'
    if (uploadError && (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('bucket'))) {
      bucketToUse = 'product-images';
      const retryResult = await adminSupabase.storage
        .from(bucketToUse)
        .upload(filePath, buffer, {
          contentType: fileType,
          cacheControl: '31536000',
          upsert: true,
        });
      uploadData = retryResult.data;
      uploadError = retryResult.error;
    }

    if (uploadError) {
      console.error('[Upload API] Storage error:', uploadError);
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
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
