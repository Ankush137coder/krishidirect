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

/* -------------------------------------------------------
   GET ALL OFFERS
------------------------------------------------------- */

export function getOffers(): MarketplaceOffer[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

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

/* -------------------------------------------------------
   SAVE NEW OFFER
------------------------------------------------------- */

export function saveOffer(
    offer: MarketplaceOffer
): void {
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

/* -------------------------------------------------------
   UPDATE OFFER
------------------------------------------------------- */

export function updateOffer(
    id: string,
    updates: Partial<MarketplaceOffer>
): void {
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
        JSON.stringify(updatedOffers)
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------------
   CANCEL OFFER
------------------------------------------------------- */

export function cancelOffer(
    id: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const offers = getOffers();

    const updatedOffers =
        offers.map((offer) =>
            offer.id === id
                ? {
                      ...offer,
                      status: "cancelled" as OfferStatus,
                  }
                : offer
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedOffers)
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------------
   DELETE OFFER
------------------------------------------------------- */

export function deleteOffer(
    id: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const offers = getOffers();

    const updatedOffers =
        offers.filter(
            (offer) =>
                offer.id !== id
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedOffers)
    );

    window.dispatchEvent(
        new Event(
            "krishidirect-offers-updated"
        )
    );
}

/* -------------------------------------------------------
   CLEAR ALL OFFERS
------------------------------------------------------- */

export function clearOffers(): void {
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
