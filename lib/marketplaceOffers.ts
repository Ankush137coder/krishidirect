// lib/marketplaceOffers.ts

export type OfferStatus =
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled";

export type DealStage =
    | "offer-received"
    | "offer-accepted"
    | "pickup-arranged"
    | "completed";

export interface MarketplaceOffer {
    id: string;

    listingId: string;

    vendorName: string;
    vendorPhone: string;

    farmerId: string;
    farmerName: string;

    crop: string;

    quantity: number;
    unit: "kg" | "quintal";

    offeredPricePerUnit: number;
    originalPricePerUnit: number;

    status: OfferStatus;

    dealStage: DealStage;

    createdAt: string;
}

const STORAGE_KEY =
    "krishidirect-marketplace-offers";

/* -------------------------------------------------- */
/* Get all offers */
/* -------------------------------------------------- */

export function getOffers(): MarketplaceOffer[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        return JSON.parse(
            stored
        ) as MarketplaceOffer[];
    } catch {
        return [];
    }
}

/* -------------------------------------------------- */
/* Save new offer */
/* -------------------------------------------------- */

export function saveOffer(
    offer: MarketplaceOffer
) {
    if (typeof window === "undefined") {
        return;
    }

    const offers = getOffers();

    offers.push(offer);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(offers)
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------- */
/* Update an offer */
/* -------------------------------------------------- */

export function updateOffer(
    id: string,
    updates: Partial<MarketplaceOffer>
) {
    if (typeof window === "undefined") {
        return;
    }

    const offers = getOffers();

    const updatedOffers =
        offers.map((offer) =>
            offer.id === id
                ? {
                      ...offer,
                      ...updates,
                  }
                : offer
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            updatedOffers
        )
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------- */
/* Cancel an offer */
/* -------------------------------------------------- */

export function cancelOffer(
    id: string
) {
    if (typeof window === "undefined") {
        return;
    }

    const offers = getOffers();

    const updatedOffers =
        offers.map((offer) =>
            offer.id === id &&
            offer.status === "pending"
                ? {
                      ...offer,
                      status: "cancelled" as const,
                  }
                : offer
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            updatedOffers
        )
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------- */
/* Clear all offers - useful for demo/testing */
/* -------------------------------------------------- */

export function clearOffers() {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(
        STORAGE_KEY
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}
