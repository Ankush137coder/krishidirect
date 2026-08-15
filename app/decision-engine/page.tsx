// app/decision-engine/page.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, Sprout } from "lucide-react";
import Navbar from "@/components/Navbar";
import DecisionEngine from "@/components/DecisionEngine";
import type { UserRole } from "@/types/marketplace";

export default function DecisionEnginePage() {
    const role: UserRole = "farmer";

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#FBF7EF]">
            <Navbar
                role={role}
                onRoleChange={() => {}}
            />

            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                {/* Back to dashboard */}
                <Link
                    href="/dashboard"
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E4DCC8] bg-white px-4 py-2 text-sm font-medium text-[#3D4A42] transition-colors hover:border-[#1B4332] hover:text-[#1B4332]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                <DecisionEngine />
            </main>

            <footer className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-2 px-4 pb-8 text-xs text-[#8A8370]">
                <Sprout className="h-4 w-4 text-[#1B4332]" />
                KrishiDirect · Post-Harvest Intelligence
            </footer>
        </div>
    );
}
