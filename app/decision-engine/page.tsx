"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import DecisionEngine from "@/components/DecisionEngine";
import type { UserRole } from "@/types/marketplace";

export default function DecisionEnginePage() {
    const [role, setRole] = useState<UserRole>("farmer");

    return (
        <div className="min-h-screen bg-[#FBF7EF]">
            <Navbar
                role={role}
                onRoleChange={setRole}
            />

            <DecisionEngine />
        </div>
    );
}
