"use client";

import { useEffect } from "react";
import type { ColumnWidths, ResizingState } from "../types";

export interface UseColumnResizeProps {
    resizingColumn: ResizingState | null;
    setResizingColumn: React.Dispatch<React.SetStateAction<ResizingState | null>>;
    setColumnWidths: React.Dispatch<React.SetStateAction<ColumnWidths>>;
}

/**
 * Hook for handling column resize drag operations
 */
export function useColumnResize({
    resizingColumn,
    setResizingColumn,
    setColumnWidths,
}: UseColumnResizeProps): void {

    useEffect(() => {
        if (!resizingColumn) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - resizingColumn.startX;
            // Different min widths for different columns
            const minWidths: Record<string, number> = {
                aktivitas: 100,
                kelengkapan: 50,
                waktu: 40,
                output: 40,
                keterangan: 80,
            };
            const minWidth = minWidths[resizingColumn.column] || 50;
            const newWidth = Math.max(minWidth, resizingColumn.startWidth + deltaX);

            setColumnWidths(prev => ({
                ...prev,
                [resizingColumn.column]: newWidth,
            }));
        };

        const handleMouseUp = () => {
            setResizingColumn(null);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [resizingColumn, setResizingColumn, setColumnWidths]);
}
