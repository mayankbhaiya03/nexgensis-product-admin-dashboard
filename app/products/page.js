"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="mt-2 text-gray-500">
          Dashboard will be implemented in the next milestone.
        </p>
      </div>
    </div>
  );
}
