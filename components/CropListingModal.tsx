// components/CropListingModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Minus,
    Plus,
    Camera,
    Mic,
    Carrot,
    Wheat,
    Leaf,
    Apple,
    CircleDot,
    Sprout as SproutIcon,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type TranslationKey } from "@/lib/i18n";
import type { Category, CropListing, Unit } from "@/types/marketplace";
import FarmerVoiceWidget from "./FarmerVoiceWidget";

const CATEGORY_META: { id: Category; labelKey: TranslationKey; icon: typeof Carrot }[] = [
    { id: "tomato", labelKey: "category.tomato", icon: CircleDot },
    { id: "potato", labelKey: "category.potato", icon: SproutIcon },
    { id: "onion", labelKey: "category.onion", icon: Carrot },
    { id: "leafy-greens", labelKey: "category.leafy-greens", icon: Leaf },
    { id: "fruits", labelKey: "category.fruits", icon: Apple },
    { id: "grains", labelKey: "category.grains", icon: Wheat },
];

interface CropListingModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (listing: Partial<CropListing>) => void;
}

export default function CropListingModal({ open, onClose, onSubmit }: CropListingModalProps) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState<Category | null>(null);
    const [quantity, setQuantity] = useState(5);
    const [unit, setUnit] = useState<Unit>("quintal");
    const [price, setPrice] = useState(20);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [photoAttached, setPhotoAttached] = useState(false);

    const totalSteps = 3;

    const reset = () => {
        setStep(1);
        setCategory(null);
        setQuantity(5);
        setPrice(20);
        setPhotoAttached(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = () => {
        onSubmit({
            category: category ?? "tomato",
            quantity,
            unit,
            pricePerUnit: price,
            harvestedAt: new Date().toISOString(),
            quality: "standard",
            isBulkAvailable: quantity > 5,
        });
        handleClose();
    };

    const step1Valid = category !== null;

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 grid place-items-end bg-[#1B4332]/60 backdrop-blur-sm sm:place-items-center"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ y: 80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#FBF7EF] p-6 pb-8 sm:rounded-3xl"
                        >
                            {/* Header */}
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="font-serif text-xl font-semibold text-[#1B4332]">
                                        {t("modal.title")}
                                    </p>
                                    <p className="text-sm text-[#8A8370]">
                                        {t("modal.stepOf", { step, total: totalSteps })}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    aria-label="Close"
                                    className="grid h-9 w-9 place-items-center rounded-full bg-[#EFE8D6] text-[#3D4A42] hover:bg-[#E4DCC8]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="mb-6 flex gap-1.5">
                                {Array.from({ length: totalSteps }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 flex-1 rounded-full transition-colors",
                                            i < step ? "bg-[#1B4332]" : "bg-[#E4DCC8]"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Voice shortcut */}
                            <button
                                onClick={() => setVoiceOpen(true)}
                                className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C4622D] bg-[#FCEFE3] py-3 text-sm font-semibold text-[#C4622D] transition-colors hover:bg-[#F9E2CC]"
                            >
                                <Mic className="h-4 w-4" /> {t("modal.speakInstead")}
                            </button>

                            {/* STEP 1 — category */}
                            {step === 1 && (
                                <div>
                                    <p className="mb-3 text-sm font-medium text-[#3D4A42]">
                                        {t("modal.whatDidYouHarvest")}
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {CATEGORY_META.map(({ id, labelKey, icon: Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => setCategory(id)}
                                                aria-pressed={category === id}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 rounded-2xl border-2 py-4 transition-all",
                                                    category === id
                                                        ? "border-[#1B4332] bg-[#1B4332] text-[#FBF7EF] shadow-md"
                                                        : "border-[#E4DCC8] bg-white text-[#3D4A42] hover:border-[#B9C9BB]"
                                                )}
                                            >
                                                <Icon className="h-7 w-7" strokeWidth={1.75} />
                                                <span className="text-xs font-medium">{t(labelKey)}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <p className="mb-3 mt-6 text-sm font-medium text-[#3D4A42]">
                                        {t("modal.addPhoto")}
                                    </p>
                                    <button
                                        onClick={() => setPhotoAttached((v) => !v)}
                                        className={cn(
                                            "flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed py-8 transition-colors",
                                            photoAttached
                                                ? "border-[#1B4332] bg-[#EAF1EC] text-[#1B4332]"
                                                : "border-[#E4DCC8] text-[#8A8370] hover:border-[#B9C9BB]"
                                        )}
                                    >
                                        <Camera className="h-7 w-7" strokeWidth={1.5} />
                                        <span className="text-sm font-medium">
                                            {photoAttached ? t("modal.photoAttached") : t("modal.tapToPhoto")}
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* STEP 2 — quantity & price */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-sm font-medium text-[#3D4A42]">{t("modal.quantity")}</p>
                                            <div className="flex overflow-hidden rounded-full border border-[#E4DCC8] text-xs font-semibold">
                                                {(["kg", "quintal"] as Unit[]).map((u) => (
                                                    <button
                                                        key={u}
                                                        onClick={() => setUnit(u)}
                                                        className={cn(
                                                            "px-3 py-1 capitalize transition-colors",
                                                            unit === u ? "bg-[#1B4332] text-[#FBF7EF]" : "bg-white text-[#3D4A42]"
                                                        )}
                                                    >
                                                        {u}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-[#E4DCC8] bg-white p-3">
                                            <button
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                aria-label="Decrease quantity"
                                                className="grid h-12 w-12 place-items-center rounded-xl bg-[#EFE8D6] text-[#1B4332] active:scale-95"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                            <span className="font-serif text-3xl font-semibold text-[#1B4332]">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity((q) => q + 1)}
                                                aria-label="Increase quantity"
                                                className="grid h-12 w-12 place-items-center rounded-xl bg-[#1B4332] text-[#FBF7EF] active:scale-95"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-sm font-medium text-[#3D4A42]">
                                            {t("modal.pricePerUnit", { unit })}
                                        </p>
                                        <div className="flex items-center justify-between rounded-2xl border border-[#E4DCC8] bg-white p-3">
                                            <button
                                                onClick={() => setPrice((p) => Math.max(1, p - 5))}
                                                aria-label="Decrease price"
                                                className="grid h-12 w-12 place-items-center rounded-xl bg-[#EFE8D6] text-[#1B4332] active:scale-95"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                            <span className="font-serif text-3xl font-semibold text-[#1B4332]">
                                                ₹{price}
                                            </span>
                                            <button
                                                onClick={() => setPrice((p) => p + 5)}
                                                aria-label="Increase price"
                                                className="grid h-12 w-12 place-items-center rounded-xl bg-[#1B4332] text-[#FBF7EF] active:scale-95"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 — preview */}
                            {step === 3 && (
                                <div>
                                    <p className="mb-3 text-sm font-medium text-[#3D4A42]">{t("modal.preview")}</p>
                                    <div className="rounded-2xl border border-[#E4DCC8] bg-white p-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#EAF1EC] text-[#1B4332]">
                                                {(() => {
                                                    const meta = CATEGORY_META.find((c) => c.id === category);
                                                    const Icon = meta?.icon ?? Carrot;
                                                    return <Icon className="h-6 w-6" />;
                                                })()}
                                            </div>
                                            <div>
                                                <p className="font-semibold capitalize text-[#1B4332]">
                                                    {category ? t(CATEGORY_META.find((c) => c.id === category)!.labelKey) : "—"}
                                                </p>
                                                <p className="text-sm text-[#8A8370]">
                                                    {quantity} {unit} · ₹{price}/{unit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-lg bg-[#EAF1EC] px-3 py-2 text-xs font-medium text-[#1B4332]">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {t("modal.nearbyBuyers")}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-center text-sm text-[#8A8370]">
                                        {t("modal.totalValue")}{" "}
                                        <span className="font-semibold text-[#C4622D]">
                                            ₹{(quantity * price).toLocaleString("en-IN")}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Footer nav */}
                            <div className="mt-8 flex gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep((s) => s - 1)}
                                        className="flex-1 rounded-2xl border border-[#E4DCC8] py-3.5 text-sm font-semibold text-[#3D4A42]"
                                    >
                                        {t("modal.back")}
                                    </button>
                                )}
                                {step < totalSteps ? (
                                    <button
                                        onClick={() => setStep((s) => s + 1)}
                                        disabled={step === 1 && !step1Valid}
                                        className="flex-1 rounded-2xl bg-[#1B4332] py-3.5 text-sm font-semibold text-[#FBF7EF] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {t("modal.continue")}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 rounded-2xl bg-[#E8A33D] py-3.5 text-sm font-semibold text-[#1B4332] transition-transform active:scale-[0.98]"
                                    >
                                        {t("modal.publish")}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FarmerVoiceWidget
                open={voiceOpen}
                onClose={() => setVoiceOpen(false)}
                onTranscript={() => setStep(2)}
            />
        </>
    );
}
