"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading…</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const displayName = user.displayName ?? user.email?.split("@")[0] ?? "Traveller";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-white tracking-tight">SafarX</span>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-xl px-4 py-2 transition-colors duration-200"
        >
          Sign out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-400 text-sm font-medium">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white mt-0.5 truncate">{displayName}</h1>
              <p className="text-zinc-500 text-sm mt-1 truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Journeys" value="0" />
            <StatCard label="Places visited" value="0" />
            <StatCard label="Memories" value="0" />
          </div>
        </div>

        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-base font-semibold text-white mb-1">Your journeys</h2>
          <p className="text-zinc-500 text-sm">You haven&apos;t created any journeys yet. Start exploring!</p>
          <button className="mt-5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-colors duration-200">
            Create your first journey
          </button>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-zinc-400 text-sm mt-1">{label}</p>
    </div>
  );
}
