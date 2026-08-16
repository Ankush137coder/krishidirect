// components/FarmerOffers.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Check,
    X,
    Clock,
    Truck,
    PackageCheck,
    CircleCheck,
    User,
    IndianRupee,
    Inbox,
} from "lucide-react";

import {
    getOffers,
    updateOffer,
    type MarketplaceOffer,
    type DealStage,
} from "@/lib/marketplaceOffers";

/* -------------------------------------------------- */
/* Deal stages */
/* -------------------------------------------------- */

const DEAL_STAGES: {
    id: DealStage;
    label: string;
    description: string;
}[] = [
    {
        id: "offer-received",
        label: "Offer Received",
        description:
            "Vendor has submitted an offer.",
    },
    {
        id: "offer-accepted",
        label: "Offer Accepted",
        description:
            "Farmer accepted the vendor's offer.",
    },
    {
        id: "pickup-arranged",
        label: "Pickup Arranged",
        description:
            "Pickup has been arranged.",
    },
    {
        id: "completed",
        label: "Completed",
        description:
            "Transaction completed successfully.",
    },
];

/* -------------------------------------------------- */
/* Stage index */
/* -------------------------------------------------- */

function getStageIndex(
    stage: DealStage
) {
    return DEAL_STAGES.findIndex(
        (item) =>
            item.id === stage
    );
}

/* -------------------------------------------------- */
/* Status badge */
/* -------------------------------------------------- */

function StatusBadge({
    status,
}: {
    status: MarketplaceOffer["status"];
}) {
    if (status === "pending") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D6] px-3 py-1.5 text-xs font-semibold text-[#9A6B00]">
                <span className="h-2 w-2 rounded-full bg-[#E8A33D]" />
                Pending
            </span>
        );
    }

    if (status === "accepted") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF1EC] px-3 py-1.5 text-xs font-semibold text-[#1B4332]">
                <span className="h-2 w-2 rounded-full bg-[#2D6A4F]" />
                Accepted
            </span>
        );
    }

    if (status === "rejected") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEFE3] px-3 py-1.5 text-xs font-semibold text-[#B44822]">
                <span className="h-2 w-2 rounded-full bg-[#C4622D]" />
                Rejected
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F1F1] px-3 py-1.5 text-xs font-semibold text-[#666666]">
            <span className="h-2 w-2 rounded-full bg-[#888888]" />
            Cancelled
        </span>
    );
}

/* -------------------------------------------------- */
/* Deal progress */
/* -------------------------------------------------- */

