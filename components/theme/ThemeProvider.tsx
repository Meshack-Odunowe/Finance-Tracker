"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState, ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Avoid Hydration Mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}
