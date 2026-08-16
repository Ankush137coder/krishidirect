// components/VendorMarketplaceFeed.tsx
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    SlidersHorizontal,
    MapPin,
    Phone,
    MessageCircle,
    Package,
    Leaf,
    X,
    Send,
    CheckCircle,
} from "lucide-react";
import {
    cn,
    formatINR,
    freshnessScore,
    timeSinceHarvest,
} from "@/lib/utils";
import {
    useTranslation,
    type TranslationKey,
} from "@/lib/i18n";
import type {
    BuyerFilter,
    CropListing,
} from "@/types/marketplace";
import {
    saveOffer,
    type MarketplaceOffer,
} from "@/lib/marketplaceOffers";

/** Freshness ring */
function FreshnessRing({ isoDate }: { isoDate: string }) {
    const score = freshnessScore(isoDate);
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score);

    return (
        <div className="relative grid h-10 w-10 place-items-center">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke="#E4DCC8"
                    strokeWidth="3"
                />

                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={
                        score > 0.5
                            ? "#2D6A4F"
                            : score > 0.2
                            ? "#E8A33D"
                            : "#C4622D"
                    }
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>

            <Leaf className="absolute h-4 w-4 text-[#1B4332]" strokeWidth={2} />
        </div>
    );
}

interface VendorMarketplaceFeedProps {
    listings: CropListing[];
}

const DEFAULT_FILTER: BuyerFilter = {
    searchQuery: "",
    category: "all",
    maxDistanceKm: 25,
    minPrice: 0,
    maxPrice: 10000,
    quality: "all",
    sortBy: "freshness",
};

const SORT_LABEL_KEY: Record<
    BuyerFilter["sortBy"],
    TranslationKey
> = {
    freshness: "feed.sortFreshness",
    "price-asc": "feed.sortPriceAsc",
    "price-desc": "feed.sortPriceDesc",
    nearest: "feed.sortNearest",
};

const QUALITY_LABEL_KEY: Record<
    "all" | "organic" | "standard",
    TranslationKey
> = {
    all: "feed.qualityAll",
    organic: "feed.qualityOrganic",
    standard: "feed.qualityStandard",
};