function DealProgress({
    offer,
    onUpdated,
}: {
    offer: MarketplaceOffer;
    onUpdated: () => void;
}) {
    const currentIndex =
        getStageIndex(
            offer.dealStage
        );

    const advanceDeal = () => {
        const nextStage =
            currentIndex + 1;

        if (
            nextStage <
            DEAL_STAGES.length
        ) {
            updateOffer(
                offer.id,
                {
                    dealStage:
                        DEAL_STAGES[
                            nextStage
                        ].id,
                }
            );

            onUpdated();
        }
    };

    return (
        <div className="mt-6 rounded-2xl bg-[#FBF7EF] p-5">
            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8370]">
                    Deal Status
                </p>

                <h3 className="mt-1 font-serif text-xl font-semibold text-[#1B4332]">
                    Transaction Progress
                </h3>
            </div>

            <div className="space-y-4">
                {DEAL_STAGES.map(
                    (
                        stage,
                        index
                    ) => {
                        const completed =
                            index <=
                            currentIndex;

                        const isCurrent =
                            index ===
                            currentIndex;

                        return (
                            <div
                                key={
                                    stage.id
                                }
                                className="flex items-start gap-3"
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`grid h-9 w-9 place-items-center rounded-full ${
                                            completed
                                                ? "bg-[#1B4332] text-white"
                                                : "bg-[#E4DCC8] text-[#8A8370]"
                                        }`}
                                    >
                                        {index ===
                                            0 && (
                                            <Inbox className="h-4 w-4" />
                                        )}

                                        {index ===
                                            1 && (
                                            <Check className="h-4 w-4" />
                                        )}

                                        {index ===
                                            2 && (
                                            <Truck className="h-4 w-4" />
                                        )}

                                        {index ===
                                            3 && (
                                            <CircleCheck className="h-4 w-4" />
                                        )}
                                    </div>

                                    {index <
                                        DEAL_STAGES.length -
                                            1 && (
                                        <div
                                            className={`mt-1 h-7 w-0.5 ${
                                                index <
                                                currentIndex
                                                    ? "bg-[#1B4332]"
                                                    : "bg-[#E4DCC8]"
                                            }`}
                                        />
                                    )}
                                </div>

                                <div className="pt-1">
                                    <p
                                        className={`text-sm font-semibold ${
                                            completed
                                                ? "text-[#1B4332]"
                                                : "text-[#8A8370]"
                                        }`}
                                    >
                                        {
                                            stage.label
                                        }

                                        {isCurrent && (
                                            <span className="ml-2 rounded-full bg-[#E8A33D] px-2 py-0.5 text-[10px] font-semibold text-[#1B4332]">
                                                Current
                                            </span>
                                        )}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#8A8370]">
                                        {
                                            stage.description
                                        }
                                    </p>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>

            {/* Advance deal */}

            {offer.dealStage !==
                "completed" && (
                <button
                    onClick={
                        advanceDeal
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B4332] py-3 text-sm font-semibold text-white transition hover:bg-[#14372A]"
                >
                    {offer.dealStage ===
                        "offer-accepted" && (
                        <>
                            <Truck className="h-4 w-4" />
                            Arrange Pickup
                        </>
                    )}

                    {offer.dealStage ===
                        "pickup-arranged" && (
                        <>
                            <PackageCheck className="h-4 w-4" />
                            Mark as Completed
                        </>
                    )}
                </button>
            )}

            {offer.dealStage ===
                "completed" && (
                <div className="mt-5 rounded-xl bg-[#EAF1EC] p-3 text-center text-sm font-semibold text-[#1B4332]">
                    ✓ Deal completed successfully
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------- */
/* Main component */
/* -------------------------------------------------- */

export default function FarmerOffers() {
    const [offers, setOffers] =
        useState<
            MarketplaceOffer[]
        >([]);

    const loadOffers = () => {
        setOffers(
            getOffers()
        );
    };

    useEffect(() => {
        loadOffers();

        const handler = () =>
            loadOffers();

        window.addEventListener(
            "krishidirect-offers-updated",
            handler
        );

        return () => {
            window.removeEventListener(
                "krishidirect-offers-updated",
                handler
            );
        };
    }, []);

    /* -------------------------------------------------- */
    /* Accept */
    /* -------------------------------------------------- */

    const handleAccept = (
        offer: MarketplaceOffer
    ) => {
        updateOffer(
            offer.id,
            {
                status: "accepted",
                dealStage:
                    "offer-accepted",
            }
        );

        loadOffers();
    };

    /* -------------------------------------------------- */
    /* Reject */
    /* -------------------------------------------------- */

    const handleReject = (
        offer: MarketplaceOffer
    ) => {
        updateOffer(
            offer.id,
            {
                status: "rejected",
            }
        );

        loadOffers();
    };

    /* -------------------------------------------------- */
    /* Counts */
    /* -------------------------------------------------- */

    const pendingCount =
        offers.filter(
            (o) =>
                o.status ===
                "pending"
        ).length;

    const acceptedCount =
        offers.filter(
            (o) =>
                o.status ===
                "accepted"
        ).length;

    const rejectedCount =
        offers.filter(
            (o) =>
                o.status ===
                "rejected"
        ).length;

    return (
        <main className="min-h-screen bg-[#FBF7EF] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">

                {/* BACK BUTTON */}

                <Link
                    href="/dashboard"
                    className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#E4DCC8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1B4332] shadow-sm transition hover:border-[#1B4332]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                {/* HEADER */}

                <section className="mb-6 rounded-3xl bg-[#1B4332] p-6 text-[#FBF7EF] shadow-lg sm:p-8">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E8A33D] text-[#1B4332]">
                            <PackageCheck className="h-6 w-6" />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-[#B9C9BB]">
                                KrishiDirect
                            </p>

                            <h1 className="font-serif text-3xl font-semibold">
                                Offers Received
                            </h1>

                            <p className="mt-1 text-sm text-[#D8E5DC]">
                                Review vendor offers and manage your deals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* STATUS LEGEND */}

                <section className="mb-6 rounded-2xl border border-[#E4DCC8] bg-white p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8A8370]">
                        Offer Status
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <StatusBadge status="pending" />
                        <StatusBadge status="accepted" />
                        <StatusBadge status="rejected" />
                        <StatusBadge status="cancelled" />
                    </div>
                </section>

                {/* SUMMARY */}

                {offers.length > 0 && (
                    <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="text-xs text-[#8A8370]">
                                Total Offers
                            </p>
                            <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                                {offers.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#FFF4D6] p-4">
                            <p className="text-xs text-[#9A6B00]">
                                Pending
                            </p>
                            <p className="mt-1 font-serif text-2xl font-semibold text-[#9A6B00]">
                                {pendingCount}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#EAF1EC] p-4">
                            <p className="text-xs text-[#2D6A4F]">
                                Accepted
                            </p>
                            <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                                {acceptedCount}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#FCEFE3] p-4">
                            <p className="text-xs text-[#B44822]">
                                Rejected
                            </p>
                            <p className="mt-1 font-serif text-2xl font-semibold text-[#B44822]">
                                {rejectedCount}
                            </p>
                        </div>
                    </section>
                )}

                {/* NO OFFERS */}

                {offers.length ===
                    0 && (
                    <div className="rounded-3xl border border-dashed border-[#E4DCC8] bg-white p-12 text-center">
                        <PackageCheck className="mx-auto h-12 w-12 text-[#B9C9BB]" />

                        <h2 className="mt-4 font-serif text-2xl font-semibold text-[#1B4332]">
                            No offers yet
                        </h2>

                        <p className="mt-2 text-sm text-[#8A8370]">
                            When vendors make offers on your crops, they will appear here.
                        </p>

                        <Link
                            href="/dashboard"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-3 text-sm font-semibold text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                )}

                {/* OFFERS */}

                <div className="space-y-5">
                    {offers.map(
                        (offer) => (
                            <section
                                key={
                                    offer.id
                                }
                                className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm sm:p-6"
                            >
                                {/* OFFER HEADER */}

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                            <User className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <p className="font-semibold text-[#1B4332]">
                                                {
                                                    offer.vendorName
                                                }
                                            </p>

                                            <p className="text-xs text-[#8A8370]">
                                                Vendor offer
                                            </p>
                                        </div>
                                    </div>

                                    <StatusBadge
                                        status={
                                            offer.status
                                        }
                                    />
                                </div>

                                {/* DETAILS */}

                                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-[#FBF7EF] p-4">
                                        <p className="text-xs text-[#8A8370]">
                                            Crop
                                        </p>

                                        <p className="mt-1 font-semibold capitalize text-[#1B4332]">
                                            {
                                                offer.crop
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[#FBF7EF] p-4">
                                        <p className="text-xs text-[#8A8370]">
                                            Quantity
                                        </p>

                                        <p className="mt-1 font-semibold text-[#1B4332]">
                                            {
                                                offer.quantity
                                            }{" "}
                                            {
                                                offer.unit
                                            }
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[#FCEFE3] p-4">
                                        <p className="text-xs text-[#8A8370]">
                                            Offered Price
                                        </p>

                                        <p className="mt-1 flex items-center font-semibold text-[#C4622D]">
                                            <IndianRupee className="h-4 w-4" />
                                            {
                                                offer.offeredPricePerUnit
                                            }
                                            /
                                            {
                                                offer.unit
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* PRICE */}

                                <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-[#E4DCC8] p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-[#8A8370]">
                                            Your listed price
                                        </p>

                                        <p className="font-semibold text-[#3D4A42]">
                                            ₹
                                            {
                                                offer.originalPricePerUnit
                                            }
                                            /
                                            {
                                                offer.unit
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#8A8370]">
                                            Total offer value
                                        </p>

                                        <p className="font-serif text-xl font-semibold text-[#1B4332]">
                                            ₹
                                            {(
                                                offer.quantity *
                                                offer.offeredPricePerUnit
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* ACCEPT / REJECT */}

                                {offer.status ===
                                    "pending" && (
                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={() =>
                                                handleAccept(
                                                    offer
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B4332] py-3 text-sm font-semibold text-white transition hover:bg-[#14372A]"
                                        >
                                            <Check className="h-4 w-4" />
                                            Accept
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    offer
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FCEFE3] py-3 text-sm font-semibold text-[#C4622D] transition hover:bg-[#F8E1D1]"
                                        >
                                            <X className="h-4 w-4" />
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {/* DEAL PROGRESS */}

                                {offer.status ===
                                    "accepted" && (
                                    <DealProgress
                                        offer={
                                            offer
                                        }
                                        onUpdated={
                                            loadOffers
                                        }
                                    />
                                )}

                                {/* REJECTED */}

                                {offer.status ===
                                    "rejected" && (
                                    <div className="mt-5 rounded-2xl bg-[#FCEFE3] p-4 text-center">
                                        <p className="text-sm font-semibold text-[#B44822]">
                                            This offer has been rejected.
                                        </p>
                                    </div>
                                )}

                                {/* CANCELLED */}

                                {offer.status ===
                                    "cancelled" && (
                                    <div className="mt-5 rounded-2xl bg-[#F1F1F1] p-4 text-center">
                                        <p className="text-sm font-semibold text-[#666666]">
                                            This offer was cancelled by the vendor.
                                        </p>
                                    </div>
                                )}
                            </section>
                        )
                    )}
                </div>
            </div>
        </main>
    );
}
