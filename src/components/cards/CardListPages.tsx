'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import Pagination from "@/components/cards/Pagination";
import CardList from "@/components/cards/CardList";
import {usePageSize} from "@/services/hooks/usePageSize";
import {API_ROUTES} from "@/services/apiConstants";

interface CardListPagesProps {
    tempIsAdmin: boolean;
}
export default function CardListPages({ tempIsAdmin }: CardListPagesProps) {
    const searchParams = useSearchParams();
    const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
    const search = useMemo(() => searchParams.get('search') || '', [searchParams]);
    // const pageSize = parseInt(searchParams.get('pageSize') || '3', 10);
    const { pageSize, setPageSize } = usePageSize();

    const [data, setData] = useState<any>(null);
    const router = useRouter();

    const pathname = usePathname();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${API_ROUTES.GET_ALL_PRODUCTS}/pages?pageNumber=${page}&pageSize=${pageSize}&search=${search}`);
            if (!res.ok) {
                console.error('Failed to fetch');
                return;
            }
            const result = await res.json();
            // console.log(result);
            setData(result);
        };
        fetchData();
    }, [page, pageSize, search]);

    if (!data) return <div>Loading...</div>;

    return (
        <div key={page}> {/* <--- ВАЖНО: key помогает форсировать перерендер */}
            <h2 className="visually-hidden">Products</h2>
            <CardList products={data.content} tempIsAdmin = {tempIsAdmin}/>
            <Pagination totalPages={data.page.totalPages} pageSize={pageSize} currentPage={page} goToPage={goToPage}
                        setPageSize={setPageSize} size={0} totalElements={0} />
        </div>
    );
}