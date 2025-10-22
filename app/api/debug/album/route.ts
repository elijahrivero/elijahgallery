import { NextRequest, NextResponse } from "next/server";
import { cloudinaryClient, GALLERY_FOLDER, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const albumId = searchParams.get('albumId');

    if (!albumId) {
      return NextResponse.json(
        { error: "Album ID is required" },
        { status: 400 }
      );
    }

    const folderPath = `${GALLERY_FOLDER}/${albumId}`;
    
    // Get all images in the folder (including placeholders)
    const allImages = await cloudinaryClient.search
      .expression(`folder:${folderPath}`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    // Get only non-placeholder images
    const realImages = await cloudinaryClient.search
      .expression(`folder:${folderPath} AND !public_id:${albumId}-placeholder`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    return NextResponse.json({
      albumId,
      folderPath,
      allImages: allImages.resources?.map((r: any) => ({
        id: r.public_id,
        url: r.secure_url,
        created_at: r.created_at,
        isPlaceholder: r.public_id.includes('-placeholder')
      })) || [],
      realImages: realImages.resources?.map((r: any) => ({
        id: r.public_id,
        url: r.secure_url,
        created_at: r.created_at,
      })) || [],
      totalCount: allImages.total_count || 0,
      realCount: realImages.total_count || 0
    });
  } catch (error: any) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: "Failed to debug album", details: error.message },
      { status: 500 }
    );
  }
}
