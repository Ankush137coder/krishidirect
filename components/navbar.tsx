"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sprout,
    Globe,
    ChevronDown,
    Check,
    Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import type { Language, UserRole } from "@/types/marketplace";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const LANGUAGES: Record<Language, string> = {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी",
};

export default function Navbar({ role, onRoleChange }: NavbarProps) {
    const [langOpen, setLangOpen] = useState(false);
    const { language, setLanguage, t } = useTranslation();

    const router = useRouter();
    const pathname = usePathname();

    const isDecisionEngine = pathname === "/decision-engine";

    return (
        <header className="sticky top-0 z-40 w-full max-w-full border-b border-[#E4DCC8] bg-[#FBF7EF]/90 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-1.5 px-3 py-3 sm:gap-3 sm:px-6">

                {/* Wordmark */}
                <button
                    onClick={() => router.push("/")}
                    className="flex shrink-0 items-center gap-1.5 sm:gap-2"
                >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1B4332] sm:h-9 sm:w-9">
                        <Sprout
                            className="h-4 w-4 text-[#E8A33D] sm:h-5 sm:w-5"
                            strokeWidth={2.25}
                        />
                    </div>

                    <span className="whitespace-nowrap font-serif text-base font-semibold tracking-tight text-[#1B4332] sm:text-lg">
                        Krishi<span className="text-[#C4622D]">Direct</span>
                    </span>
                </button>

                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">

                    {/* Farmer / Vendor */}
                    <div
                        role="tablist"
                        aria-label="Switch mode"
                        className="relative flex shrink-0 rounded-full bg-[#EFE8D6] p-1 text-xs font-medium sm:text-sm"
                    >
                        {(["farmer", "vendor"] as UserRole[]).map((r) => (
                            <button
                                key={r}
                                role="tab"
                                aria-selected={role === r && !isDecisionEngine}
                                onClick={() => {
                                    onRoleChange(r);
                                    router.push("/");
                                }}
                                className={cn(
                                    "relative z-10 rounded-full px-2.5 py-1.5 capitalize transition-colors sm:px-3.5",
                                    role === r && !isDecisionEngine
                                        ? "text-[#FBF7EF]"
                                        : "text-[#3D4A42] hover:text-[#1B4332]"
                                )}
                            >
                                {role === r && !isDecisionEngine && (
                                    <motion.span
                                        layoutId="role-pill"
                                        className="absolute inset-0 -z-10 rounded-full bg-[#1B4332]"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}

                                {r === "farmer"
                                    ? t("nav.farmer")
                                    : t("nav.vendor")}
                            </button>
                        ))}
                    </div>

                    {/* Decision Engine */}
                    <button
                        onClick={() => router.push("/decision-engine")}
                        className={cn(
                            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm",
                            isDecisionEngine
                                ? "bg-[#E8A33D] text-[#1B4332] shadow-sm"
                                : "border border-[#E4DCC8] bg-white text-[#1B4332] hover:border-[#1B4332]"
                        )}
                    >
                        <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

                        <span className="hidden sm:inline">
                            Decision Engine
                        </span>

                        <span className="sm:hidden">
                            Engine
                        </span>
                    </button>

                    {/* Language */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setLangOpen((v) => !v)}
                            aria-haspopup="listbox"
                            aria-expanded={langOpen}
                            aria-label={`Language: ${LANGUAGES[language]}`}
                            className="flex items-center gap-1 rounded-full border border-[#E4DCC8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#3D4A42] transition-colors hover:border-[#1B4332] sm:gap-1.5 sm:px-3 sm:text-sm"
                        >
                            <Globe className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

                            <span className="sm:hidden">
                                {language.toUpperCase()}
                            </span>

                            <span className="hidden sm:inline">
                                {LANGUAGES[language]}
                            </span>

                            <ChevronDown
                                className={cn(
                                    "h-3 w-3 shrink-0 transition-transform sm:h-3.5 sm:w-3.5",
                                    langOpen && "rotate-180"
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.ul
                                    role="listbox"
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.97,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.97,
                                    }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 z-50 mt-2 w-36 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-[#E4DCC8] bg-white p-1 shadow-lg"
                                >
                                    {(Object.keys(LANGUAGES) as Language[]).map(
                                        (code) => (
                                            <li key={code}>
                                                <button
                                                    role="option"
                                                    aria-selected={
                                                        language === code
                                                    }
                                                    onClick={() => {
                                                        setLanguage(code);
                                                        setLangOpen(false);
                                                    }}
                                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[#3D4A42] hover:bg-[#FBF7EF]"
                                                >
                                                    {LANGUAGES[code]}

                                                    {language === code && (
                                                        <Check className="h-4 w-4 text-[#1B4332]" />
                                                    )}
                                                </button>
                                            </li>
                                        )
                                    )}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
