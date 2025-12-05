"use client";

import { useState } from "react";
import { api, endpoints } from "@/lib/api";

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  onClose?: () => void;
}

type ImageSource = "url" | "upload" | "pexels";

interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  src: {
    original: string;
    large: string;
    large2x: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export function ImageSelector({ value, onChange, onClose }: ImageSelectorProps) {
  const [activeTab, setActiveTab] = useState<ImageSource>("url");
  const [urlInput, setUrlInput] = useState(value || "");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pexelsQuery, setPexelsQuery] = useState("");
  const [pexelsImages, setPexelsImages] = useState<PexelsImage[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [selectedPexelsImage, setSelectedPexelsImage] = useState<PexelsImage | null>(null);

  const handleUrlUse = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      if (onClose) onClose();
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadFile);
      formData.append("name", uploadFile.name);
      formData.append("description", `Uploaded image: ${uploadFile.name}`);

      const response = await api.postFormData<{ imageUrl: string }>(endpoints.brandingImageUpload, formData);
      
      if (response.success && response.data) {
        const imageUrl = response.data.imageUrl;
        // Convert relative URL to absolute if needed
        const fullUrl = imageUrl.startsWith("http") 
          ? imageUrl 
          : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"}${imageUrl}`;
        onChange(fullUrl);
        if (onClose) onClose();
      } else {
        alert("Failed to upload image: " + (response.error?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handlePexelsSearch = async () => {
    if (!pexelsQuery.trim()) return;

    setPexelsLoading(true);
    try {
      const response = await api.get<{ photos: PexelsImage[] }>(endpoints.pexelsSearch, {
        query: pexelsQuery.trim(),
        perPage: 20,
        page: 1,
      }, false);

      if (response.success && response.data) {
        setPexelsImages(response.data.photos || []);
      } else {
        alert("Failed to search images: " + (response.error?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error searching Pexels:", error);
      alert("Failed to search images");
    } finally {
      setPexelsLoading(false);
    }
  };

  const handlePexelsUse = () => {
    if (selectedPexelsImage) {
      // Use large image for better quality
      onChange(selectedPexelsImage.src.large2x || selectedPexelsImage.src.large || selectedPexelsImage.src.original);
      if (onClose) onClose();
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("url")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "url"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "upload"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab("pexels")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "pexels"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Pexels Search
        </button>
      </div>

      {/* URL Tab */}
      {activeTab === "url" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          {urlInput && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={urlInput}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleUrlUse}
              disabled={!urlInput.trim()}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Image
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            {uploadFile && (
              <p className="mt-2 text-sm text-slate-500">
                Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          {uploadFile && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={URL.createObjectURL(uploadFile)}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleFileUpload}
              disabled={!uploadFile || uploading}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload & Use Image"}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pexels Tab */}
      {activeTab === "pexels" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={pexelsQuery}
              onChange={(e) => setPexelsQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handlePexelsSearch()}
              placeholder="Search for images (e.g., nature, technology, business)"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <button
              onClick={handlePexelsSearch}
              disabled={!pexelsQuery.trim() || pexelsLoading}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pexelsLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {pexelsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-sm text-slate-600">Searching images...</p>
              </div>
            </div>
          )}

          {!pexelsLoading && pexelsImages.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                {pexelsImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedPexelsImage(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ring-2 transition ${
                      selectedPexelsImage?.id === image.id
                        ? "ring-blue-600 ring-offset-2"
                        : "ring-slate-200 hover:ring-slate-300"
                    }`}
                  >
                    <img
                      src={image.src.medium}
                      alt={`Photo by ${image.photographer}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedPexelsImage?.id === image.id && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <div className="bg-blue-600 text-white rounded-full p-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {selectedPexelsImage && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    Photo by{" "}
                    <a
                      href={selectedPexelsImage.photographerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 font-medium"
                    >
                      {selectedPexelsImage.photographer}
                    </a>{" "}
                    on Pexels
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handlePexelsUse}
                  disabled={!selectedPexelsImage}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Selected Image
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {!pexelsLoading && pexelsQuery && pexelsImages.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No images found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

