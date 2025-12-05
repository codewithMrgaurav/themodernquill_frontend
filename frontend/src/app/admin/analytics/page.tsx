"use client";

import { useEffect, useState } from "react";
import { api, endpoints, Post } from "@/lib/api";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    averageViews: 0,
    topPosts: [] as Post[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoints.posts, { limit: 100 }, false);
      const posts = response.success && response.data ? (response.data as Post[]) : [];

      const publishedPosts = posts.filter((p) => p.status === "published");
      const draftPosts = posts.filter((p) => p.status === "draft");
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const averageViews = publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0;
      const topPosts = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 10);

      setStats({
        totalViews,
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        averageViews,
        topPosts,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">
          View detailed statistics and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Views</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">👁️</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Posts</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.totalPosts}
              </p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Published</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.publishedPosts}
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Views</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats.averageViews.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Top Performing Posts</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {stats.topPosts.length > 0 ? (
            stats.topPosts.map((post, index) => (
              <div key={post._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {post.category?.name || "Uncategorized"} • {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-lg font-bold text-slate-900">{post.views || 0}</p>
                    <p className="text-xs text-slate-500">views</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">
              No posts available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

