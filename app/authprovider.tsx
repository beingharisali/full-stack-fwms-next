"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Authprovider({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/signup"); 
      return;
    }

    if (!allowedRoles.includes(role || "")) {
      router.push("/unauthorized");
    }
  }, []);

  return <>{children}</>;
}
