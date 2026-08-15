// types/marketplace.ts
// Core domain types for KrishiDirect — kept intentionally flat and serializable
// so they map 1:1 onto whatever API / Firestore / Supabase schema backs the hackathon demo.

export type Category =
    | "tomato"
    | "potato"
    | "onion"
    | "leafy-greens"
    | "fruits"
    | "grains";

export type Unit = "kg" | "quintal";

export type Language = "en" | "hi" | "mr";

export type QualityGrade = "organic" | "standard";

export type UserRole = "farmer" | "vendor";

/** A single farmer-listed harvest, the atomic unit of the marketplace feed. */
export interface CropListing {
    id: string;
    farmerId: string;
    farmerName: string;
    category: Category;
    /** Free-text label shown on the card, e.g. "Deshi Tomato" — optional refinement of category. */
    variety?: string;
    quantity: number;
    unit: Unit;
    pricePerUnit: number;
    /** ISO 8601 timestamp of when the crop was harvested — drives the freshness badge. */
    harvestedAt: string;
    quality: QualityGrade;
    photoUrl?: string;
    village: string;
    district: string;
    /** Straight-line distance in km from the current vendor's location, computed server-side. */
    distanceKm?: number;
    latitude: number;
    longitude: number;
    farmerPhone: string;
    isBulkAvailable: boolean;
    createdAt: string;
}

/** Public-facing farmer profile, separate from CropListing so one farmer can post many crops. */
export interface FarmerProfile {
    id: string;
    name: string;
    phone: string;
    village: string;
    district: string;
    preferredLanguage: Language;
    totalListings: number;
    totalEarnings: number;
    avatarUrl?: string;
    isVerified: boolean;
}

/** The live filter state a vendor manipulates on the marketplace feed. */
export interface BuyerFilter {
    searchQuery: string;
    category: Category | "all";
    maxDistanceKm: number;
    minPrice: number;
    maxPrice: number;
    quality: QualityGrade | "all";
    sortBy: "freshness" | "price-asc" | "price-desc" | "nearest";
}

/** Aggregate figures for the impact / analytics bar. */
export interface ImpactMetrics {
    totalProduceSavedKg: number;
    farmerEarningsBoostPercent: number;
    activeVendorDeals: number;
    /** Trailing delta vs. previous period, purely cosmetic for the demo but keeps the shape realistic. */
    weeklyTrendPercent: number;
}

export interface CategoryMeta {
    id: Category;
    label: Record<Language, string>;
    /** lucide-react icon name, resolved to a component at render time. */
    icon: string;
}