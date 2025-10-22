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
    const albumId = body.albumId;
    const folder = albumId ? `${GALLERY_FOLDER}/${albumId}` : GALLERY_FOLDER;
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = { folder, timestamp } as Record<string, string | number>;

    const signature = cloudinaryClient.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      timestamp,
      signature,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to sign upload" },
      { status: 500 }
    );
  }
}


