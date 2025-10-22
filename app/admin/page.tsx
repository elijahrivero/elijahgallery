"use client";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Upload, Camera, Tag, FileText, Save, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { Photo } from "@/lib/types";

export default function Admin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({
    title: '',
    description: '',
    category: 'portrait'
  });
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate file upload
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadProgress(0);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleAddPhoto = () => {
    if (newPhoto.title && newPhoto.description) {
      const photo: Photo = {
        id: Date.now().toString(),
        title: newPhoto.title,
        description: newPhoto.description,
        category: newPhoto.category as any,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        metadata: {
          camera: 'Canon EOS R5',
          lens: '24-70mm f/2.8',
          settings: 'f/2.8, 1/125s, ISO 100',
          location: 'Studio',
          date: new Date().toISOString().split('T')[0]
        },
        createdAt: new Date().toISOString()
      };
      
      setPhotos(prev => [photo, ...prev]);
      setNewPhoto({ title: '', description: '', category: 'portrait' });
      setIsAddingPhoto(false);
    }
  };

  const categories = [
    { id: 'portrait', name: 'Portrait' },
    { id: 'landscape', name: 'Landscape' },
    { id: 'street', name: 'Street' },
    { id: 'event', name: 'Event' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-slate-700/10 dark:from-slate-100/5 dark:to-slate-300/5"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your photography gallery
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Upload Photos</h2>
              
              {/* Drag & Drop Area */}
              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
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

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Uploading...
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
            </motion.div>

            {/* Add Photo Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add Photo Details</h2>
                <button
                  onClick={() => setIsAddingPhoto(!isAddingPhoto)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>

              {isAddingPhoto && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      placeholder="Photo title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newPhoto.description}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      placeholder="Photo description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newPhoto.category}
                      onChange={(e) => setNewPhoto(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddPhoto}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Photo
                    </button>
                    <button
                      onClick={() => setIsAddingPhoto(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Photos Grid */}
          {photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Recent Uploads ({photos.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {photo.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {photo.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          {photo.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </span>
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