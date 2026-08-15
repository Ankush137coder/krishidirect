// types/decision-engine.ts

import type { Category, Unit } from "./marketplace";

export type CropCondition =
    | "excellent"
    | "good"
    | "fair"
    | "poor";

export type RecommendedAction =
    | "sell-now"
    | "store"
    | "transport";

export interface DecisionInput {
    crop: Category;
    quantity: number;
    unit: Unit;
    harvestDate: string;
    condition: CropCondition;
    photos: string[];

    weather: {
        temperature: number;
        humidity: number;
        rainfallProbability: number;
    };

    market: {
        currentPrice: number;
        expectedPrice: number;
        priceTrendPercent: number;
    };

    storage: {
        available: boolean;
        capacityKg: number;
        costPerDay: number;
    };

    transportation: {
        available: boolean;
        distanceKm: number;
        estimatedCost: number;
        destination: string;
    };
}

export interface DecisionOption {
    action: RecommendedAction;
    title: string;
    estimatedRevenue: number;
    estimatedCosts: number;
    estimatedProfit: number;
    description: string;
}

export interface DecisionResult {
    recommendedAction: RecommendedAction;
    confidence: number;
    spoilageRisk: number;
    estimatedProfit: number;
    estimatedRevenue: number;
    estimatedCosts: number;
    reasoning: string[];
    options: DecisionOption[];
}
