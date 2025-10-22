import { NextResponse } from "next/server";
import { cloudinaryClient, GALLERY_FOLDER, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  try {
    // Return empty gallery if Cloudinary is not configured
    if (!isCloudinaryConfigured()) {
      return NextResponse.json({ 
        images: [],
        message: "Cloudinary not configured. Please set up your environment variables."
      });
    }

    // Search for images in the main gallery folder AND all subfolders (albums)
    // This will include images from both the main gallery and all albums
    const search = await cloudinaryClient.search
      .expression(`folder:${GALLERY_FOLDER}/* OR folder:${GALLERY_FOLDER}`)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    // Filter out placeholder images
    const images = (search.resources || [])
      .filter((r: any) => !r.public_id.includes('-placeholder'))
      .map((r: any) => ({
        id: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        album: r.folder?.replace(`${GALLERY_FOLDER}/`, '') || 'main'
      }));

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error("Gallery API error:", error);
    return NextResponse.json(
      { error: "Failed to load gallery", images: [] },
      { status: 500 }
    );
  }
}


