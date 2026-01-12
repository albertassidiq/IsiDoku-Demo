"use client";

import { useState, useRef } from "react";
import type {
    PelaksanaColumn,
    TableRow,
    CellData,
    ColumnWidths,
    ResizingState
} from "../types";

// Default values
const DEFAULT_COLUMNS: PelaksanaColumn[] = [
    { id: "1", name: "-" },
    { id: "2", name: "-" },
    { id: "3", name: "-" },
];

const DEFAULT_ROWS: TableRow[] = [{ id: "1", no: 1 }];

const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
    aktivitas: 300,
    kelengkapan: 80,
    waktu: 70,
    output: 70,
    keterangan: 255,
};

export interface UseSOPStateReturn {
    // Columns
    pelaksanaColumns: PelaksanaColumn[];
    setPelaksanaColumns: React.Dispatch<React.SetStateAction<PelaksanaColumn[]>>;

    // Rows
    rows: TableRow[];
    setRows: React.Dispatch<React.SetStateAction<TableRow[]>>;

    // Cell data (shapes)
    cellDataMap: Record<string, CellData>;
    setCellDataMap: React.Dispatch<React.SetStateAction<Record<string, CellData>>>;

    // Column widths
    columnWidths: ColumnWidths;
    setColumnWidths: React.Dispatch<React.SetStateAction<ColumnWidths>>;

    // Resize state
    resizingColumn: ResizingState | null;
    setResizingColumn: React.Dispatch<React.SetStateAction<ResizingState | null>>;

    // PDF upload
    uploadedPdf: File | null;
    setUploadedPdf: React.Dispatch<React.SetStateAction<File | null>>;

    // Chat sidebar
    isChatOpen: boolean;
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;

    // Refs
    documentRef: React.RefObject<HTMLDivElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

// Import SOPSnapshot definition if needed or define locally if it's circular.
// It seems SOPSnapshot is defined in index.ts which exports useSOPState.
// To avoid circular dep, we can define the shape or import from types if available.
// Let's assume passed data matches the state structure.

export interface UseSOPStateProps {
    initialData?: {
        pelaksanaColumns?: PelaksanaColumn[];
        rows?: TableRow[];
        cellDataMap?: Record<string, CellData>;
        columnWidths?: ColumnWidths;
        arrowConnections?: any[]; // We don't store arrows in useSOPState but return them? No, arrows are in useArrowConnections
    };
}

/**
 * Central state management hook for SOP Builder
 * Contains all the core state needed for the SOP table
 */
export function useSOPState(initialData?: UseSOPStateProps['initialData']): UseSOPStateReturn {
    // Pelaksana columns
    const [pelaksanaColumns, setPelaksanaColumns] = useState<PelaksanaColumn[]>(
        initialData?.pelaksanaColumns || DEFAULT_COLUMNS
    );

    // Table rows
    const [rows, setRows] = useState<TableRow[]>(
        initialData?.rows || DEFAULT_ROWS
    );

    // Cell data map (shapes per cell)
    const [cellDataMap, setCellDataMap] = useState<Record<string, CellData>>(
        initialData?.cellDataMap || {}
    );

    // Column widths for resizable columns
    const [columnWidths, setColumnWidths] = useState<ColumnWidths>(
        initialData?.columnWidths || DEFAULT_COLUMN_WIDTHS
    );

    // Resize tracking state
    const [resizingColumn, setResizingColumn] = useState<ResizingState | null>(null);

    // PDF file for merge
    const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);

    // Chat sidebar state
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Refs for DOM elements
    const documentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return {
        pelaksanaColumns,
        setPelaksanaColumns,
        rows,
        setRows,
        cellDataMap,
        setCellDataMap,
        columnWidths,
        setColumnWidths,
        resizingColumn,
        setResizingColumn,
        uploadedPdf,
        setUploadedPdf,
        isChatOpen,
        setIsChatOpen,
        documentRef,
        fileInputRef,
    };
}
