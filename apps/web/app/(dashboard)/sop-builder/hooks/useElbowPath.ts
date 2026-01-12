"use client";

import { useCallback } from "react";
import type { NodePosition } from "@/components/ShapeNode";
import type { CellData, ShapeBounds, ElbowPathResult } from "../types";
import { getConnectorPosition } from "../utils/geometry";
import { lineIntersectsRect, checkPathCollision, getShapeBounds } from "../utils/pathfinding";
import { findOrthogonalPath } from "../utils/astar-routing";

export interface UseElbowPathProps {
    cellDataMap: Record<string, CellData>;
}

export interface UseElbowPathReturn {
    generateElbowPath: (
        sourcePos: { x: number; y: number },
        targetPos: { x: number; y: number },
        sourceNodePos: NodePosition,
        targetNodePos: NodePosition,
        sourceCellId: string,
        targetCellId: string,
        midSegmentOffset?: number,
        bypassOffset?: number,
        horizontalFirst?: boolean
    ) => ElbowPathResult;
    getConnectorPos: (cellId: string, position: NodePosition) => { x: number; y: number } | null;
}

/**
 * Hook for generating elbow paths with obstacle avoidance
 */
export function useElbowPath({
    cellDataMap,
}: UseElbowPathProps): UseElbowPathReturn {

    // Get connector position wrapper
    const getConnectorPos = useCallback((cellId: string, position: NodePosition) => {
        return getConnectorPosition(cellId, position);
    }, []);

    // Generate orthogonal elbow path with obstacle avoidance
    const generateElbowPath = useCallback((
        sourcePos: { x: number; y: number },
        targetPos: { x: number; y: number },
        sourceNodePos: NodePosition,
        targetNodePos: NodePosition,
        sourceCellId: string,
        targetCellId: string,
        midSegmentOffset?: number,
        bypassOffset?: number,
        horizontalFirst?: boolean
    ): ElbowPathResult => {
        const padding = 15;
        const shapeBounds = getShapeBounds(cellDataMap);

        // Filter out source and target shapes from obstacles
        const obstacles = shapeBounds.filter(b => b.cellId !== sourceCellId && b.cellId !== targetCellId);

        // Offset start point based on source position
        let startX = sourcePos.x;
        let startY = sourcePos.y;

        switch (sourceNodePos) {
            case 'top':
                startY -= padding;
                break;
            case 'bottom':
                startY += padding;
                break;
            case 'left':
                startX -= padding;
                break;
            case 'right':
                startX += padding;
                break;
        }

        // Offset end point based on target position
        let endX = targetPos.x;
        let endY = targetPos.y;

        switch (targetNodePos) {
            case 'top':
                endY -= padding;
                break;
            case 'bottom':
                endY += padding;
                break;
            case 'left':
                endX -= padding;
                break;
            case 'right':
                endX += padding;
                break;
        }

        // Determine if horizontal first based on source/target positions or stored value
        const isHorizontalFirst = horizontalFirst !== undefined
            ? horizontalFirst
            : (sourceNodePos === 'left' || sourceNodePos === 'right');

        // Calculate default offsets
        let defaultMidOffset = isHorizontalFirst
            ? (startX + endX) / 2  // X position for vertical segment
            : (startY + endY) / 2; // Y position for horizontal segment

        // Limit max length of first segment if distance is large
        const MAX_SEGMENT_LENGTH = 150;
        const DISTANCE_THRESHOLD = 300;

        if (isHorizontalFirst) {
            const dist = endX - startX;
            if (Math.abs(dist) > DISTANCE_THRESHOLD) {
                defaultMidOffset = startX + (dist > 0 ? MAX_SEGMENT_LENGTH : -MAX_SEGMENT_LENGTH);
            }
        } else {
            const dist = endY - startY;
            if (Math.abs(dist) > DISTANCE_THRESHOLD) {
                defaultMidOffset = startY + (dist > 0 ? MAX_SEGMENT_LENGTH : -MAX_SEGMENT_LENGTH);
            }
        }

        let defaultBypassOffset = isHorizontalFirst
            ? startY  // Y of horizontal bypass (defaults to source Y = straight line)
            : startX; // X of vertical bypass (defaults to source X = straight line)

        // If no custom offset provided, check for collisions and adjust
        let finalMidOffset = midSegmentOffset ?? defaultMidOffset;
        let finalBypassOffset = bypassOffset ?? defaultBypassOffset;
        let useHorizontalFirst = isHorizontalFirst;
        let isAStarPath = false;
        let aStarPoints: { x: number, y: number }[] = [];

        // Only try to avoid collisions if not manually dragging/overridden
        if (midSegmentOffset === undefined && obstacles.length > 0) {
            // Check if default path has collisions
            const hasCollision = checkPathCollision(
                obstacles,
                defaultMidOffset,
                defaultBypassOffset,
                isHorizontalFirst,
                startX,
                startY,
                endX,
                endY
            );

            if (hasCollision) {
                // A* Routing Logic
                // 1. Get container bounds (approximated)
                const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
                const containerWidth = parentElement?.offsetWidth || 2000;
                const containerHeight = parentElement?.offsetHeight || 2000;

                const bounds = { width: containerWidth, height: containerHeight };

                // 2. Run A*
                const pathPoints = findOrthogonalPath(
                    { x: startX, y: startY },
                    { x: endX, y: endY },
                    obstacles,
                    bounds
                );

                if (pathPoints.length > 0) {
                    isAStarPath = true;
                    aStarPoints = pathPoints;
                }
            }
        }

        // Build the SVG path
        let path = "";
        let midPoint = { x: 0, y: 0 };
        let bypassPoint = { x: 0, y: 0 };

        if (isAStarPath) {
            // A* generated path
            aStarPoints.unshift(sourcePos);
            aStarPoints.push(targetPos);

            if (aStarPoints[0]) {
                path = `M ${aStarPoints[0].x} ${aStarPoints[0].y}`;
                for (let i = 1; i < aStarPoints.length; i++) {
                    const p = aStarPoints[i];
                    if (p) {
                        path += ` L ${p.x} ${p.y}`;
                    }
                }
            }

            // Picks roughly middle points for handles - not perfect but prevents crash
            const midIdx = Math.floor(aStarPoints.length / 2);
            midPoint = aStarPoints[midIdx] || sourcePos;
            bypassPoint = aStarPoints[Math.max(0, midIdx - 1)] || sourcePos;

            // We update "default" offsets to match the A* path's rough geometry
            // so if user tries to drag, it starts from somewhat reasonable place
            finalMidOffset = isHorizontalFirst ? midPoint.x : midPoint.y;
            finalBypassOffset = isHorizontalFirst ? midPoint.y : midPoint.x;

        } else {
            // Standard deterministic path
            const points: { x: number; y: number }[] = [];
            points.push(sourcePos); // Start at source

            if (useHorizontalFirst) {
                // Path: Source -> Horizontal(bypassY) -> Vertical(midX) -> Horizontal(endY) -> Target
                points.push({ x: startX, y: startY }); // Move out from source
                points.push({ x: startX, y: finalBypassOffset }); // Vertical to bypass height
                points.push({ x: finalMidOffset, y: finalBypassOffset }); // Horizontal on bypass
                points.push({ x: finalMidOffset, y: endY }); // Vertical to target row
                points.push({ x: endX, y: endY }); // Horizontal to end
            } else {
                // Path: Source -> Vertical(bypassX) -> Horizontal(midY) -> Vertical(endX) -> Target
                points.push({ x: startX, y: startY }); // Move out from source
                points.push({ x: finalBypassOffset, y: startY }); // Horizontal to bypass X
                points.push({ x: finalBypassOffset, y: finalMidOffset }); // Vertical on bypass
                points.push({ x: endX, y: finalMidOffset }); // Horizontal to target col
                points.push({ x: endX, y: endY }); // Vertical to end
            }

            points.push(targetPos); // End at target

            // The draggable mid point position (on the vertical/horizontal segment)
            midPoint = useHorizontalFirst
                ? { x: finalMidOffset, y: (finalBypassOffset + endY) / 2 }
                : { x: (finalBypassOffset + endX) / 2, y: finalMidOffset };

            // The draggable bypass point position (on the bypass segment)
            bypassPoint = useHorizontalFirst
                ? { x: (startX + finalMidOffset) / 2, y: finalBypassOffset }
                : { x: finalBypassOffset, y: (startY + finalMidOffset) / 2 };

            path = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`;
            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                if (point) {
                    path += ` L ${point.x} ${point.y}`;
                }
            }
        }

        return {
            path,
            midPoint,
            bypassPoint,
            isHorizontalFirst: useHorizontalFirst,
            defaultMidOffset: finalMidOffset,
            defaultBypassOffset: finalBypassOffset
        };
    }, [cellDataMap]);

    return {
        generateElbowPath,
        getConnectorPos,
    };
}
