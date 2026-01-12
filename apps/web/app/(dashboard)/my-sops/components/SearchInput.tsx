"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initial query comes from URL
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [debouncedQuery] = useDebounce(query, 300);

    // Update URL when debounced query changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const currentQ = params.get("q") || "";

        // Prevent infinite loop: only update if value actually changed
        if (currentQ === debouncedQuery) return;

        if (debouncedQuery) {
            params.set("q", debouncedQuery);
        } else {
            params.delete("q");
        }

        router.replace(`${pathname}?${params.toString()}`);
    }, [debouncedQuery, pathname, router, searchParams]);

    return (
        <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari SOP..."
                className="pl-9 w-full border-2 border-black rounded-sm focus-visible:ring-black bg-white"
            />
        </div>
    );
}
