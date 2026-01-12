// Types for SOP Builder module
import { Node, Edge, Connection } from "@xyflow/react";

// Re-export types from external modules for convenience
export type { Node, Edge, Connection };
export { MarkerType } from "@xyflow/react";

// Re-export from ShapeNode
export type { NodePosition, ArrowConnection } from "@/components/ShapeNode";
export type { ShapeType } from "@/components/ShapeMenu";

// Constants
export const CELL_WIDTH = 100;
export const CELL_HEIGHT = 80;

// Cell data containing nodes for a specific cell
export interface CellData {
    cellId: string;
    nodes: Node[];
}

// Column definition for Pelaksana section
export interface PelaksanaColumn {
    id: string;
    name: string;
}

// Table row representing one activity step
export interface TableRow {
    id: string;
    no: number;
    activity?: string;      // Aktivitas/Kegiatan description
    kelengkapan?: string;   // Mutu Baku - Kelengkapan
    waktu?: string;         // Mutu Baku - Waktu
    output?: string;        // Mutu Baku - Output
    keterangan?: string;    // Keterangan
}

// Position of a connector on the page
export interface ConnectorPosition {
    x: number;
    y: number;
    cellId: string;
    position: import("@/components/ShapeNode").NodePosition;
}

// Bounding box of a shape for collision detection
export interface ShapeBounds {
    cellId: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

// Column widths for resizable columns
export interface ColumnWidths {
    aktivitas: number;
    kelengkapan: number;
    waktu: number;
    output: number;
    keterangan: number;
}

// State for column resizing
export interface ResizingState {
    column: 'aktivitas' | 'kelengkapan' | 'waktu' | 'output' | 'keterangan';
    startX: number;
    startWidth: number;
}

// Connection state for arrow creation
export interface ConnectionState {
    isConnecting: boolean;
    sourceCell: string | null;
    sourcePosition: import("@/components/ShapeNode").NodePosition | null;
}

// State for dragging elbow handles
export interface DraggingElbowState {
    arrowId: string;
    pointIndex: number;
    startX: number;
    startY: number;
    originalPoint: { x: number; y: number };
    direction: 'horizontal' | 'vertical' | null;
}

// Result of generating an elbow path
export interface ElbowPathResult {
    path: string;
    midPoint: { x: number; y: number };
    bypassPoint: { x: number; y: number } | null;
    isHorizontalFirst: boolean;
    defaultMidOffset: number;
    defaultBypassOffset: number;
}
