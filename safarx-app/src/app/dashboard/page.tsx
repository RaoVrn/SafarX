"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

/* ─────────────────── Types ─────────────────── */

interface JourneyDoc {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

interface PlaceDoc {
  id: string;
  userId: string;
  journeyId: string;
  name: string;
  country: string;
  createdAt: Timestamp;
}

interface MemoryDoc {
  id: string;
  userId: string;
  journeyId: string;
  title: string;
  createdAt: Timestamp;
}

interface DashboardStats {
  journeys: number;
  places: number;
  memories: number;
  countries: number;
  lastJourneyDate: Timestamp | null;
}

interface JourneyProgress {
  id: string;
  title: string;
  placeCount: number;
}

/* ─────────────────── Helpers ─────────────────── */

function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAccountDate(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/* ─────────────────── Icons ─────────────────── */

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a14.6 14.6 0 0 1 0 18M12 3a14.6 14.6 0 0 0 0 18" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 15 5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5A7 7 0 0 0 5 4v15a7 7 0 0 1 7 2.5A7 7 0 0 1 19 19V4a7 7 0 0 0-7 2.5Z" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="2" x2="8" y2="18" strokeLinecap="round" />
      <line x1="16" y1="6" x2="16" y2="22" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 4.8L20 8l-4.8 2.4L12 18l-2.4-4.8L4 8l4.8-2.4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l.7 1.4 1.4.7-1.4.7L4 20l-.7-1.4L2 18l1.4-.7z" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ─────────────────── UI primitives ─────────────────── */

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-zinc-800/70 rounded-lg animate-pulse ${className}`} />;
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-base font-semibold text-zinc-300 tracking-tight">{title}</h2>;
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-zinc-900 border border-zinc-800/60 rounded-2xl">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-zinc-300 text-sm font-semibold">{title}</p>
      <p className="text-zinc-600 text-xs mt-1.5 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-medium rounded-xl px-4 py-2.5 transition-all duration-300"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          {action.label}
        </Link>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  loading,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  accent: string;
}) {
  return (
    <div className="group relative bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-300 overflow-hidden h-full">
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <SkeletonBlock className="w-16 h-9 mb-3" />
              <SkeletonBlock className="w-24 h-3.5" />
            </>
          ) : (
            <>
              <p className="text-4xl font-bold text-white tabular-nums tracking-tight">{value}</p>
              <p className="text-zinc-500 text-sm font-medium mt-2">{label}</p>
            </>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white/70 ${accent} bg-opacity-15`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function RecentJourneyCard({ journey }: { journey: JourneyDoc }) {
  return (
    <Link
      href="/dashboard/journeys"
      className="group flex items-start gap-4 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
        <MapPinIcon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate group-hover:text-blue-300 transition-colors duration-200">
          {journey.title}
        </p>
        {journey.description && (
          <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{journey.description}</p>
        )}
        <p className="text-zinc-600 text-xs mt-2">{formatDate(journey.createdAt)}</p>
      </div>
      <ChevronRightIcon className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors duration-200 shrink-0 mt-0.5" />
    </Link>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  glow,
  border,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  glow: string;
  border: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative bg-zinc-900 border ${border} rounded-2xl p-6 hover:bg-zinc-800/50 transition-all duration-300 flex flex-col gap-4 overflow-hidden`}
    >
      <div className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 ${glow}`} />
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${border} bg-zinc-800/60`}>
        {icon}
      </div>
      <div>
        <p className="text-white text-sm font-semibold group-hover:text-blue-300 transition-colors duration-200">{title}</p>
        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function InsightCard({
  icon,
  borderClass,
  loading,
  children,
}: {
  icon: React.ReactNode;
  borderClass: string;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-start gap-4 bg-zinc-900 border ${borderClass} rounded-2xl p-5 hover:bg-zinc-800/40 transition-all duration-300`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-zinc-800/60 border ${borderClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="space-y-2">
            <SkeletonBlock className="w-40 h-3.5" />
            <SkeletonBlock className="w-56 h-3" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Main Page ─────────────────── */

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    journeys: 0,
    places: 0,
    memories: 0,
    countries: 0,
    lastJourneyDate: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [recentJourneys, setRecentJourneys] = useState<JourneyDoc[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  const [allJourneys, setAllJourneys] = useState<JourneyDoc[]>([]);
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress[]>([]);

  const [journeysThisYear, setJourneysThisYear] = useState(0);

  /* ── Journeys listener ── */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "journeys"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as JourneyDoc)
        );
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        const thisYearCount = docs.filter(
          (j) => (j.createdAt?.toMillis?.() ?? 0) >= startOfYear
        ).length;

        setStats((prev) => ({
          ...prev,
          journeys: snapshot.size,
          lastJourneyDate: docs[0]?.createdAt ?? null,
        }));
        setJourneysThisYear(thisYearCount);
        setRecentJourneys(docs.slice(0, 3));
        setAllJourneys(docs);
        setStatsLoading(false);
        setRecentLoading(false);
      },
      (err: FirestoreError) => {
        console.error("journeys snapshot error", err);
        if (err.code === "permission-denied") {
          setStatsError("Permission denied — deploy Firestore security rules (see firestore.rules).");
        } else if (err.code === "failed-precondition") {
          setStatsError("Missing Firestore index — check the browser console for the index creation link.");
        } else {
          setStatsError("Failed to load journey data. Please refresh.");
        }
        setStatsLoading(false);
        setRecentLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  /* ── Places listener ── */
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "places"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() } as PlaceDoc)
        );
        const uniqueCountries = new Set(
          docs.map((p) => p.country).filter(Boolean)
        );
        const placeMap = new Map<string, number>();
        docs.forEach((p) => {
          if (p.journeyId) {
            placeMap.set(p.journeyId, (placeMap.get(p.journeyId) ?? 0) + 1);
          }
        });

        setStats((prev) => ({
          ...prev,
          places: snapshot.size,
          countries: uniqueCountries.size,
        }));
        setJourneyProgress(
          allJourneys.slice(0, 6).map((j) => ({
            id: j.id,
            title: j.title,
            placeCount: placeMap.get(j.id) ?? 0,
          }))
        );
      },
      (err) => console.error("places snapshot error", err)
    );

    return () => unsubscribe();
  }, [user, allJourneys]);

  /* ── Memories listener ── */
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "memories"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setStats((prev) => ({ ...prev, memories: snapshot.size }));
      },
      (err) => console.error("memories snapshot error", err)
    );

    return () => unsubscribe();
  }, [user]);

  /* ── Derived ── */
  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "Traveller";
  const initials = getInitials(displayName);
  const maxPlaces = Math.max(...journeyProgress.map((j) => j.placeCount), 1);
  const currentYear = new Date().getFullYear();
  const avgPlacesPerJourney =
    stats.journeys > 0 ? (stats.places / stats.journeys).toFixed(1) : null;
  const avgMemoriesPerJourney =
    stats.journeys > 0 ? (stats.memories / stats.journeys).toFixed(1) : null;
  const daysSinceLastJourney: number | null = stats.lastJourneyDate
    ? Math.floor(
        (Date.now() - stats.lastJourneyDate.toMillis()) / (1000 * 60 * 60 * 24)
      )
    : null;

  /* ── Error state ── */
  if (statsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-xl font-bold">!</span>
        </div>
        <p className="text-zinc-400 text-sm">{statsError}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 rounded-lg px-4 py-2 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Your SafarX dashboard at a glance</p>
        </div>
        <Link
          href="/dashboard/journeys/new"
          className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300 shadow-lg shadow-blue-900/30"
        >
          <PlusIcon className="w-4 h-4" />
          New Journey
        </Link>
      </div>

      {/* ── 1. Welcome card ── */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/30">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
              Welcome back
            </p>
            <p className="text-2xl font-bold text-white mt-1 truncate">{displayName}</p>
            <p className="text-zinc-500 text-sm mt-0.5 truncate">{user?.email}</p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1 text-right shrink-0">
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-semibold">
              Member since
            </p>
            <p className="text-zinc-400 text-sm font-medium">
              {formatAccountDate(
                user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).getTime()
                  : null
              )}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Active
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Stats grid ── */}
      <section>
        <SectionHeader title="At a Glance" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <StatCard
            label="Journeys"
            value={stats.journeys}
            loading={statsLoading}
            icon={<BookOpenIcon className="w-5 h-5" />}
            accent="bg-blue-500"
          />
          <StatCard
            label="Places"
            value={stats.places}
            loading={statsLoading}
            icon={<MapPinIcon className="w-5 h-5" />}
            accent="bg-violet-500"
          />
          <StatCard
            label="Memories"
            value={stats.memories}
            loading={statsLoading}
            icon={<PhotoIcon className="w-5 h-5" />}
            accent="bg-pink-500"
          />
          <StatCard
            label="Countries"
            value={stats.countries}
            loading={statsLoading}
            icon={<GlobeIcon className="w-5 h-5" />}
            accent="bg-emerald-500"
          />
        </div>
      </section>

      {/* ── 3. Recent journeys ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Recent Journeys" />
          {recentJourneys.length > 0 && (
            <Link
              href="/dashboard/journeys"
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors duration-200"
            >
              View all <ChevronRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 bg-zinc-900 border border-zinc-800/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recentJourneys.length === 0 ? (
          <EmptyState
            icon={<BookOpenIcon className="w-6 h-6 text-zinc-600" />}
            title="No journeys yet"
            description="Create your first journey to start building your travel story."
            action={{ label: "Start a Journey", href: "/dashboard/journeys/new" }}
          />
        ) : (
          <div className="space-y-3">
            {recentJourneys.map((j) => (
              <RecentJourneyCard key={j.id} journey={j} />
            ))}
          </div>
        )}
      </section>

      {/* ── 4. Quick actions ── */}
      <section>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <QuickActionCard
            href="/dashboard/journeys/new"
            icon={<PlusIcon className="w-5 h-5 text-blue-400" />}
            title="New Journey"
            description="Start documenting a new adventure or trip."
            glow="bg-blue-500"
            border="border-blue-500/20"
          />
          <QuickActionCard
            href="/dashboard/places"
            icon={<MapPinIcon className="w-5 h-5 text-violet-400" />}
            title="Add Place"
            description="Pin a location to one of your journeys."
            glow="bg-violet-500"
            border="border-violet-500/20"
          />
          <QuickActionCard
            href="/dashboard/memories"
            icon={<CameraIcon className="w-5 h-5 text-pink-400" />}
            title="Add Memory"
            description="Capture a moment with photos and notes."
            glow="bg-pink-500"
            border="border-pink-500/20"
          />
          <QuickActionCard
            href="/dashboard/map"
            icon={<MapIcon className="w-5 h-5 text-emerald-400" />}
            title="View Map"
            description="Explore all your places on an interactive map."
            glow="bg-emerald-500"
            border="border-emerald-500/20"
          />
        </div>
      </section>

      {/* ── 5. Journey progress — hidden when empty ── */}
      {!statsLoading && allJourneys.length > 0 && (
        <section>
          <SectionHeader title="Journey Progress" />
          <div className="mt-4 bg-zinc-900 border border-zinc-800/60 rounded-2xl divide-y divide-zinc-800/60 overflow-hidden">
            {allJourneys.slice(0, 6).map((j) => {
              const progress = journeyProgress.find((p) => p.id === j.id);
              const placeCount = progress?.placeCount ?? 0;
              return (
                <div
                  key={j.id}
                  className="px-6 py-4 hover:bg-zinc-800/30 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <p className="text-zinc-200 text-sm font-medium truncate flex-1">{j.title}</p>
                    <span className="text-zinc-500 text-xs shrink-0 tabular-nums">
                      {placeCount} {placeCount === 1 ? "place" : "places"}
                    </span>
                  </div>
                  <ProgressBar value={placeCount} max={maxPlaces} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. Insights — only rendered once journeys exist ── */}
      {!statsLoading && stats.journeys > 0 && (
        <section>
          <SectionHeader title="Insights" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Days since last journey */}
            <InsightCard
              icon={<ClockIcon className="w-5 h-5 text-amber-400" />}
              borderClass="border-amber-500/20"
              loading={false}
            >
              <p className="text-zinc-200 text-sm font-semibold">
                {daysSinceLastJourney === 0
                  ? "Last journey was today"
                  : daysSinceLastJourney === 1
                  ? "Last journey was yesterday"
                  : `Last journey was ${daysSinceLastJourney} days ago`}
              </p>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                {(daysSinceLastJourney ?? 0) <= 7
                  ? "You are actively exploring — great momentum."
                  : "Time for a new adventure?"}
              </p>
            </InsightCard>

            {/* Journeys this year */}
            <InsightCard
              icon={<SparklesIcon className="w-5 h-5 text-blue-400" />}
              borderClass="border-blue-500/20"
              loading={false}
            >
              <p className="text-zinc-200 text-sm font-semibold">
                {journeysThisYear === 0
                  ? `No journeys started in ${currentYear}`
                  : `${journeysThisYear} ${journeysThisYear === 1 ? "journey" : "journeys"} in ${currentYear}`}
              </p>
              <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                {journeysThisYear === 0
                  ? "Start your first journey of the year."
                  : journeysThisYear >= 5
                  ? "An impressive year of travel so far."
                  : "Keep the momentum going this year."}
              </p>
            </InsightCard>

            {/* Avg places per journey */}
            {avgPlacesPerJourney !== null && (
              <InsightCard
                icon={<MapPinIcon className="w-5 h-5 text-violet-400" />}
                borderClass="border-violet-500/20"
                loading={false}
              >
                <p className="text-zinc-200 text-sm font-semibold">
                  {avgPlacesPerJourney} places per journey on average
                </p>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                  {parseFloat(avgPlacesPerJourney) >= 5
                    ? "Rich, detailed journeys — you explore thoroughly."
                    : "Add more places to enrich your journeys."}
                </p>
              </InsightCard>
            )}

            {/* Avg memories per journey */}
            {avgMemoriesPerJourney !== null && (
              <InsightCard
                icon={<PhotoIcon className="w-5 h-5 text-pink-400" />}
                borderClass="border-pink-500/20"
                loading={false}
              >
                <p className="text-zinc-200 text-sm font-semibold">
                  {avgMemoriesPerJourney} memories per journey on average
                </p>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                  {parseFloat(avgMemoriesPerJourney) >= 3
                    ? "Well-documented journeys — every moment preserved."
                    : "Capture more moments to bring your journeys to life."}
                </p>
              </InsightCard>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
