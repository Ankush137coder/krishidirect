// components/DecisionEngine.tsx

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Apple,
    Camera,
    CheckCircle2,
    CloudRain,
    IndianRupee,
    Leaf,
    MapPin,
    Package,
    Plus,
    Sprout,
    Store,
    Trash2,
    Truck,
    Upload,
    Wheat,
    X,
} from "lucide-react";

import type {
    Category,
    Unit,
} from "@/types/marketplace";

import type {
    CropCondition,
    DecisionResult,
} from "@/types/decision-engine";

const CROPS: {
    id: Category;
    name: string;
    icon: typeof Apple;
}[] = [
    { id: "tomato", name: "Tomato", icon: Sprout },
    { id: "potato", name: "Potato", icon: Sprout },
    { id: "onion", name: "Onion", icon: Leaf },
    { id: "leafy-greens", name: "Leafy Greens", icon: Leaf },
    { id: "fruits", name: "Fruits", icon: Apple },
    { id: "grains", name: "Grains", icon: Wheat },
];

const CONDITIONS: {
    id: CropCondition;
    label: string;
    description: string;
}[] = [
    {
        id: "excellent",
        label: "Excellent",
        description: "Fresh, healthy and undamaged",
    },
    {
        id: "good",
        label: "Good",
        description: "Minor defects but mostly fresh",
    },
    {
        id: "fair",
        label: "Fair",
        description: "Some visible deterioration",
    },
    {
        id: "poor",
        label: "Poor",
        description: "Significant deterioration",
    },
];

interface DecisionEngineProps {
    initialCrop?: Category;
}

