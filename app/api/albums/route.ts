import { NextResponse } from "next/server";
import { getAlbums, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ 
        albums: [],
        message: "Cloudinary not configured. Please set up your environment variables."
      });
    }

    const albums = await getAlbums();
    return NextResponse.json({ albums });
  } catch (error: any) {
    console.error("Albums API error:", error);
    return NextResponse.json(
      { error: "Failed to load albums", albums: [] },
      { status: 500 }
    );
  }
}
