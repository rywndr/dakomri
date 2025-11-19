"use client";

import { useState } from "react";
import { EntryModeSelector } from "./entry-mode-selector";
import { BulkUpload } from "./bulk-upload";
import { AdminFormClient } from "@/components/form/admin-form-client";

type EntryMode = "select" | "manual" | "bulk";

export function SubmissionEntryWrapper() {
    const [mode, setMode] = useState<EntryMode>("select");

    const handleSelectMode = (selectedMode: "manual" | "bulk") => {
        setMode(selectedMode);
    };

    const handleBack = () => {
        setMode("select");
    };

    if (mode === "manual") {
        return <AdminFormClient onBack={handleBack} />;
    }

    if (mode === "bulk") {
        return <BulkUpload onBack={handleBack} />;
    }

    return <EntryModeSelector onSelectMode={handleSelectMode} />;
}
