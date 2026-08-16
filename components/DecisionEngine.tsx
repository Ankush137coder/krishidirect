"use client";

import { useMemo, useState } from "react";
import {
    CloudSun,
    IndianRupee,
    Warehouse,
    Truck,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    MapPin,
    Clock,
    Package,
    Navigation,
    Thermometer,
    Droplets,
} from "lucide-react";
import { useTranslation, type TranslationKey } from "@/lib/i18n";

type Transport = {
    nameKey: TranslationKey;
    icon: string;
    distance: number;
    cost: number;
    capacity: number;
    time: string;
};

const TRANSPORT_OPTIONS: Transport[] = [
    {
        nameKey: "decision.miniTruck",
        icon: "🚚",
        distance: 18,
        cost: 900,
        capacity: 20,
        time: "45 min",
    },
    {
        nameKey: "decision.tempo",
        icon: "🚛",
        distance: 18,
        cost: 650,
        capacity: 10,
        time: "55 min",
    },
    {
        nameKey: "decision.tractor",
        icon: "🚜",
        distance: 18,
        cost: 500,
        capacity: 8,
        time: "1 hr 20 min",
    },
];

const CROP_OPTIONS: {
    value: string;
    key: TranslationKey;
}[] = [
    { value: "tomato", key: "decision.tomato" },
    { value: "onion", key: "decision.onion" },
    { value: "potato", key: "decision.potato" },
    { value: "mango", key: "decision.mango" },
    { value: "wheat", key: "decision.wheat" },
];

