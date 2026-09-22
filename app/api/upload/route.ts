import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Try Cloudinary first
    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', dataUrl);
      cloudinaryFormData.append('upload_preset', 'ml_default');
      
      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/demo/image/upload',
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      if (cloudinaryResponse.ok) {
        const result = await cloudinaryResponse.json();
        if (result.secure_url) {
          return NextResponse.json({
            success: true,
            url: result.secure_url,
            service: 'cloudinary',
          });
        }
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
    }

    // Try imgbb as backup
    try {
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', base64);
      
      const imgbbResponse = await fetch(
        'https://api.imgbb.com/1/upload?key=d3c3f6421e6f4d0d5e0c5a8b4e5c3f2a',
        {
          method: 'POST',
          body: imgbbFormData,
        }
      );

      if (imgbbResponse.ok) {
        const result = await imgbbResponse.json();
        if (result.data?.url) {
          return NextResponse.json({
            success: true,
            url: result.data.url,
            service: 'imgbb',
          });
        }
      }
    } catch (imgbbError) {
      console.error('ImgBB upload failed:', imgbbError);
    }

    // Try postimages.org as third option (no API key needed)
    try {
      const postimagesFormData = new FormData();
      postimagesFormData.append('upload', base64);
      postimagesFormData.append('type', 'base64');
      
      const postimagesResponse = await fetch(
        'https://postimages.org/json/rr',
        {
          method: 'POST',
          body: postimagesFormData,
        }
      );

      if (postimagesResponse.ok) {
        const result = await postimagesResponse.json();
        if (result.url) {
          return NextResponse.json({
            success: true,
            url: result.url,
            service: 'postimages',
          });
        }
      }
    } catch (postimagesError) {
      console.error('PostImages upload failed:', postimagesError);
    }

    // If all services fail, return base64 as fallback
    return NextResponse.json({
      success: true,
      url: dataUrl,
      service: 'base64',
      warning: 'All hosting services failed. Image stored as base64 (may be slower to load)',
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
