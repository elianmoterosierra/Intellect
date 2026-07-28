import { useMemo } from "react";


export function useSearchFilter(items, query, fields = ['title', 'subtitle']) {
    return useMemo(() => {
        if (!query.trim()) return items
        const searchQuery = query.toLowerCase()
        return items.filter(item => fields.some(fields => String(item[fields]).toLowerCase().includes(searchQuery)))
    }, [items, query, fields])

}