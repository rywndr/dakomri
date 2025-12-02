"use client";

import { Suspense } from "react";

/**
 * Harus di-render di client karena new Date() ga bisa dipanggil
 * dalam prerender dengan cacheComponents enabled
 */
function CurrentYear() {
    return <>{new Date().getFullYear()}</>;
}

export function CopyrightYear() {
    return (
        <Suspense fallback={<span>2024</span>}>
            <CurrentYear />
        </Suspense>
    );
}
