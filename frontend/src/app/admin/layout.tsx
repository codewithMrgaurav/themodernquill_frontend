"use client";

import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { useMode } from "@/contexts/ModeContext";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, setMode } = useMode();

  // Ensure mode is set to admin when accessing admin routes
  useEffect(() => {
    if (mode !== "admin") {
      setMode("admin");
    }
  }, [mode, setMode]);

  return (
    <ProtectedAdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdminRoute>
  );
}

