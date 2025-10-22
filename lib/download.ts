// Utility function to download an image
export const downloadImage = async (imageUrl: string, filename?: string) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename if not provided
    if (!filename) {
      const urlParts = imageUrl.split('/');
      const originalFilename = urlParts[urlParts.length - 1];
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      filename = `elijah-gallery-${timestamp}-${originalFilename}`;
    }
    
    link.download = filename;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};
