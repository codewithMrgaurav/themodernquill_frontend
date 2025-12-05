"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, endpoints, Category } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.categories, {}, false);
      if (response.success && response.data) {
        setCategories(response.data as Category[]);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Note: Category delete endpoint not available in backend
  // Categories can be deactivated by updating isActive field if needed

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage blog categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Category
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category._id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/categories/${category._id}`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
              {category.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  View on site →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
            No categories found.{" "}
            <Link href="/admin/categories/new" className="text-blue-700 hover:text-blue-800 font-medium">
              Create your first category
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

