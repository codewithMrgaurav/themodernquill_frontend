"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/contexts/ApiContext";
import { api, endpoints, Category, Post } from "@/lib/api";
import { PostEditor, ContentBlock } from "@/components/admin/PostEditor";
import { ImageSelector } from "@/components/admin/ImageSelector";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { updatePost, fetchCategories } = useApi();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    category: "",
    image: "",
    status: "draft" as "draft" | "published" | "archived",
    isFeatured: false,
    hashtags: [] as string[],
    keywords: [] as string[],
    readTime: "5 min read",
  });
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [htmlContent, setHtmlContent] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    loadPost();
    loadCategories();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.postById(postId), {}, false);
      if (response.success && response.data) {
        const postData = response.data as Post;
        setPost(postData);
        setFormData({
          title: postData.title || "",
          slug: postData.slug || "",
          excerpt: postData.excerpt || "",
          description: postData.description || "",
          category: typeof postData.category === "object" ? postData.category._id : postData.category || "",
          image: postData.image || "",
          status: postData.status || "draft",
          isFeatured: postData.isFeatured || false,
          hashtags: postData.hashtags || [],
          keywords: postData.keywords || [],
          readTime: postData.readTime || "5 min read",
        });
        setContentBlocks(postData.contentBlocks || []);
        setHtmlContent(postData.content || "");
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    await fetchCategories();
    const response = await api.get(endpoints.categories, {}, false);
    if (response.success && response.data) {
      setCategories(response.data as Category[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const postData = {
        ...formData,
        category: formData.category,
        content: htmlContent,
        contentBlocks: contentBlocks.length > 0 ? contentBlocks : undefined,
        hashtags: formData.hashtags.filter((tag) => tag.trim()),
        keywords: formData.keywords.filter((keyword) => keyword.trim()),
      };

      const result = await updatePost(postId, postData);
      
      if (result) {
        router.push("/admin/posts");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setSaving(false);
    }
  };

  const addHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.trim().startsWith("#") 
        ? hashtagInput.trim() 
        : `#${hashtagInput.trim()}`;
      setFormData({
        ...formData,
        hashtags: [...formData.hashtags, tag],
      });
      setHashtagInput("");
    }
  };

  const removeHashtag = (index: number) => {
    setFormData({
      ...formData,
      hashtags: formData.hashtags.filter((_, i) => i !== index),
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Post not found</p>
        <button
          onClick={() => router.push("/admin/posts")}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
          <p className="mt-1 text-sm text-slate-600">
            Update your post content and settings
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={200}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
              placeholder="post-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Excerpt *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              maxLength={500}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              placeholder="Short excerpt for preview (max 500 characters)"
            />
            <p className="mt-1 text-xs text-slate-500">{formData.excerpt.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
              placeholder="Full description of the post"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Featured Image *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="Image URL or click Select Image"
                  />
                  <button
                    type="button"
                    onClick={() => setShowImageSelector(true)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    Select Image
                  </button>
                </div>
                {formData.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={formData.image}
                      alt="Featured image preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Selector Modal */}
        {showImageSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Select Featured Image</h2>
                <button
                  onClick={() => setShowImageSelector(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ImageSelector
                value={formData.image}
                onChange={(url) => {
                  setFormData({ ...formData, image: url });
                  setShowImageSelector(false);
                }}
                onClose={() => setShowImageSelector(false)}
              />
            </div>
          </div>
        )}

        {/* Content Editor */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Post Content</h2>
          <PostEditor
            contentBlocks={contentBlocks}
            onChange={setContentBlocks}
            onContentChange={setHtmlContent}
          />
        </div>

        {/* Metadata */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Metadata</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="5 min read"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">
              Feature this post
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hashtags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Add hashtag (press Enter)"
              />
              <button
                type="button"
                onClick={addHashtag}
                className="rounded-lg px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeHashtag(index)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Add keyword (press Enter)"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-lg px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:text-slate-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg px-6 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