export default function VendorMarketplaceFeed({
    listings,
}: VendorMarketplaceFeedProps) {
    const { t } = useTranslation();

    const [filter, setFilter] =
        useState<BuyerFilter>(DEFAULT_FILTER);

    const [filtersOpen, setFiltersOpen] =
        useState(false);

    /* Offer modal */
    const [offerListing, setOfferListing] =
        useState<CropListing | null>(null);

    const [offerQuantity, setOfferQuantity] =
        useState(100);

    const [offerPrice, setOfferPrice] =
        useState(27);

    const [offerSending, setOfferSending] =
        useState(false);

    const [offerSuccess, setOfferSuccess] =
        useState(false);

    const filtered = useMemo(() => {
        let result = listings.filter((l) => {
            if (
                filter.searchQuery &&
                !l.category.includes(
                    filter.searchQuery.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                filter.category !== "all" &&
                l.category !== filter.category
            ) {
                return false;
            }

            if (
                (l.distanceKm ?? 0) >
                filter.maxDistanceKm
            ) {
                return false;
            }

            if (
                filter.quality !== "all" &&
                l.quality !== filter.quality
            ) {
                return false;
            }

            return true;
        });

        switch (filter.sortBy) {
            case "price-asc":
                result = [...result].sort(
                    (a, b) =>
                        a.pricePerUnit -
                        b.pricePerUnit
                );
                break;

            case "price-desc":
                result = [...result].sort(
                    (a, b) =>
                        b.pricePerUnit -
                        a.pricePerUnit
                );
                break;

            case "nearest":
                result = [...result].sort(
                    (a, b) =>
                        (a.distanceKm ?? 0) -
                        (b.distanceKm ?? 0)
                );
                break;

            default:
                result = [...result].sort(
                    (a, b) =>
                        new Date(
                            b.harvestedAt
                        ).getTime() -
                        new Date(
                            a.harvestedAt
                        ).getTime()
                );
        }

        return result;
    }, [listings, filter]);

    /* Open offer modal */
    const openOfferModal = (
        listing: CropListing
    ) => {
        setOfferListing(listing);

        setOfferQuantity(
            Math.min(100, listing.quantity * 100)
        );

        setOfferPrice(
            Math.round(listing.pricePerUnit)
        );

        setOfferSuccess(false);
    };

    /* Send offer */
    const handleSendOffer = () => {
        if (!offerListing) return;

        setOfferSending(true);

        const offer: MarketplaceOffer = {
            id: `offer-${Date.now()}`,
            listingId: offerListing.id,

            vendorName: "Vendor A",
            vendorPhone: "9999999999",

            farmerId: offerListing.farmerId,
            farmerName: offerListing.farmerName,

            crop: offerListing.category,

            quantity: offerQuantity,
            unit: "kg",

            offeredPricePerUnit:
                offerPrice,

            originalPricePerUnit:
                offerListing.pricePerUnit,

            status: "pending",

            dealStage: "offer-received",

            createdAt:
                new Date().toISOString(),
        };

        setTimeout(() => {
            saveOffer(offer);

            setOfferSending(false);
            setOfferSuccess(true);

            setTimeout(() => {
                setOfferListing(null);
                setOfferSuccess(false);
            }, 1400);
        }, 500);
    };

    return (
        <div>
            {/* FILTER BAR */}
            <div className="mb-5 space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8370]" />

                        <input
                            value={
                                filter.searchQuery
                            }
                            onChange={(e) =>
                                setFilter((f) => ({
                                    ...f,
                                    searchQuery:
                                        e.target.value,
                                }))
                            }
                            placeholder={t(
                                "feed.searchPlaceholder"
                            )}
                            className="w-full rounded-xl border border-[#E4DCC8] bg-white py-2.5 pl-9 pr-3 text-sm text-[#3D4A42] outline-none focus-visible:border-[#1B4332]"
                        />
                    </div>

                    <button
                        onClick={() =>
                            setFiltersOpen(
                                (v) => !v
                            )
                        }
                        aria-expanded={
                            filtersOpen
                        }
                        className={cn(
                            "flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors",

                            filtersOpen
                                ? "border-[#1B4332] bg-[#1B4332] text-[#FBF7EF]"
                                : "border-[#E4DCC8] bg-white text-[#3D4A42]"
                        )}
                    >
                        <SlidersHorizontal className="h-4 w-4" />

                        {t("feed.filters")}
                    </button>
                </div>

                {filtersOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                        }}
                        className="space-y-4 rounded-2xl border border-[#E4DCC8] bg-white p-4"
                    >
                        <div>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                <span className="font-medium text-[#3D4A42]">
                                    {t(
                                        "feed.distance"
                                    )}
                                </span>

                                <span className="text-[#8A8370]">
                                    {t(
                                        "feed.distanceWithin",
                                        {
                                            km: filter.maxDistanceKm,
                                        }
                                    )}
                                </span>
                            </div>

                            <input
                                type="range"
                                min={5}
                                max={50}
                                step={5}
                                value={
                                    filter.maxDistanceKm
                                }
                                onChange={(e) =>
                                    setFilter(
                                        (f) => ({
                                            ...f,
                                            maxDistanceKm:
                                                Number(
                                                    e
                                                        .target
                                                        .value
                                                ),
                                        })
                                    )
                                }
                                className="w-full accent-[#1B4332]"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(
                                [
                                    "freshness",
                                    "price-asc",
                                    "price-desc",
                                    "nearest",
                                ] as const
                            ).map(
                                (sort) => (
                                    <button
                                        key={
                                            sort
                                        }
                                        onClick={() =>
                                            setFilter(
                                                (
                                                    f
                                                ) => ({
                                                    ...f,
                                                    sortBy:
                                                        sort,
                                                })
                                            )
                                        }
                                        className={cn(
                                            "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",

                                            filter.sortBy ===
                                                sort
                                                ? "border-[#1B4332] bg-[#1B4332] text-[#FBF7EF]"
                                                : "border-[#E4DCC8] text-[#3D4A42]"
                                        )}
                                    >
                                        {t(
                                            SORT_LABEL_KEY[
                                                sort
                                            ]
                                        )}
                                    </button>
                                )
                            )}
                        </div>

                        <div className="flex gap-2">
                            {(
                                [
                                    "all",
                                    "organic",
                                    "standard",
                                ] as const
                            ).map((q) => (
                                <button
                                    key={q}
                                    onClick={() =>
                                        setFilter(
                                            (f) => ({
                                                ...f,
                                                quality:
                                                    q,
                                            })
                                        )
                                    }
                                    className={cn(
                                        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",

                                        filter.quality ===
                                            q
                                            ? "border-[#C4622D] bg-[#FCEFE3] text-[#C4622D]"
                                            : "border-[#E4DCC8] text-[#3D4A42]"
                                    )}
                                >
                                    {t(
                                        QUALITY_LABEL_KEY[
                                            q
                                        ]
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* LISTINGS */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E4DCC8] bg-white py-14 text-center text-[#8A8370]">
                    {t(
                        "feed.noResults"
                    )}
                </div>
            ) : (
                <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map(
                        (
                            listing,
                            i
                        ) => (
                            <motion.article
                                key={
                                    listing.id
                                }
                                initial={{
                                    opacity: 0,
                                    y: 12,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay:
                                        i *
                                        0.04,
                                }}
                                className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#E4DCC8] bg-white shadow-sm"
                            >
                                <div className="relative flex h-32 items-center justify-center bg-[#EAF1EC]">
                                    <span className="font-serif text-4xl capitalize text-[#1B4332]/30">
                                        {
                                            listing
                                                .category[0]
                                        }
                                    </span>

                                    {listing.quality ===
                                        "organic" && (
                                        <span className="absolute left-3 top-3 rounded-full bg-[#2D6A4F] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#FBF7EF]">
                                            {t(
                                                "feed.organicBadge"
                                            )}
                                        </span>
                                    )}

                                    <div className="absolute right-2 top-2 rounded-full bg-white/90 p-0.5 shadow">
                                        <FreshnessRing
                                            isoDate={
                                                listing.harvestedAt
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="mb-1 flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-semibold capitalize text-[#1B4332]">
                                                {listing.variety ??
                                                    t(
                                                        `category.${listing.category}` as TranslationKey
                                                    )}
                                            </p>

                                            <p className="text-xs text-[#8A8370]">
                                                {timeSinceHarvest(
                                                    listing.harvestedAt
                                                )}
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap font-serif text-lg font-semibold text-[#C4622D]">
                                            {formatINR(
                                                listing.pricePerUnit
                                            )}

                                            <span className="text-xs font-normal text-[#8A8370]">
                                                /
                                                {
                                                    listing.unit
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mb-3 flex items-center gap-3 text-xs text-[#3D4A42]">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />

                                            {
                                                listing.village
                                            }{" "}
                                            ·{" "}
                                            {listing.distanceKm ??
                                                "—"}{" "}
                                            km
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Package className="h-3.5 w-3.5" />

                                            {
                                                listing.quantity
                                            }{" "}
                                            {
                                                listing.unit
                                            }
                                        </span>
                                    </div>

                                    <p className="mb-3 text-xs text-[#8A8370]">
                                        {t(
                                            "feed.by"
                                        )}{" "}
                                        {
                                            listing.farmerName
                                        }
                                    </p>

                                    <div className="flex gap-2">
                                        <a
                                            href={`tel:${listing.farmerPhone}`}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E4DCC8] py-2 text-xs font-semibold text-[#3D4A42] hover:border-[#1B4332]"
                                        >
                                            <Phone className="h-3.5 w-3.5" />

                                            {t(
                                                "feed.call"
                                            )}
                                        </a>

                                        <a
                                            href={`https://wa.me/${listing.farmerPhone.replace(
                                                /\D/g,
                                                ""
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#2D6A4F] bg-[#EAF1EC] py-2 text-xs font-semibold text-[#1B4332] hover:bg-[#DCEAE0]"
                                        >
                                            <MessageCircle className="h-3.5 w-3.5" />

                                            {t(
                                                "feed.whatsapp"
                                            )}
                                        </a>
                                    </div>

                                    {/* NEW OFFER BUTTON */}
                                    <button
                                        onClick={() =>
                                            openOfferModal(
                                                listing
                                            )
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8A33D] py-2.5 text-xs font-semibold text-[#1B4332] transition-transform active:scale-[0.98]"
                                    >
                                        <Send className="h-3.5 w-3.5" />

                                        Make an Offer
                                    </button>

                                    {listing.isBulkAvailable && (
                                        <button className="mt-2 w-full rounded-xl bg-[#1B4332] py-2 text-xs font-semibold text-[#FBF7EF]">
                                            {t(
                                                "feed.bookBulk"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.article>
                        )
                    )}
                </div>
            )}

            {/* OFFER MODAL */}
            {offerListing && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B4332]/60 px-4 backdrop-blur-sm"
                    onClick={() =>
                        !offerSending &&
                        setOfferListing(null)
                    }
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        className="w-full max-w-md rounded-3xl bg-[#FBF7EF] p-6 shadow-2xl"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-[#1B4332]">
                                    Make an Offer
                                </h2>

                                <p className="mt-1 text-sm text-[#8A8370]">
                                    {
                                        offerListing.farmerName
                                    }
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setOfferListing(
                                        null
                                    )
                                }
                                disabled={
                                    offerSending
                                }
                                className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8D6] text-[#3D4A42]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-5 rounded-2xl bg-white p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#8A8370]">
                                    Crop
                                </span>

                                <span className="font-semibold capitalize text-[#1B4332]">
                                    {
                                        offerListing.category
                                    }
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm text-[#8A8370]">
                                    Listed price
                                </span>

                                <span className="font-semibold text-[#C4622D]">
                                    ₹
                                    {
                                        offerListing.pricePerUnit
                                    }
                                    /
                                    {
                                        offerListing.unit
                                    }
                                </span>
                            </div>
                        </div>

                        {offerSuccess ? (
                            <div className="rounded-2xl border border-[#2D6A4F] bg-[#EAF1EC] p-6 text-center">
                                <CheckCircle className="mx-auto h-12 w-12 text-[#2D6A4F]" />

                                <p className="mt-3 text-lg font-semibold text-[#1B4332]">
                                    Offer sent successfully.
                                </p>

                                <p className="mt-1 text-sm text-[#8A8370]">
                                    The farmer can now review your offer.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-sm font-medium text-[#3D4A42]">
                                            Quantity
                                        </label>

                                        <div className="mt-2 flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    offerQuantity
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setOfferQuantity(
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#E4DCC8] bg-white px-4 py-3 text-base font-semibold text-[#1B4332] outline-none focus:border-[#1B4332]"
                                            />

                                            <span className="rounded-xl bg-[#EAF1EC] px-4 py-3 text-sm font-semibold text-[#1B4332]">
                                                kg
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-[#3D4A42]">
                                            Your offer price
                                        </label>

                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="rounded-xl bg-[#FCEFE3] px-4 py-3 font-semibold text-[#C4622D]">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                min="1"
                                                value={
                                                    offerPrice
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setOfferPrice(
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#E4DCC8] bg-white px-4 py-3 text-base font-semibold text-[#1B4332] outline-none focus:border-[#1B4332]"
                                            />

                                            <span className="text-sm text-[#8A8370]">
                                                /kg
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-white p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8A8370]">
                                                Total offer value
                                            </span>

                                            <span className="font-semibold text-[#1B4332]">
                                                ₹
                                                {(
                                                    offerQuantity *
                                                    offerPrice
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={
                                        handleSendOffer
                                    }
                                    disabled={
                                        offerSending ||
                                        offerQuantity <=
                                            0 ||
                                        offerPrice <=
                                            0
                                    }
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1B4332] py-3.5 text-sm font-semibold text-[#FBF7EF] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />

                                    {offerSending
                                        ? "Sending..."
                                        : "Send Offer"}
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
