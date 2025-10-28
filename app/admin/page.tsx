"use client";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Album = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  imageCount: number;
  createdAt: string;
};

type UploadedImage = {
  id: string;
  url: string;
  publicId: string;
};

export default function Admin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [newAlbumName, setNewAlbumName] = useState<string>("");
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load albums on mount
  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const res = await fetch("/api/albums", { cache: "no-store" });
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error("Error loading albums:", error);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);

      // Create preview URLs for selected images
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      setUploadError("");
    }
  };

  const uploadToCloudinary = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one image");
      return;
    }

    if (!selectedAlbum) {
      setUploadError("Please select an album");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");
    const uploaded: UploadedImage[] = [];

    try {
      // Get signature from API
      const signRes = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumId: selectedAlbum }),
      });

      if (!signRes.ok) {
        throw new Error("Failed to get upload signature");
      }

      const signData = await signRes.json();

      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();

        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp.toString());
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const uploadData = await uploadRes.json();
        uploaded.push({
          id: uploadData.public_id,
          url: uploadData.secure_url,
          publicId: uploadData.public_id,
        });

        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      // Success!
      setUploadedImages(prev => [...uploaded, ...prev]);
      setSelectedFiles([]);
      setPreviewImages([]);
      setUploadProgress(0);
      setSuccessMessage(`Successfully uploaded ${uploaded.length} ${uploaded.length === 1 ? 'image' : 'images'} to Cloudinary!`);
      setTimeout(() => setSuccessMessage(""), 5000);

      // Reload albums to update count
      await loadAlbums();
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    previewImages.forEach(url => URL.revokeObjectURL(url));
    setPreviewImages([]);
    setUploadError("");
  };

  const createNewAlbum = async () => {
    if (!newAlbumName.trim()) {
      setUploadError("Please enter an album name");
      return;
    }

    setIsCreatingAlbum(true);
    setUploadError("");

    try {
      const res = await fetch("/api/albums/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albumName: newAlbumName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create album");
      }

      const data = await res.json();
      setSuccessMessage(`Album "${newAlbumName}" created successfully!`);
      setTimeout(() => setSuccessMessage(""), 5000);
      setNewAlbumName("");
      setShowCreateAlbum(false);

      // Reload albums list
      await loadAlbums();
    } catch (error: any) {
      console.error("Error creating album:", error);
      setUploadError(error.message || "Failed to create album");
    } finally {
      setIsCreatingAlbum(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Success Toast */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 right-6 z-50 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/20 border-b border-slate-200 dark:border-slate-700">
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your photography gallery
            </p>
          </div>
        </div>
      </section>

      {/* Albums Management Section */}
      <section className="py-12 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manage Albums</h2>
              <button
                onClick={() => setShowCreateAlbum(!showCreateAlbum)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Album
              </button>
            </div>

            {/* Create Album Form */}
            {showCreateAlbum && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-6 bg-white dark:bg-slate-700 rounded-xl border-2 border-blue-200 dark:border-blue-700"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Create New Album</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Enter album name (e.g., Wedding, Portraits, Nature)"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    disabled={isCreatingAlbum}
                    onKeyPress={(e) => e.key === 'Enter' && createNewAlbum()}
                  />
                  <button
                    onClick={createNewAlbum}
                    disabled={isCreatingAlbum || !newAlbumName.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingAlbum ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateAlbum(false);
                      setNewAlbumName("");
                      setUploadError("");
                    }}
                    disabled={isCreatingAlbum}
                    className="px-6 py-3 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* Albums Grid */}
            {albums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      {album.coverImage ? (
                        <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-16 h-16 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{album.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {album.imageCount} {album.imageCount === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Albums Yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Create your first album to get started!</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Upload Photos</h2>

              {/* Album Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Album
                </label>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  disabled={isUploading}
                >
                  <option value="">Choose an album...</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>
                      {album.name} ({album.imageCount} images)
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag & Drop Area */}
              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Drop photos here or click to browse
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Supports JPG, PNG, and other image formats
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                </motion.div>
              )}

              {/* Preview Images */}
              {previewImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Selected Images ({previewImages.length})
                    </h3>
                    {!isUploading && (
                      <button
                        onClick={clearSelection}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Uploading to Cloudinary...
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </motion.div>
              )}

              {/* Upload Button */}
              {previewImages.length > 0 && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={uploadToCloudinary}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Upload className="w-5 h-5" />
                    Upload {previewImages.length} {previewImages.length === 1 ? 'Image' : 'Images'} to Cloudinary
                  </button>
                </motion.div>
              )}
            </motion.div>

          </div>

          {/* Uploaded Images Grid */}
          {uploadedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Recently Uploaded ({uploadedImages.length})
                </h3>
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Uploaded to Cloudinary
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {uploadedImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={image.url}
                      alt={image.publicId}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">
                        {image.publicId.split('/').pop()}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                          Cloudinary
                        </span>
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}