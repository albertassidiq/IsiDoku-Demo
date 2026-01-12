"use client";

import React from "react";
import type { TableRow } from "../../types";

export interface RowNumberCellProps {
    row: TableRow;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    totalRows: number;
    onAddRow: (position: "start" | "end" | number) => void;
    onRemoveRow: (id: string) => void;
}

/**
 * Row number cell with add/remove row buttons
 */
export function RowNumberCell({
    row,
    index,
    isFirst,
    isLast,
    totalRows,
    onAddRow,
    onRemoveRow,
    readOnly = false,
}: RowNumberCellProps & { readOnly?: boolean }) {
    return (
        <td className="border border-gray-400 p-2 text-center relative group align-top">
            {row.no}

            {!readOnly && (
                <>
                    <button
                        onClick={() => onAddRow(isFirst ? "start" : index)}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-10 hover:bg-black hover:text-white"
                        title="Tambah baris di atas"
                    >
                        +
                    </button>

                    <button
                        onClick={() => onAddRow(isLast ? "end" : index)}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-10 hover:bg-black hover:text-white"
                        title="Tambah baris di bawah"
                    >
                        +
                    </button>

                    {totalRows > 1 && (
                        <button
                            onClick={() => onRemoveRow(row.id)}
                            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-10 hover:bg-black hover:text-white"
                            title="Hapus baris"
                        >
                            ×
                        </button>
                    )}
                </>
            )}
        </td>
    );
}
