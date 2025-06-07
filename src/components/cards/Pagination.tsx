'use client';

import styles from '@/styles/components/Pagination/pagination.module.scss';
import React from 'react';
import {PaginationProps} from "@/types/types";


export default function Pagination({ totalPages, pageSize, currentPage, goToPage, setPageSize }: PaginationProps) {
    // console.log("Pagination/currentPage " + currentPage);
    const generatePages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };

    return (
        <div className={styles.pagination}>
            <div className={styles.pagination__controls}>
            <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>{"<"}</button>
            {generatePages().map((p, idx) =>
                p === "..." ? (
                    <span key={idx} className={styles.dots}>...</span>
                ) : (
                    <button
                        key={p}
                        className={p === currentPage ? styles.active : ""}
                        onClick={() => goToPage(p)}
                    >
                        {p}
                    </button>
                )
            )}
            <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>{">"}</button>
            </div>

                {/*setting PageSize*/}
            <div className={styles.pagination__pageSize} style={{marginBottom: '1rem'}}>
                <label htmlFor="pageSizeSelect" style={{marginRight: '8px'}}>
                    Show on the page, by:
                </label>
                <select
                    id="pageSizeSelect"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[3, 6, 9, 12].map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

        </div>
    );
}
