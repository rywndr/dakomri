"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Provider tu React Query
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 menit - data dianggap fresh
                        gcTime: 10 * 60 * 1000, // 10 menit - garbage collection time
                        refetchOnWindowFocus: false, // Jangan refetch saat focus
                        refetchOnMount: false, // Jangan refetch saat mount jika masih fresh
                        refetchOnReconnect: false, // Jangan refetch saat reconnect
                        retry: 1, // Hanya retry 1x jika gagal
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
