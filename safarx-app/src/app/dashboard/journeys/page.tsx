"use client";

// Firestore requires a composite index when combining where() and orderBy()
// on different fields (userId + createdAt). If the index does not exist yet,
// Firestore throws a failed-precondition error and provides a URL to create it.
// onSnapshot is used instead of getDocs so the list updates in real time
// without a manual page refresh whenever a journey is added or removed.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Timestamp,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

interface Journey {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string; isIndexError: boolean }
  | { status: "ready"; journeys: Journey[] };

export default function JourneysPage() {
  const { user } = useAuth();
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!user) return;

    setState({ status: "loading" });

    // Composite index required: (userId ASC, createdAt DESC)
    // Firebase will log a direct link to create it on first run if missing.
    const q = query(
      collection(db, "journeys"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const journeys: Journey[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Journey, "id">),
        }));
        setState({ status: "ready", journeys });
      },
      (error: FirestoreError) => {
        const isIndexError = error.code === "failed-precondition";
        setState({
          status: "error",
          isIndexError,
          message: isIndexError
            ? "A Firestore composite index is required for this query. Check your browser console for the index creation link."
            : "Failed to load journeys. Please refresh the page.",
        });
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Journeys</h1>
          <p className="text-zinc-500 text-sm mt-1">All your travel journeys</p>
        </div>
        <Link
          href="/dashboard/journeys/new"
          className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300"
        >
          + New Journey
        </Link>
      </div>

      {state.status === "loading" && <LoadingSkeleton />}

      {state.status === "error" && (
        <ErrorCard message={state.message} isIndexError={state.isIndexError} />
      )}

      {state.status === "ready" && state.journeys.length === 0 && <EmptyState />}

      {state.status === "ready" && state.journeys.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-3 animate-pulse"
        >
          <div className="h-4 w-3/4 bg-zinc-800 rounded-lg" />
          <div className="h-3 w-1/3 bg-zinc-800 rounded-lg" />
          <div className="h-3 w-full bg-zinc-800 rounded-lg mt-1" />
          <div className="h-3 w-5/6 bg-zinc-800 rounded-lg" />
          <div className="h-3 w-1/2 bg-zinc-800 rounded-lg mt-auto pt-3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-2xl">
        🗺️
      </div>
      <p className="text-white font-semibold text-base">No journeys yet</p>
      <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
        Create your first journey to start tracking your travels.
      </p>
      <Link
        href="/dashboard/journeys/new"
        className="inline-block mt-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl px-5 py-2.5 transition-all duration-300"
      >
        Create journey
      </Link>
    </div>
  );
}

function ErrorCard({ message, isIndexError }: { message: string; isIndexError: boolean }) {
  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8">
      <p className="text-red-400 font-semibold text-sm">
        {isIndexError ? "Index required" : "Something went wrong"}
      </p>
      <p className="text-red-300/70 text-sm mt-2 leading-relaxed">{message}</p>
      {isIndexError && (
        <p className="text-zinc-500 text-xs mt-4">
          Open your browser&apos;s developer console, find the Firebase URL, and click it to create
          the composite index. The page will work automatically once the index is ready (~1 min).
        </p>
      )}
    </div>
  );
}

function JourneyCard({ journey }: { journey: Journey }) {
  const fmt = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const startFormatted = journey.startDate ? fmt(journey.startDate) : null;
  const endFormatted = journey.endDate ? fmt(journey.endDate) : null;
  const createdFormatted = journey.createdAt
    ? journey.createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="group bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer flex flex-col gap-3">
      <div>
        <h3 className="text-white font-semibold text-base truncate">{journey.title}</h3>
        {startFormatted && (
          <p className="text-blue-400 text-xs font-medium mt-1">
            {startFormatted}
            {endFormatted ? ` → ${endFormatted}` : ""}
          </p>
        )}
      </div>
      {journey.description && (
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
          {journey.description}
        </p>
      )}
      {createdFormatted && (
        <p className="text-zinc-600 text-xs mt-auto pt-3 border-t border-zinc-800/60">
          Created {createdFormatted}
        </p>
      )}
    </div>
  );
}