export default function DecisionEngine({
    initialCrop = "tomato",
}: DecisionEngineProps) {
    const [crop, setCrop] = useState<Category>(initialCrop);
    const [quantity, setQuantity] = useState(50);
    const [unit, setUnit] = useState<Unit>("kg");
    const [harvestDate, setHarvestDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [condition, setCondition] =
        useState<CropCondition>("good");

    const [photos, setPhotos] = useState<string[]>([]);
    const [photoNames, setPhotoNames] = useState<string[]>([]);

    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<DecisionResult | null>(null);

    // ---------------------------------------------------------------------
    // DEMO DATA
    // These values will later come from your teammates' APIs.
    // ---------------------------------------------------------------------

    const weather = {
        temperature: 31,
        humidity: 68,
        rainfallProbability: 40,
    };

    const market = {
        currentPrice: 22,
        expectedPrice: 25,
        priceTrendPercent: 8,
    };

    const storage = {
        available: true,
        capacityKg: 500,
        costPerDay: 2,
    };

    const transportation = {
        available: true,
        distanceKm: 24,
        estimatedCost: 650,
        destination: "Pune Wholesale Market",
    };

    // ---------------------------------------------------------------------
    // PHOTO UPLOAD
    // ---------------------------------------------------------------------

    const handlePhotoUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (!files.length) return;

        const remainingSlots = 4 - photos.length;
        const selectedFiles = files.slice(0, remainingSlots);

        selectedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setPhotos((prev) => {
                        if (prev.length >= 4) return prev;
                        return [...prev, reader.result as string];
                    });

                    setPhotoNames((prev) => [
                        ...prev,
                        file.name,
                    ]);
                }
            };

            reader.readAsDataURL(file);
        });

        event.target.value = "";
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setPhotoNames((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // ---------------------------------------------------------------------
    // DECISION ENGINE
    // ---------------------------------------------------------------------

    const calculateDecision = () => {
        setAnalyzing(true);
        setResult(null);

        setTimeout(() => {
            const quantityKg =
                unit === "quintal"
                    ? quantity * 100
                    : quantity;

            const conditionMultiplier: Record<
                CropCondition,
                number
            > = {
                excellent: 0.96,
                good: 0.91,
                fair: 0.78,
                poor: 0.58,
            };

            const freshness =
                conditionMultiplier[condition];

            const hoursSinceHarvest =
                Math.max(
                    0,
                    (Date.now() -
                        new Date(
                            harvestDate
                        ).getTime()) /
                        (1000 * 60 * 60)
                );

            let spoilageRisk =
                (1 - freshness) * 100;

            spoilageRisk +=
                Math.min(hoursSinceHarvest / 10, 20);

            spoilageRisk +=
                weather.temperature > 30 ? 8 : 0;

            spoilageRisk +=
                weather.humidity > 70 ? 5 : 0;

            spoilageRisk +=
                weather.rainfallProbability > 60
                    ? 6
                    : 0;

            spoilageRisk = Math.min(
                Math.round(spoilageRisk),
                95
            );

            const currentRevenue =
                quantityKg *
                market.currentPrice;

            const transportRevenue =
                quantityKg *
                market.expectedPrice;

            const transportProfit =
                transportRevenue -
                transportation.estimatedCost;

            const storageDays =
                spoilageRisk < 30
                    ? 2
                    : spoilageRisk < 50
                    ? 1
                    : 0;

            const storageLoss =
                currentRevenue *
                (spoilageRisk / 100) *
                0.35;

            const storageCost =
                storageDays *
                storage.costPerDay *
                quantityKg;

            const storageProfit =
                quantityKg *
                market.expectedPrice -
                storageLoss -
                storageCost;

            const sellNowProfit =
                currentRevenue;

            const options = [
                {
                    action: "sell-now" as const,
                    title: "Sell Now",
                    estimatedRevenue:
                        Math.round(currentRevenue),
                    estimatedCosts: 0,
                    estimatedProfit:
                        Math.round(sellNowProfit),
                    description:
                        "Avoid further spoilage and receive immediate payment.",
                },
                {
                    action: "store" as const,
                    title: "Store & Sell Later",
                    estimatedRevenue:
                        Math.round(
                            quantityKg *
                                market.expectedPrice
                        ),
                    estimatedCosts:
                        Math.round(
                            storageCost +
                                storageLoss
                        ),
                    estimatedProfit:
                        Math.round(storageProfit),
                    description:
                        "Hold the produce briefly to benefit from the expected price increase.",
                },
                {
                    action: "transport" as const,
                    title: "Transport & Sell",
                    estimatedRevenue:
                        Math.round(
                            transportRevenue
                        ),
                    estimatedCosts:
                        Math.round(
                            transportation.estimatedCost
                        ),
                    estimatedProfit:
                        Math.round(
                            transportProfit
                        ),
                    description:
                        `Transport to ${transportation.destination} for a potentially better price.`,
                },
            ];

            const bestOption =
                [...options].sort(
                    (a, b) =>
                        b.estimatedProfit -
                        a.estimatedProfit
                )[0];

            let confidence =
                90 -
                Math.round(
                    spoilageRisk * 0.2
                );

            if (photos.length > 0) {
                confidence += 3;
            }

            if (photos.length >= 3) {
                confidence += 2;
            }

            confidence = Math.min(
                Math.max(confidence, 65),
                97
            );

            const reasoning: string[] = [];

            if (spoilageRisk >= 50) {
                reasoning.push(
                    "The crop has a relatively high spoilage risk, so delaying the sale may reduce its value."
                );
            } else {
                reasoning.push(
                    "The current crop condition indicates that it can safely be handled for a short period."
                );
            }

            if (
                market.expectedPrice >
                market.currentPrice
            ) {
                reasoning.push(
                    `Market prices are expected to rise by approximately ${market.priceTrendPercent}%.`
                );
            }

            if (
                transportation.available &&
                bestOption.action === "transport"
            ) {
                reasoning.push(
                    `The expected price advantage outweighs the estimated ₹${transportation.estimatedCost.toLocaleString("en-IN")} transportation cost.`
                );
            }

            if (
                storage.available &&
                bestOption.action === "store"
            ) {
                reasoning.push(
                    `Storage is available at approximately ₹${storage.costPerDay}/kg/day.`
                );
            }

            if (
                weather.rainfallProbability >= 50
            ) {
                reasoning.push(
                    "Upcoming rainfall may increase post-harvest risk."
                );
            }

            setResult({
                recommendedAction:
                    bestOption.action,
                confidence,
                spoilageRisk,
                estimatedProfit:
                    bestOption.estimatedProfit,
                estimatedRevenue:
                    bestOption.estimatedRevenue,
                estimatedCosts:
                    bestOption.estimatedCosts,
                reasoning,
                options,
            });

            setAnalyzing(false);
        }, 1300);
    };

    const selectedCrop = useMemo(
        () =>
            CROPS.find(
                (item) => item.id === crop
            ),
        [crop]
    );

    return (
        <div className="space-y-6">
            {/* --------------------------------------------------------- */}
            {/* HEADER */}
            {/* --------------------------------------------------------- */}

            <div className="rounded-3xl bg-[#1B4332] p-6 text-[#FBF7EF] shadow-lg sm:p-8">
                <div className="max-w-3xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                        <Sprout className="h-4 w-4 text-[#E8A33D]" />
                        Post-Harvest Intelligence
                    </div>

                    <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
                        What should I do with my harvest?
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#DCE8DF] sm:text-base">
                        Compare market prices, spoilage risk,
                        weather, storage and transportation
                        costs to find the most economically
                        beneficial action.
                    </p>
                </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* CROP DETAILS */}
            {/* --------------------------------------------------------- */}

            <section className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
                        Step 1
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                        Tell us about your harvest
                    </h2>

                    <p className="mt-1 text-sm text-[#8A8370]">
                        Basic information helps us estimate
                        freshness and profitability.
                    </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    {/* Crop */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#3D4A42]">
                            Crop
                        </label>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {CROPS.map(
                                ({
                                    id,
                                    name,
                                    icon: Icon,
                                }) => (
                                    <button
                                        key={id}
                                        onClick={() =>
                                            setCrop(id)
                                        }
                                        className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                                            crop === id
                                                ? "border-[#1B4332] bg-[#EAF1EC] text-[#1B4332]"
                                                : "border-[#E4DCC8] bg-[#FBF7EF] text-[#3D4A42] hover:border-[#B9C9BB]"
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span className="text-xs font-semibold">
                                            {name}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#3D4A42]">
                            Quantity
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Math.max(
                                            1,
                                            Number(
                                                e.target
                                                    .value
                                            )
                                        )
                                    )
                                }
                                className="w-full rounded-xl border border-[#E4DCC8] bg-[#FBF7EF] px-4 py-3 text-[#1B4332] outline-none focus:border-[#1B4332]"
                            />

                            <select
                                value={unit}
                                onChange={(e) =>
                                    setUnit(
                                        e.target
                                            .value as Unit
                                    )
                                }
                                className="rounded-xl border border-[#E4DCC8] bg-[#FBF7EF] px-4 py-3 font-medium text-[#1B4332] outline-none focus:border-[#1B4332]"
                            >
                                <option value="kg">
                                    kg
                                </option>
                                <option value="quintal">
                                    quintal
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Harvest date */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#3D4A42]">
                            Harvest date
                        </label>

                        <input
                            type="date"
                            value={harvestDate}
                            max={
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(e) =>
                                setHarvestDate(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-[#E4DCC8] bg-[#FBF7EF] px-4 py-3 text-[#1B4332] outline-none focus:border-[#1B4332]"
                        />
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#3D4A42]">
                            Crop condition
                        </label>

                        <select
                            value={condition}
                            onChange={(e) =>
                                setCondition(
                                    e.target
                                        .value as CropCondition
                                )
                            }
                            className="w-full rounded-xl border border-[#E4DCC8] bg-[#FBF7EF] px-4 py-3 text-[#1B4332] outline-none focus:border-[#1B4332]"
                        >
                            {CONDITIONS.map(
                                (item) => (
                                    <option
                                        key={item.id}
                                        value={
                                            item.id
                                        }
                                    >
                                        {item.label} —{" "}
                                        {
                                            item.description
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------- */}
            {/* PHOTO UPLOAD */}
            {/* --------------------------------------------------------- */}

            <section className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
                        Crop Reference
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                        Add crop photos
                    </h2>

                    <p className="mt-1 text-sm text-[#8A8370]">
                        Upload up to 4 real photos. These can
                        later be analyzed by an AI service.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {photos.map(
                        (photo, index) => (
                            <div
                                key={`${photo}-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-2xl border border-[#E4DCC8] bg-[#FBF7EF]"
                            >
                                <img
                                    src={photo}
                                    alt={`Crop photo ${
                                        index + 1
                                    }`}
                                    className="h-full w-full object-cover"
                                />

                                <button
                                    onClick={() =>
                                        removePhoto(
                                            index
                                        )
                                    }
                                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#C4622D] shadow-md"
                                    aria-label="Remove photo"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )
                    )}

                    {photos.length < 4 && (
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D7CCB4] bg-[#FBF7EF] text-center text-[#8A8370] transition-colors hover:border-[#1B4332] hover:text-[#1B4332]">
                            <Camera className="h-7 w-7" />

                            <span className="text-xs font-semibold">
                                Add Photo
                            </span>

                            <span className="text-[10px]">
                                {4 - photos.length}{" "}
                                slot
                                {4 -
                                    photos.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                left
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={
                                    handlePhotoUpload
                                }
                            />
                        </label>
                    )}
                </div>

                {photoNames.length > 0 && (
                    <div className="mt-4 space-y-1">
                        {photoNames.map(
                            (name, index) => (
                                <div
                                    key={`${name}-${index}`}
                                    className="flex items-center gap-2 text-xs text-[#8A8370]"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#1B4332]" />
                                    <span className="truncate">
                                        {name}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* --------------------------------------------------------- */}
            {/* LIVE DATA CARDS */}
            {/* --------------------------------------------------------- */}

            <section>
                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C4622D]">
                        Decision Inputs
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                        Current conditions
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Weather */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                <CloudRain className="h-5 w-5" />
                            </div>

                            <span className="rounded-full bg-[#FCEFE3] px-2.5 py-1 text-[10px] font-bold text-[#C4622D]">
                                LIVE API
                            </span>
                        </div>

                        <p className="text-xs text-[#8A8370]">
                            Weather
                        </p>

                        <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                            {weather.temperature}°C
                        </p>

                        <p className="mt-1 text-xs text-[#8A8370]">
                            {weather.humidity}% humidity ·{" "}
                            {weather.rainfallProbability}%
                            rain probability
                        </p>
                    </motion.div>

                    {/* Market */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                <IndianRupee className="h-5 w-5" />
                            </div>

                            <span className="rounded-full bg-[#EAF1EC] px-2.5 py-1 text-[10px] font-bold text-[#1B4332]">
                                LIVE API
                            </span>
                        </div>

                        <p className="text-xs text-[#8A8370]">
                            Current market price
                        </p>

                        <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                            ₹
                            {
                                market.currentPrice
                            }
                            /kg
                        </p>

                        <p className="mt-1 text-xs font-medium text-[#1B4332]">
                            Expected{" "}
                            ₹
                            {
                                market.expectedPrice
                            }/kg · +
                            {
                                market.priceTrendPercent
                            }%
                        </p>
                    </motion.div>

                    {/* Storage */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                <Store className="h-5 w-5" />
                            </div>

                            <span className="rounded-full bg-[#EAF1EC] px-2.5 py-1 text-[10px] font-bold text-[#1B4332]">
                                AVAILABLE
                            </span>
                        </div>

                        <p className="text-xs text-[#8A8370]">
                            Storage
                        </p>

                        <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                            {storage.capacityKg} kg
                        </p>

                        <p className="mt-1 text-xs text-[#8A8370]">
                            ₹{storage.costPerDay}/kg/day
                        </p>
                    </motion.div>

                    {/* Transport */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                <Truck className="h-5 w-5" />
                            </div>

                            <span className="rounded-full bg-[#FCEFE3] px-2.5 py-1 text-[10px] font-bold text-[#C4622D]">
                                AVAILABLE
                            </span>
                        </div>

                        <p className="text-xs text-[#8A8370]">
                            Transportation
                        </p>

                        <p className="mt-1 font-serif text-2xl font-semibold text-[#1B4332]">
                            {transportation.distanceKm}{" "}
                            km
                        </p>

                        <p className="mt-1 text-xs text-[#8A8370]">
                            ₹
                            {transportation.estimatedCost.toLocaleString(
                                "en-IN"
                            )}{" "}
                            estimated
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --------------------------------------------------------- */}
            {/* ANALYZE BUTTON */}
            {/* --------------------------------------------------------- */}

            <div className="rounded-3xl border border-[#E4DCC8] bg-[#EFE8D6] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-serif text-xl font-semibold text-[#1B4332]">
                            Ready to find the best option?
                        </p>

                        <p className="mt-1 text-sm text-[#8A8370]">
                            We'll compare selling,
                            storage and transportation
                            scenarios.
                        </p>
                    </div>

                    <button
                        onClick={calculateDecision}
                        disabled={analyzing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1B4332] px-7 py-4 text-sm font-semibold text-[#FBF7EF] shadow-lg transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                    >
                        {analyzing ? (
                            <>
                                <motion.span
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear",
                                    }}
                                    className="h-4 w-4 rounded-full border-2 border-[#FBF7EF] border-t-transparent"
                                />

                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sprout className="h-4 w-4 text-[#E8A33D]" />

                                Analyze My Harvest
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* RESULT */}
            {/* --------------------------------------------------------- */}

            {result && (
                <motion.section
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="overflow-hidden rounded-3xl border border-[#B9C9BB] bg-white shadow-lg"
                >
                    <div className="bg-[#1B4332] p-6 text-[#FBF7EF] sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#DCE8DF]">
                                    <CheckCircle2 className="h-5 w-5 text-[#E8A33D]" />

                                    Analysis complete
                                </div>

                                <h2 className="font-serif text-3xl font-semibold">
                                    Recommended Action
                                </h2>

                                <p className="mt-2 text-sm text-[#DCE8DF]">
                                    Based on current crop,
                                    weather, market,
                                    storage and
                                    transportation
                                    conditions.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/10 px-5 py-4 text-center">
                                <p className="text-xs text-[#DCE8DF]">
                                    Decision confidence
                                </p>

                                <p className="mt-1 font-serif text-3xl font-semibold text-[#E8A33D]">
                                    {
                                        result.confidence
                                    }
                                    %
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* Main recommendation */}
                        <div className="rounded-3xl border-2 border-[#1B4332] bg-[#EAF1EC] p-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1B4332]">
                                        Best economic option
                                    </p>

                                    <h3 className="mt-2 font-serif text-3xl font-semibold text-[#1B4332]">
                                        {result.recommendedAction ===
                                        "sell-now"
                                            ? "Sell Now"
                                            : result.recommendedAction ===
                                              "store"
                                            ? "Store & Sell Later"
                                            : "Transport & Sell"}
                                    </h3>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#52645A]">
                                        The recommendation
                                        balances expected
                                        revenue, spoilage
                                        risk and additional
                                        costs.
                                    </p>
                                </div>

                                <div className="shrink-0 rounded-2xl bg-white px-5 py-4 text-center shadow-sm">
                                    <p className="text-xs text-[#8A8370]">
                                        Estimated profit
                                    </p>

                                    <p className="mt-1 font-serif text-3xl font-semibold text-[#1B4332]">
                                        ₹
                                        {result.estimatedProfit.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-[#FBF7EF] p-4">
                                <p className="text-xs text-[#8A8370]">
                                    Expected revenue
                                </p>

                                <p className="mt-1 text-xl font-bold text-[#1B4332]">
                                    ₹
                                    {result.estimatedRevenue.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[#FBF7EF] p-4">
                                <p className="text-xs text-[#8A8370]">
                                    Estimated costs
                                </p>

                                <p className="mt-1 text-xl font-bold text-[#C4622D]">
                                    ₹
                                    {result.estimatedCosts.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[#FBF7EF] p-4">
                                <p className="text-xs text-[#8A8370]">
                                    Spoilage risk
                                </p>

                                <p className="mt-1 text-xl font-bold text-[#1B4332]">
                                    {
                                        result.spoilageRisk
                                    }
                                    %
                                </p>
                            </div>
                        </div>

                        {/* Reasoning */}
                        <div className="mt-7">
                            <h3 className="font-serif text-xl font-semibold text-[#1B4332]">
                                Why this decision?
                            </h3>

                            <div className="mt-3 space-y-2">
                                {result.reasoning.map(
                                    (
                                        reason,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="flex gap-3 rounded-xl bg-[#FBF7EF] p-3 text-sm text-[#52645A]"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1B4332]" />

                                            <span>
                                                {
                                                    reason
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Comparison */}
                        <div className="mt-7">
                            <h3 className="font-serif text-xl font-semibold text-[#1B4332]">
                                Compare your options
                            </h3>

                            <div className="mt-3 grid gap-3">
                                {result.options.map(
                                    (option) => (
                                        <div
                                            key={
                                                option.action
                                            }
                                            className={`rounded-2xl border p-4 ${
                                                option.action ===
                                                result.recommendedAction
                                                    ? "border-[#1B4332] bg-[#EAF1EC]"
                                                    : "border-[#E4DCC8] bg-white"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EFE8D6] text-[#1B4332]">
                                                        {option.action ===
                                                        "sell-now" ? (
                                                            <IndianRupee className="h-5 w-5" />
                                                        ) : option.action ===
                                                          "store" ? (
                                                            <Store className="h-5 w-5" />
                                                        ) : (
                                                            <Truck className="h-5 w-5" />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <p className="font-semibold text-[#1B4332]">
                                                                {
                                                                    option.title
                                                                }
                                                            </p>

                                                            {option.action ===
                                                                result.recommendedAction && (
                                                                <span className="rounded-full bg-[#1B4332] px-2 py-0.5 text-[10px] font-bold text-[#FBF7EF]">
                                                                    RECOMMENDED
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-1 text-xs leading-5 text-[#8A8370]">
                                                            {
                                                                option.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 sm:text-right">
                                                    <p className="text-xs text-[#8A8370]">
                                                        Estimated
                                                        profit
                                                    </p>

                                                    <p className="font-serif text-xl font-semibold text-[#1B4332]">
                                                        ₹
                                                        {option.estimatedProfit.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Small disclaimer */}
            <p className="px-2 text-center text-xs leading-5 text-[#9A927F]">
                Demo recommendation uses sample weather,
                market, storage and transport data. These
                values can be replaced with live APIs when
                backend integration is completed.
            </p>
        </div>
    );
}
