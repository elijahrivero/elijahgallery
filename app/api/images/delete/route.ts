import { NextRequest, NextResponse } from "next/server";
import { cloudinaryClient, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { publicId } = body;
    
    if (!publicId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Delete the image from Cloudinary
    const result = await cloudinaryClient.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return NextResponse.json({ 
        success: true, 
        message: "Image deleted successfully" 
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete image", details: error.message },
      { status: 500 }
    );
  }
}
