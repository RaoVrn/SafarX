"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

interface Stats {
  journeys: number;
  places: number;
  memories: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ journeys: 0, places: 0, memories: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "journeys"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStats((prev) => ({ ...prev, journeys: snapshot.size }));
      setStatsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Traveller";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Your SafarX dashboard at a glance</p>
        </div>
        <Link
          href="/dashboard/journeys/new"
          className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300"
        >
          + New Journey
        </Link>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-blue-900/30">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Welcome back</p>
            <p className="text-xl font-bold text-white mt-1 truncate">{displayName}</p>
            <p className="text-zinc-600 text-sm mt-0.5 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Journeys" value={stats.journeys} loading={statsLoading} />
        <StatCard label="Places visited" value={stats.places} loading={false} />
        <StatCard label="Memories" value={stats.memories} loading={false} />
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white">Your journeys</h2>
        {stats.journeys === 0 && !statsLoading ? (
          <>
            <p className="text-zinc-500 text-sm mt-2">
              You haven&apos;t created any journeys yet. Start exploring the world.
            </p>
            <Link
              href="/dashboard/journeys/new"
              className="inline-block mt-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300"
            >
              Create your first journey
            </Link>
          </>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mt-2">
              You have {stats.journeys} journey{stats.journeys !== 1 ? "s" : ""} logged.
            </p>
            <Link
              href="/dashboard/journeys"
              className="inline-block mt-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300"
            >
              View all journeys
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="group bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700 hover:from-zinc-800/80 hover:to-zinc-900/80 transition-all duration-300">
      {loading ? (
        <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse" />
      ) : (
        <p className="text-5xl font-bold text-white tabular-nums">{value}</p>
      )}
      <p className="text-zinc-500 text-sm mt-3 font-medium">{label}</p>
    </div>
  );
}
