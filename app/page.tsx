// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, HandCoins } from "lucide-react";

import Navbar from "@/components/navbar";
import ImpactStats from "@/components/ImpactStats";
import VendorMarketplaceFeed from "@/components/VendorMarketplaceFeed";
import CropListingModal from "@/components/CropListingModal";

import { useTranslation } from "@/lib/i18n";
import type {
  CropListing,
  ImpactMetrics,
  UserRole,
} from "@/types/marketplace";

// ---------------------------------------------------------------------------
// Demo seed data
// ---------------------------------------------------------------------------

const MOCK_METRICS: ImpactMetrics = {
  totalProduceSavedKg: 1420,
  farmerEarningsBoostPercent: 28,
  activeVendorDeals: 34,
  weeklyTrendPercent: 12,
};

const MOCK_LISTINGS: CropListing[] = [
  {
    id: "1",
    farmerId: "f1",
    farmerName: "Ramesh Patil",
    category: "tomato",
    variety: "Deshi Tomato",
    quantity: 8,
    unit: "quintal",
    pricePerUnit: 22,
    harvestedAt: new Date(
      Date.now() - 4 * 60 * 60 * 1000
    ).toISOString(),
    quality: "standard",
    village: "Hinjewadi",
    district: "Pune",
    distanceKm: 6,
    latitude: 18.59,
    longitude: 73.73,
    farmerPhone: "+919876543210",
    isBulkAvailable: true,
    createdAt: new Date().toISOString(),
  },

  {
    id: "2",
    farmerId: "f2",
    farmerName: "Sunita Jadhav",
    category: "onion",
    quantity: 40,
    unit: "kg",
    pricePerUnit: 18,
    harvestedAt: new Date(
      Date.now() - 20 * 60 * 60 * 1000
    ).toISOString(),
    quality: "organic",
    village: "Wagholi",
    district: "Pune",
    distanceKm: 14,
    latitude: 18.58,
    longitude: 73.98,
    farmerPhone: "+919876500011",
    isBulkAvailable: false,
    createdAt: new Date().toISOString(),
  },

  {
    id: "3",
    farmerId: "f3",
    farmerName: "Ganesh More",
    category: "leafy-greens",
    variety: "Palak",
    quantity: 25,
    unit: "kg",
    pricePerUnit: 12,
    harvestedAt: new Date(
      Date.now() - 2 * 60 * 60 * 1000
    ).toISOString(),
    quality: "organic",
    village: "Baner",
    district: "Pune",
    distanceKm: 3,
    latitude: 18.56,
    longitude: 73.78,
    farmerPhone: "+919876511122",
    isBulkAvailable: false,
    createdAt: new Date().toISOString(),
  },

  {
    id: "4",
    farmerId: "f4",
    farmerName: "Vitthal Kale",
    category: "grains",
    variety: "Jowar",
    quantity: 12,
    unit: "quintal",
    pricePerUnit: 30,
    harvestedAt: new Date(
      Date.now() - 50 * 60 * 60 * 1000
    ).toISOString(),
    quality: "standard",
    village: "Shirur",
    district: "Pune",
    distanceKm: 28,
    latitude: 18.83,
    longitude: 74.37,
    farmerPhone: "+919876522233",
    isBulkAvailable: true,
    createdAt: new Date().toISOString(),
  },

  {
    id: "5",
    farmerId: "f5",
    farmerName: "Meena Shinde",
    category: "fruits",
    variety: "Alphonso Mango",
    quantity: 6,
    unit: "quintal",
    pricePerUnit: 85,
    harvestedAt: new Date(
      Date.now() - 8 * 60 * 60 * 1000
    ).toISOString(),
    quality: "organic",
    village: "Mulshi",
    district: "Pune",
    distanceKm: 19,
    latitude: 18.53,
    longitude: 73.5,
    farmerPhone: "+919876533344",
    isBulkAvailable: true,
    createdAt: new Date().toISOString(),
  },

  {
    id: "6",
    farmerId: "f6",
    farmerName: "Arjun Pawar",
    category: "potato",
    quantity: 15,
    unit: "quintal",
    pricePerUnit: 16,
    harvestedAt: new Date(
      Date.now() - 30 * 60 * 60 * 1000
    ).toISOString(),
    quality: "standard",
    village: "Chakan",
    district: "Pune",
    distanceKm: 22,
    latitude: 18.76,
    longitude: 73.86,
    farmerPhone: "+919876544455",
    isBulkAvailable: true,
    createdAt: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { t } = useTranslation();

  const [role, setRole] = useState<UserRole>("farmer");

  const [listings, setListings] =
    useState<CropListing[]>(MOCK_LISTINGS);

  const [modalOpen, setModalOpen] = useState(false);

  // -------------------------------------------------------------------------
  // Create new farmer listing
  // -------------------------------------------------------------------------

  const handleNewListing = (
    partial: Partial<CropListing>
  ) => {
    const newListing: CropListing = {
      id: crypto.randomUUID(),

      farmerId: "self",
      farmerName: "You",

      category: partial.category ?? "tomato",

      quantity: partial.quantity ?? 1,

      unit: partial.unit ?? "kg",

      pricePerUnit:
        partial.pricePerUnit ?? 0,

      harvestedAt:
        partial.harvestedAt ??
        new Date().toISOString(),

      quality:
        partial.quality ?? "standard",

      village: "Your village",

      district: "Pune",

      distanceKm: 0,

      latitude: 18.52,

      longitude: 73.85,

      farmerPhone: "+919999999999",

      isBulkAvailable:
        partial.isBulkAvailable ?? false,

      createdAt:
        new Date().toISOString(),
    };

    setListings((prev) => [
      newListing,
      ...prev,
    ]);
  };

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FBF7EF]">

      {/* NAVBAR */}
      <Navbar
        role={role}
        onRoleChange={setRole}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">

        {/* IMPACT STATS */}
        <div className="mb-6 w-full">
          <ImpactStats
            metrics={MOCK_METRICS}
          />
        </div>

        {/* ================================================================ */}
        {/* VENDOR VIEW                                                      */}
        {/* ================================================================ */}

        {role === "vendor" ? (
          <>
            <h1 className="mb-4 font-serif text-2xl font-semibold text-[#1B4332]">
              {t("dashboard.freshNearYou")}
            </h1>

            <VendorMarketplaceFeed
              listings={listings}
            />
          </>
        ) : (

          /* ================================================================
             FARMER VIEW
             ================================================================ */

          <div className="w-full">

            {/* Farmer welcome card */}
            <div className="rounded-3xl border border-dashed border-[#E4DCC8] bg-white p-6 text-center sm:p-10">

              <h1 className="mb-2 font-serif text-2xl font-semibold text-[#1B4332]">
                {t("dashboard.heroTitle")}
              </h1>

              <p className="mx-auto mb-6 max-w-sm text-sm text-[#8A8370]">
                {t("dashboard.heroDescription")}
              </p>

              {/* Post Harvest */}
              <button
                onClick={() =>
                  setModalOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1B4332] px-6 py-3.5 text-sm font-semibold text-[#FBF7EF] shadow-lg transition-transform active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />

                {t(
                  "dashboard.postNewHarvest"
                )}
              </button>

            </div>

            {/* ============================================================ */}
            {/* FARMER OFFERS BUTTON                                         */}
            {/* ============================================================ */}

            <div className="mt-6 rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF1EC]">

                      <HandCoins className="h-5 w-5 text-[#1B4332]" />

                    </div>

                    <div>

                      <h2 className="font-serif text-xl font-semibold text-[#1B4332]">
                        Offers Received
                      </h2>

                      <p className="text-xs text-[#8A8370]">
                        View and manage offers from vendors
                      </p>

                    </div>

                  </div>

                </div>

                {/* BUTTON TO FARMER OFFERS PAGE */}

                <Link
                  href="/farmer-offers"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1B4332] px-5 py-3 text-sm font-semibold text-[#FBF7EF] shadow-md transition-all hover:bg-[#2D6A4F] active:scale-[0.98]"
                >

                  <HandCoins className="h-4 w-4" />

                  View Offers Received

                </Link>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* ================================================================ */}
      {/* FLOATING FARMER BUTTON                                           */}
      {/* ================================================================ */}

      {role === "farmer" && (
        <button
          onClick={() =>
            setModalOpen(true)
          }
          aria-label="Post new harvest"
          className="fixed bottom-6 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#E8A33D] text-[#1B4332] shadow-xl transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* ================================================================ */}
      {/* CROP LISTING MODAL                                               */}
      {/* ================================================================ */}

      <CropListingModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleNewListing}
      />

    </div>
  );
}
