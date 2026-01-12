// Geometry utilities for SOP Builder
import type { NodePosition } from "@/components/ShapeNode";

/**
 * Get the absolute position of a connector element on the page
 */
export function getConnectorPosition(
    cellId: string,
    position: NodePosition
): { x: number; y: number } | null {
    if (typeof document === 'undefined') return null;

    const connector = document.querySelector(
        `[data-connector="${cellId}-${position}"]`
    ) as HTMLElement;
    if (!connector) return null;

    const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
    if (!parentElement) return null;

    const connectorRect = connector.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    return {
        x: connectorRect.left - parentRect.left + connectorRect.width / 2,
        y: connectorRect.top - parentRect.top + connectorRect.height / 2,
    };
}

/**
 * Calculate the position of a node element relative to the container
 */
export function calculateCellPosition(cellId: string): { x: number; y: number } | null {
    if (typeof document === 'undefined') return null;

    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`) as HTMLElement;
    if (!cellElement) return null;

    const parentElement = cellElement.closest('.bg-white') as HTMLElement;
    if (!parentElement) return null;

    const cellRect = cellElement.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    return {
        x: cellRect.left - parentRect.left + cellRect.width / 2,
        y: cellRect.top - parentRect.top + cellRect.height / 2,
    };
}
