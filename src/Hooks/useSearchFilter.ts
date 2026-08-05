import { useMemo } from 'react';

export function useSearchFilter<T extends Record<string, unknown>>(
    items: T[],
    query: string,
    fields: (keyof T)[] = ['title', 'subtitle'] as (keyof T)[],
): T[] {
    return useMemo(() => {
        if (!query.trim()) return items;
        const searchQuery = query.toLowerCase();
        return items.filter((item) =>
            fields.some((field) =>
                String(item[field]).toLowerCase().includes(searchQuery),
            ),
        );
    }, [items, query, fields]);
}