export default function DecisionEngine() {
    const { t } = useTranslation();

    const [crop, setCrop] = useState("tomato");
    const [quantity, setQuantity] = useState(10);
    const [marketPrice, setMarketPrice] = useState(22);
    const [storageAvailable, setStorageAvailable] = useState(true);
    const [weatherRisk, setWeatherRisk] = useState("moderate");
    const [spoilageRisk, setSpoilageRisk] = useState("high");

    const [transport, setTransport] = useState(
        TRANSPORT_OPTIONS[0].nameKey
    );

    const selectedTransport = TRANSPORT_OPTIONS.find(
        (item) => item.nameKey === transport
    )!;

    const totalCropValue = quantity * 100 * marketPrice;

    const decision = useMemo(() => {
        if (spoilageRisk === "high" && weatherRisk !== "low") {
            return {
                title: "decision.sellImmediately" as TranslationKey,
                description:
                    "decision.sellImmediatelyDescription" as TranslationKey,
            };
        }

        if (storageAvailable && marketPrice < 25) {
            return {
                title: "decision.storeLater" as TranslationKey,
                description:
                    "decision.storeLaterDescription" as TranslationKey,
            };
        }

        return {
            title: "decision.sellNearby" as TranslationKey,
            description:
                "decision.sellNearbyDescription" as TranslationKey,
        };
    }, [
        spoilageRisk,
        weatherRisk,
        storageAvailable,
        marketPrice,
    ]);

    const netValue = totalCropValue - selectedTransport.cost;

    const riskOptions: {
        value: string;
        key: TranslationKey;
    }[] = [
        { value: "low", key: "decision.low" },
        { value: "moderate", key: "decision.moderate" },
        { value: "high", key: "decision.high" },
    ];

    return (
        <main className="min-h-screen bg-[#FBF7EF] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <section className="mb-8 rounded-3xl bg-[#1B4332] p-6 text-[#FBF7EF] shadow-lg sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                {t("decision.confidence")}
                            </div>

                            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
                                {t("decision.title")}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D8E5DC] sm:text-base">
                                {t("decision.subtitle")}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-xs text-[#D8E5DC]">
                                {t("decision.confidence")}
                            </p>

                            <p className="mt-1 text-3xl font-semibold">
                                92%
                            </p>
                        </div>
                    </div>
                </section>

                {/* INPUT CARDS */}
                <section className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {/* CROP DETAILS */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#1B4332]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.cropCondition")}
                            </h2>
                        </div>

                        <label className="text-xs font-medium text-[#5F5A4F]">
                            {t("decision.crop")}
                        </label>

                        <select
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            className="mt-2 w-full cursor-pointer rounded-xl border border-[#D8CFBC] bg-[#FBF7EF] px-3 py-3 text-sm font-semibold text-[#1B4332] outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                        >
                            {CROP_OPTIONS.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="bg-white font-medium text-[#1B4332]"
                                >
                                    {t(item.key)}
                                </option>
                            ))}
                        </select>

                        <label className="mt-4 block text-xs font-medium text-[#5F5A4F]">
                            {t("decision.quantity")}
                        </label>

                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-xl border border-[#D8CFBC] bg-[#FBF7EF] px-3 py-3 text-sm font-semibold text-[#1B4332] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                            />

                            <span className="shrink-0 rounded-xl bg-[#EAF1EC] px-3 py-3 text-sm font-bold text-[#1B4332]">
                                {t("decision.quintal")}
                            </span>
                        </div>
                    </div>

                    {/* WEATHER */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <CloudSun className="h-5 w-5 text-[#1B4332]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.weatherRisk")}
                            </h2>
                        </div>

                        <div className="mb-4 flex items-center justify-between rounded-xl bg-[#FCEFE3] p-3">

                            <div className="flex items-center gap-3">
                                <Thermometer className="h-5 w-5 text-[#C4622D]" />

                                <div>
                                    <p className="text-xs text-[#6F695D]">
                                        {t("decision.temperature")}
                                    </p>

                                    <p className="font-bold text-[#1B4332]">
                                        29°C
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Droplets className="h-5 w-5 text-[#1B4332]" />

                                <div>
                                    <p className="text-xs text-[#6F695D]">
                                        {t("decision.rainChance")}
                                    </p>

                                    <p className="font-bold text-[#1B4332]">
                                        65%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <label className="text-xs font-medium text-[#5F5A4F]">
                            {t("decision.risk")}
                        </label>

                        <select
                            value={weatherRisk}
                            onChange={(e) =>
                                setWeatherRisk(e.target.value)
                            }
                            className="mt-2 w-full cursor-pointer rounded-xl border border-[#D8CFBC] bg-[#FBF7EF] px-3 py-3 text-sm font-semibold text-[#1B4332] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                        >
                            {riskOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="bg-white font-medium text-[#1B4332]"
                                >
                                    {t(item.key)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* MARKET PRICE */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-[#1B4332]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.marketPrice")}
                            </h2>
                        </div>

                        <p className="text-xs font-medium text-[#6F695D]">
                            {t("decision.currentPrice")}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <IndianRupee className="h-6 w-6 shrink-0 text-[#C4622D]" />

                            <input
                                type="number"
                                value={marketPrice}
                                onChange={(e) =>
                                    setMarketPrice(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-xl border border-[#D8CFBC] bg-[#FBF7EF] px-3 py-3 text-lg font-bold text-[#1B4332] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                            />

                            <span className="shrink-0 text-xs font-semibold text-[#6F695D]">
                                /kg
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#EAF1EC] p-3">
                            <span className="text-xs font-medium text-[#6F695D]">
                                {t("decision.estimatedValue")}
                            </span>

                            <span className="font-bold text-[#1B4332]">
                                ₹{totalCropValue.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* SPOILAGE */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-[#C4622D]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.spoilageRisk")}
                            </h2>
                        </div>

                        <select
                            value={spoilageRisk}
                            onChange={(e) =>
                                setSpoilageRisk(e.target.value)
                            }
                            className="w-full cursor-pointer rounded-xl border border-[#D8CFBC] bg-[#FBF7EF] px-3 py-3 text-sm font-semibold text-[#1B4332] outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                        >
                            {riskOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                    className="bg-white font-medium text-[#1B4332]"
                                >
                                    {t(item.key)}
                                </option>
                            ))}
                        </select>

                        <p className="mt-3 text-xs leading-5 text-[#6F695D]">
                            {t("decision.spoilageDescription")}
                        </p>
                    </div>

                    {/* STORAGE */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Warehouse className="h-5 w-5 text-[#1B4332]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.storage")}
                            </h2>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setStorageAvailable(true)
                                }
                                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                                    storageAvailable
                                        ? "bg-[#1B4332] text-white"
                                        : "bg-[#EFE8D6] text-[#3D4A42] hover:bg-[#E4DCC8]"
                                }`}
                            >
                                {t("decision.available")}
                            </button>

                            <button
                                onClick={() =>
                                    setStorageAvailable(false)
                                }
                                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                                    !storageAvailable
                                        ? "bg-[#C4622D] text-white"
                                        : "bg-[#EFE8D6] text-[#3D4A42] hover:bg-[#E4DCC8]"
                                }`}
                            >
                                {t("decision.notAvailable")}
                            </button>
                        </div>
                    </div>

                    {/* DESTINATION */}
                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-[#1B4332]" />

                            <h2 className="font-semibold text-[#1B4332]">
                                {t("decision.destination")}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-[#EAF1EC] p-4">
                            <p className="text-xs font-medium text-[#6F695D]">
                                {t("decision.nearestMarket")}
                            </p>

                            <p className="mt-1 font-bold text-[#1B4332]">
                                Pune Agricultural Market
                            </p>

                            <p className="mt-1 text-xs font-medium text-[#6F695D]">
                                18 km {t("decision.fromFarm")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* TRANSPORTATION */}
                <section className="mb-6 rounded-3xl border border-[#E4DCC8] bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-5">
                        <div className="flex items-center gap-2">
                            <Truck className="h-6 w-6 text-[#1B4332]" />

                            <h2 className="font-serif text-2xl font-semibold text-[#1B4332]">
                                {t("decision.transport")}
                            </h2>
                        </div>

                        <p className="mt-1 text-sm text-[#6F695D]">
                            {t("decision.transportDescription")}
                        </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        {TRANSPORT_OPTIONS.map((item) => (
                            <button
                                key={item.nameKey}
                                onClick={() =>
                                    setTransport(item.nameKey)
                                }
                                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                                    transport === item.nameKey
                                        ? "border-[#1B4332] bg-[#EAF1EC] shadow-md"
                                        : "border-[#E4DCC8] bg-white hover:border-[#B9C9BB]"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">
                                        {item.icon}
                                    </span>

                                    {transport === item.nameKey && (
                                        <span className="rounded-full bg-[#1B4332] px-2 py-1 text-[10px] font-semibold text-white">
                                            ✓
                                        </span>
                                    )}
                                </div>

                                <h3 className="mt-3 font-semibold text-[#1B4332]">
                                    {t(item.nameKey)}
                                </h3>

                                <div className="mt-3 space-y-2 text-xs text-[#6F695D]">

                                    <div className="flex justify-between">
                                        <span>
                                            {t("decision.distance")}
                                        </span>

                                        <span className="font-bold text-[#3D4A42]">
                                            {item.distance} km
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>
                                            {t("decision.cost")}
                                        </span>

                                        <span className="font-bold text-[#C4622D]">
                                            ₹{item.cost}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>
                                            {t("decision.capacity")}
                                        </span>

                                        <span className="font-bold text-[#3D4A42]">
                                            {item.capacity}{" "}
                                            {t("decision.quintal")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>
                                            {t("decision.delivery")}
                                        </span>

                                        <span className="font-bold text-[#3D4A42]">
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[#FBF7EF] p-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">
                            <Navigation className="h-5 w-5 text-[#1B4332]" />

                            <div>
                                <p className="text-xs font-medium text-[#6F695D]">
                                    {t("decision.selectedTransport")}
                                </p>

                                <p className="font-bold text-[#1B4332]">
                                    {t(selectedTransport.nameKey)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div>
                                <p className="text-xs font-medium text-[#6F695D]">
                                    {t("decision.transportCost")}
                                </p>

                                <p className="font-bold text-[#C4622D]">
                                    ₹{selectedTransport.cost}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-[#6F695D]">
                                    {t("decision.netValue")}
                                </p>

                                <p className="font-bold text-[#1B4332]">
                                    ₹{netValue.toLocaleString("en-IN")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RECOMMENDATION */}
                <section className="rounded-3xl bg-[#1B4332] p-6 text-[#FBF7EF] shadow-xl sm:p-8">

                    <div className="flex items-start gap-4">

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#E8A33D] text-[#1B4332]">
                            <ShieldCheck className="h-6 w-6" />
                        </div>

                        <div className="flex-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-[#B9C9BB]">
                                {t("decision.recommendation")}
                            </p>

                            <h2 className="mt-1 font-serif text-2xl font-semibold">
                                {t(decision.title)}
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#D8E5DC]">
                                {t(decision.description)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">

                        <div className="rounded-2xl bg-white/10 p-4">
                            <Clock className="mb-2 h-5 w-5 text-[#E8A33D]" />

                            <p className="text-xs text-[#B9C9BB]">
                                {t("decision.delivery")}
                            </p>

                            <p className="mt-1 font-semibold">
                                {selectedTransport.time}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4">
                            <Truck className="mb-2 h-5 w-5 text-[#E8A33D]" />

                            <p className="text-xs text-[#B9C9BB]">
                                {t("decision.transport")}
                            </p>

                            <p className="mt-1 font-semibold">
                                {t(selectedTransport.nameKey)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4">
                            <IndianRupee className="mb-2 h-5 w-5 text-[#E8A33D]" />

                            <p className="text-xs text-[#B9C9BB]">
                                {t("decision.netValue")}
                            </p>

                            <p className="mt-1 font-semibold">
                                ₹{netValue.toLocaleString("en-IN")}
                            </p>
                        </div>

                    </div>
                </section>

                {/* PROTOTYPE NOTE */}
                <div className="mt-5 rounded-2xl border border-dashed border-[#E4DCC8] bg-white p-4 text-center">
                    <p className="text-xs leading-5 text-[#6F695D]">
                        {t("decision.prototypeNote")}
                    </p>
                </div>

            </div>
        </main>
    );
}
