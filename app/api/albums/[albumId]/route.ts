import { NextRequest, NextResponse } from "next/server";
import { getAlbumImages, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: { albumId: string } }
) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ 
        images: [],
        message: "Cloudinary not configured. Please set up your environment variables."
      });
    }

    const images = await getAlbumImages(params.albumId);
    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("Album images API error:", error);
    return NextResponse.json(
      { error: "Failed to load album images", images: [] },
      { status: 500 }
    );
  }
}
