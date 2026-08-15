// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Renders "Harvested 4 hours ago" style freshness strings from an ISO timestamp. */
export function timeSinceHarvest(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "Harvested just now";
    if (hours < 24) return `Harvested ${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `Harvested ${days} day${days > 1 ? "s" : ""} ago`;
}

/** 0–1 freshness score used to size the signature "freshness ring" — decays fully over 72 hours. */
export function freshnessScore(isoDate: string): number {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const hours = diffMs / (1000 * 60 * 60);
    const WINDOW_HOURS = 72;
    return Math.max(0, Math.min(1, 1 - hours / WINDOW_HOURS));
}

export function formatINR(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}