"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Journeys", href: "/dashboard/journeys" },
  { label: "Places", href: "/dashboard/places" },
  { label: "Settings", href: "/dashboard/settings" },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const signingOut = useRef(false);

  useEffect(() => {
    if (!loading && !user && !signingOut.current) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    signingOut.current = true;
    await logoutUser();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-zinc-950 border-r border-zinc-900 sticky top-0 h-screen">
        <div className="px-6 py-7 border-b border-zinc-900">
          <span className="text-xl font-bold text-white tracking-tight">SafarX</span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-5 border-t border-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl px-4 py-2.5 text-left transition-all duration-200"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-50 bg-zinc-950 border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white tracking-tight">SafarX</span>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-2 transition-all duration-200"
          >
            Sign out
          </button>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
