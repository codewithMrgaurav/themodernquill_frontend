"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/contexts/ApiContext";
import { api, endpoints, Category } from "@/lib/api";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { updateCategory } = useApi();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.categoryById(categoryId), {}, false);
      if (response.success && response.data) {
        const categoryData = response.data as Category;
        setCategory(categoryData);
        setFormData({
          name: categoryData.name || "",
          slug: categoryData.slug || "",
          description: categoryData.description || "",
          icon: (categoryData as any).icon || "",
          color: (categoryData as any).color || "#3B82F6",
        });
      }
    } catch (error) {
      console.error("Error loading category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateCategory(categoryId, formData);
      
      if (result) {
        router.push("/admin/categories");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Category not found</p>
        <button
          onClick={() => router.push("/admin/categories")}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Category</h1>
          <p className="mt-1 text-sm text-slate-600">
            Update category information
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            placeholder="e.g., Technology, Health, Business"
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
            placeholder="category-slug"
          />
          <p className="mt-1 text-xs text-slate-500">URL-friendly identifier</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            placeholder="Brief description of this category"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Icon (Emoji or Unicode)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="📱 or 🏥"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono text-sm"
                placeholder="#3B82F6"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
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
            {saving ? "Saving..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

