"use client";

import React from "react";
import type { PelaksanaColumn } from "../../types";

export interface PelaksanaHeaderCellProps {
    column: PelaksanaColumn;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    totalColumns: number;
    onAddColumn: (position: "start" | "end" | number) => void;
    onRemoveColumn: (id: string) => void;
    onUpdateColumnName: (id: string, newName: string) => void;
}

/**
 * Header cell for Pelaksana columns with inline editing and add/remove buttons
 */
export function PelaksanaHeaderCell({
    column,
    index,
    isFirst,
    isLast,
    totalColumns,
    onAddColumn,
    onRemoveColumn,
    onUpdateColumnName,
    readOnly = false,
}: PelaksanaHeaderCellProps & { readOnly?: boolean }) {
    return (
        <th
            className="border border-gray-400 p-2 text-center relative group hover:z-50"
            style={{
                backgroundColor: "#DEEAF6",
                width: "100px",
                maxWidth: "100px",
                minWidth: "100px",
                boxSizing: "border-box"
            }}
        >
            <div
                contentEditable={!readOnly}
                suppressContentEditableWarning
                onKeyDown={(e) => {
                    if (e.key === "Tab") {
                        e.preventDefault();
                        const nextCell = document.querySelector(
                            `[data-col-index="${index + 1}"] [contenteditable]`
                        ) as HTMLElement;
                        nextCell?.focus();
                    }
                }}
                onBlur={(e) => onUpdateColumnName(column.id, e.currentTarget.innerHTML)}
                data-col-index={index}
                className="outline-none min-w-[20px] block"
                style={{
                    cursor: readOnly ? "default" : "text",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
                dangerouslySetInnerHTML={{ __html: column.name }}
            />

            {!readOnly && (
                <>
                    <button
                        onClick={() => onAddColumn(isFirst ? "start" : index)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold z-50 hover:bg-black hover:text-white"
                        title="Tambah kolom di kiri"
                    >
                        +
                    </button>

                    <button
                        onClick={() => onAddColumn(isLast ? "end" : index)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold z-50 hover:bg-black hover:text-white"
                        title="Tambah kolom di kanan"
                    >
                        +
                    </button>

                    {totalColumns > 1 && (
                        <button
                            onClick={() => onRemoveColumn(column.id)}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-50 hover:bg-black hover:text-white"
                            title="Hapus kolom"
                        >
                            ×
                        </button>
                    )}
                </>
            )}
        </th>
    );
}
