// components/ImpactStats.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingUp, Handshake } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { ImpactMetrics } from "@/types/marketplace";

/** Counts a number up from 0 on mount — the one animated flourish this bar gets. */
function useCountUp(target: number, durationMs = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let raf: number;
        const start = performance.now();
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, durationMs]);
    return value;
}

interface ImpactStatsProps {
    metrics: ImpactMetrics;
}

export default function ImpactStats({ metrics }: ImpactStatsProps) {
    const { t } = useTranslation();
    const savedKg = useCountUp(metrics.totalProduceSavedKg);
    const deals = useCountUp(metrics.activeVendorDeals);

    const cards = [
        {
            icon: Leaf,
            label: t("impact.savedLabel"),
            value: `${savedKg.toLocaleString("en-IN")} kg`,
            accent: "bg-[#2D6A4F]",
            sub: t("impact.savedSub", { percent: metrics.weeklyTrendPercent }),
        },
        {
            icon: TrendingUp,
            label: t("impact.earningsLabel"),
            value: `+${metrics.farmerEarningsBoostPercent}%`,
            accent: "bg-[#C4622D]",
            sub: t("impact.earningsSub"),
        },
        {
            icon: Handshake,
            label: t("impact.dealsLabel"),
            value: deals.toLocaleString("en-IN"),
            accent: "bg-[#E8A33D]",
            sub: t("impact.dealsSub"),
        },
    ];

    return (
        // min-w-0 on the grid itself, plus on every card below, stops long unbroken
        // strings (e.g. "1,420 kg") from forcing the grid track — and therefore the
        // whole page — wider than the viewport. Grid/flex children default to
        // min-width: auto, which is the classic cause of silent horizontal overflow.
        <section
            aria-label="Community impact"
            className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-[#1B4332] p-4 text-[#FBF7EF]"
                >
                    <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${card.accent} opacity-20`} />
                    <div className="mb-2 flex items-center gap-2">
                        <div className={`grid h-8 w-8 place-items-center rounded-full ${card.accent}`}>
                            <card.icon className="h-4 w-4 text-[#1B4332]" strokeWidth={2.25} />
                        </div>
                        <p className="text-xs font-medium text-[#CFE0D3]">{card.label}</p>
                    </div>
                    <p className="font-serif text-2xl font-semibold tracking-tight">{card.value}</p>
                    <p className="mt-0.5 text-[11px] text-[#9FBBA6]">{card.sub}</p>
                </motion.div>
            ))}
        </section>
    );
}
