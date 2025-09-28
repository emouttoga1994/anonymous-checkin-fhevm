"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct port
    if (window.location.port === "3000") {
      window.location.href = "http://localhost:3002";
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to the correct port...</p>
        <p className="text-sm text-muted-foreground mt-2">
          If you're not redirected automatically, please go to{" "}
          <a href="http://localhost:3002" className="text-primary underline">
            http://localhost:3002
          </a>
        </p>
      </div>
    </div>
  );
}
