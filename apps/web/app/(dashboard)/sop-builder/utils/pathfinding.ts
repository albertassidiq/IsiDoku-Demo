// Pathfinding utilities for arrow routing
import type { ShapeBounds, CellData } from "../types";

/**
 * Check if a line segment intersects with a rectangle
 */
export function lineIntersectsRect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rect: ShapeBounds,
    padding: number = 5
): boolean {
    const left = rect.x - padding;
    const right = rect.x + rect.width + padding;
    const top = rect.y - padding;
    const bottom = rect.y + rect.height + padding;

    // Check if line intersects rectangle
    if (Math.abs(x1 - x2) < 1) {
        // Vertical line
        const x = x1;
        if (x >= left && x <= right) {
            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);
            return !(maxY < top || minY > bottom);
        }
    } else if (Math.abs(y1 - y2) < 1) {
        // Horizontal line
        const y = y1;
        if (y >= top && y <= bottom) {
            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);
            return !(maxX < left || minX > right);
        }
    }
    return false;
}

/**
 * Check if a path with given midOffset collides with any obstacle
 */
export function checkPathCollision(
    obstacles: ShapeBounds[],
    midOff: number,
    bypassOff: number,
    isHorizFirst: boolean,
    sX: number,
    sY: number,
    eX: number,
    eY: number
): boolean {
    for (const obs of obstacles) {
        if (isHorizFirst) {
            // H-V-H path with bypass: Source -> H(bypassY) -> V(midX) -> H(endY) -> Target
            if (lineIntersectsRect(sX, bypassOff, midOff, bypassOff, obs)) return true;
            if (lineIntersectsRect(midOff, bypassOff, midOff, eY, obs)) return true;
            if (lineIntersectsRect(midOff, eY, eX, eY, obs)) return true;
        } else {
            // V-H-V path with bypass: Source -> V(bypassX) -> H(midY) -> V(endX) -> Target
            if (lineIntersectsRect(bypassOff, sY, bypassOff, midOff, obs)) return true;
            if (lineIntersectsRect(bypassOff, midOff, eX, midOff, obs)) return true;
            if (lineIntersectsRect(eX, midOff, eX, eY, obs)) return true;
        }
    }
    return false;
}

/**
 * Get all shape bounds for pathfinding - only cells with shapes
 */
export function getShapeBounds(cellDataMap: Record<string, CellData>): ShapeBounds[] {
    const bounds: ShapeBounds[] = [];

    Object.entries(cellDataMap).forEach(([cellId, cellData]) => {
        // Skip cells without shapes
        if (!cellData.nodes || cellData.nodes.length === 0) return;

        const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`) as HTMLElement;
        if (!cellElement) return;

        const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
        if (!parentElement) return;

        const cellRect = cellElement.getBoundingClientRect();
        const parentRect = parentElement.getBoundingClientRect();

        bounds.push({
            cellId,
            x: cellRect.left - parentRect.left,
            y: cellRect.top - parentRect.top,
            width: cellRect.width,
            height: cellRect.height,
        });
    });

    return bounds;
}
