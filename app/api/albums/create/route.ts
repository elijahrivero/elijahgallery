import { NextRequest, NextResponse } from "next/server";
import { cloudinaryClient, GALLERY_FOLDER, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const albumName = body.albumName;
    
    if (!albumName || !albumName.trim()) {
      return NextResponse.json(
        { error: "Album name is required" },
        { status: 400 }
      );
    }

    const albumId = albumName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const folderPath = `${GALLERY_FOLDER}/${albumId}`;

    // Create a placeholder image to establish the folder
    // We'll use Cloudinary's text overlay feature to create a simple placeholder
    const placeholderUrl = cloudinaryClient.url('sample', {
      transformation: [
        { width: 1, height: 1, crop: 'scale' },
        { overlay: 'text:Arial_12:Album Created', gravity: 'center', color: 'transparent' }
      ],
      folder: folderPath,
      public_id: 'placeholder'
    });

    // Actually create the folder by uploading a minimal placeholder
    try {
      // Create a 1x1 transparent pixel as base64
      const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      const uploadResult = await cloudinaryClient.uploader.upload(transparentPixel, {
        folder: folderPath,
        public_id: `${albumId}-placeholder`,
        overwrite: true,
        resource_type: 'image',
        tags: ['placeholder', 'album-creation']
      });

      console.log('Album created successfully:', {
        albumId,
        folderPath,
        uploadResult: uploadResult.public_id
      });

      return NextResponse.json({ 
        success: true, 
        albumId,
        folder: folderPath,
        message: `Album "${albumName}" created successfully`
      });
    } catch (uploadError) {
      console.error('Error creating album folder:', uploadError);
      return NextResponse.json(
        { error: "Failed to create album folder", details: uploadError },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Album creation error:', error);
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 }
    );
  }
}
