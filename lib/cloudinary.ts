import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Initialize Cloudinary only if credentials are available
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const cloudinaryClient = cloudinary;
export const GALLERY_FOLDER = "elijah-gallery";

// Helper to check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(cloudName && apiKey && apiSecret);
};

// Album management
export interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt: string;
}

export const getAlbums = async (): Promise<Album[]> => {
  if (!isCloudinaryConfigured()) return [];
  
  try {
    // Get all folders in the gallery
    const folders = await cloudinaryClient.api.sub_folders(GALLERY_FOLDER);
    
    const albums: Album[] = [];
    
    for (const folder of folders.folders || []) {
      const folderPath = `${GALLERY_FOLDER}/${folder.name}`;
      
      // Get images in this folder, excluding placeholder images
      const search = await cloudinaryClient.search
        .expression(`folder:${folderPath} AND !public_id:${folder.name}-placeholder`)
        .max_results(1)
        .execute();
      
      const coverImage = search.resources?.[0]?.secure_url;
      
      // Get total count, excluding placeholder images
      const countSearch = await cloudinaryClient.search
        .expression(`folder:${folderPath} AND !public_id:${folder.name}-placeholder`)
        .max_results(500)
        .execute();
      
      albums.push({
        id: folder.name,
        name: folder.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        coverImage,
        imageCount: countSearch.total_count || 0,
        createdAt: folder.created_at,
      });
    }
    
    return albums.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

export const getAlbumImages = async (albumId: string) => {
  if (!isCloudinaryConfigured()) return [];
  
  try {
    const folderPath = `${GALLERY_FOLDER}/${albumId}`;
    const search = await cloudinaryClient.search
      .expression(`folder:${folderPath} AND !public_id:${albumId}-placeholder`)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    return (search.resources || []).map((r: any) => ({
      id: r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
    }));
  } catch (error) {
    console.error('Error fetching album images:', error);
    return [];
  }
};


