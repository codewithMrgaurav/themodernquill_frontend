"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApi } from "@/contexts/ApiContext";
import { api, endpoints, Post, Category } from "@/lib/api";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalUsers: number;
  totalViews: number;
  recentPosts: Post[];
}

export default function AdminDashboard() {
  const { fetchPosts, fetchCategories } = useApi();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0,
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all posts (including drafts)
      const postsResponse = await api.get(endpoints.posts, { status: "all", limit: 100 }, false);
      const allPosts = postsResponse.success && postsResponse.data ? (postsResponse.data as Post[]) : [];

      // Fetch categories
      const categoriesResponse = await api.get(endpoints.categories, {}, false);
      const categories = categoriesResponse.success && categoriesResponse.data ? (categoriesResponse.data as Category[]) : [];

      // Fetch users
      const usersResponse = await api.get(endpoints.users, { limit: 100 }, false);
      const users = usersResponse.success && usersResponse.data ? (usersResponse.data as any[]) : [];

      // Calculate stats
      const publishedPosts = allPosts.filter((p) => p.status === "published");
      const draftPosts = allPosts.filter((p) => p.status === "draft");
      const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
      const recentPosts = allPosts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalPosts: allPosts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        totalViews,
        recentPosts,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      change: `${stats.publishedPosts} published`,
      icon: "📝",
      color: "blue",
      href: "/admin/posts",
    },
    {
      title: "Published",
      value: stats.publishedPosts,
      change: `${stats.draftPosts} drafts`,
      icon: "✅",
      color: "green",
      href: "/admin/posts?status=published",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      change: "Active categories",
      icon: "📁",
      color: "purple",
      href: "/admin/categories",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "All time",
      icon: "👁️",
      color: "orange",
      href: "/admin/analytics",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      change: "Registered users",
      icon: "👥",
      color: "indigo",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {stats.recentPosts.length > 0 ? (
            stats.recentPosts.map((post) => (
              <Link
                key={post._id}
                href={`/admin/posts/${post._id}`}
                className="block px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                    <p className="text-sm text-slate-600 truncate mt-1">
                      {post.excerpt || post.description}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-4 text-sm text-slate-500">
                    <span>{post.views || 0} views</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">
              No posts yet. <Link href="/admin/posts/new" className="text-blue-700 hover:text-blue-800 font-medium">Create your first post</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-2xl">
            ✏️
          </div>
          <div>
            <h3 className="font-semibold">Create New Post</h3>
            <p className="text-sm text-blue-100">Write a new blog post</p>
          </div>
        </Link>

        <Link
          href="/admin/categories/new"
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-2xl">
            📁
          </div>
          <div>
            <h3 className="font-semibold">Add Category</h3>
            <p className="text-sm text-purple-100">Create a new category</p>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-2xl">
            📈
          </div>
          <div>
            <h3 className="font-semibold">View Analytics</h3>
            <p className="text-sm text-green-100">See detailed statistics</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

