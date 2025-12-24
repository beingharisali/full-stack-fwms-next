"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "manager" | "driver")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="flex justify-center items-center h-64">Access Denied</div>;
  }

  return <>{children}</>;
}