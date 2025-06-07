'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {useEffect, useState} from 'react';

const DEFAULT_PAGE_SIZE = 3;
const STORAGE_KEY = 'pageSize';

export function usePageSize() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

    useEffect(() => {
        const fromUrl = searchParams.get('pageSize');
        if (fromUrl) {
            setPageSizeState(parseInt(fromUrl, 10));
        } else if (typeof window !== 'undefined') {
            const fromStorage = localStorage.getItem(STORAGE_KEY);
            setPageSizeState(fromStorage ? parseInt(fromStorage, 10) : DEFAULT_PAGE_SIZE);
        }
    }, [searchParams]);

    const setPageSize = (size: number) => {
        localStorage.setItem(STORAGE_KEY, size.toString());
        const params = new URLSearchParams(searchParams);
        params.set('pageSize', size.toString());
        params.set('page', '1'); // Сброс на первую страницу
        router.push(`${pathname}?${params.toString()}`);
    };

    // Если pageSize не задан в URL, но есть в localStorage — вставить его
    useEffect(() => {
        const urlPageSize = searchParams.get('pageSize');
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!urlPageSize && stored) {
            const params = new URLSearchParams(searchParams);
            params.set('pageSize', stored);
            params.set('page', '1');
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, []);

    return { pageSize, setPageSize };
}
