"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, endpoints, Post } from "@/lib/api";

export default function AdminPostsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadPosts();
  }, [statusFilter, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get(endpoints.posts, params, false);
      
      if (response.success && response.data) {
        setPosts(response.data as Post[]);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await api.delete(endpoints.postById(postId), false);
      if (response.success) {
        loadPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const statusFilters = [
    { value: "all", label: "All Posts" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
    { value: "archived", label: "Archived" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posts Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage all your blog posts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Post
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                loadPosts();
              }
            }}
            placeholder="Search posts by title or description..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
        <button
          onClick={loadPosts}
          className="rounded-lg px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
        >
          Search
        </button>
        <div className="flex items-center gap-2">
          {statusFilters.map((filter) => (
            <Link
              key={filter.value}
              href={`/admin/posts?status=${filter.value}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                statusFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 ring-1 ring-slate-200"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/admin/posts/${post._id}`}
                          className="font-semibold text-slate-900 hover:text-blue-700"
                        >
                          {post.title}
                        </Link>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {post.excerpt || post.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {post.views || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post._id}`}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No posts found.{" "}
                    <Link href="/admin/posts/new" className="text-blue-700 hover:text-blue-800 font-medium">
                      Create your first post
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} posts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (pagination.page > 1) {
                  setPagination({ ...pagination, page: pagination.page - 1 });
                  loadPosts();
                }
              }}
              disabled={pagination.page === 1}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (pagination.page < pagination.totalPages) {
                  setPagination({ ...pagination, page: pagination.page + 1 });
                  loadPosts();
                }
              }}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 bg-white ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

