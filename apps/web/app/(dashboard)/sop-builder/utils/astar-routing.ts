import { ShapeBounds } from "../types";
import { lineIntersectsRect } from "./pathfinding";

// Configuration
const GRID_SIZE = 10; // Grid cell size in pixels
const TURN_PENALTY = 10; // Cost added for making a turn (to prefer straight lines)
const MAX_ITERATIONS = 15000; // Increased to allow finding longer paths in complex diagrams

interface Point {
    x: number;
    y: number;
}

interface GridNode {
    x: number;
    y: number;
    g: number; // Cost from start
    h: number; // Heuristic to end
    f: number; // Total cost (g + h)
    parent: GridNode | null;
    direction: 'horizontal' | 'vertical' | null;
}

/**
 * Snap a point to the nearest grid line
 */
function snapToGrid(val: number): number {
    return Math.round(val / GRID_SIZE) * GRID_SIZE;
}

/**
 * Heuristic function (Manhattan distance)
 */
function heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Check if a point is inside any obstacle (expanded by padding)
 */
function isBlocked(p: Point, obstacles: ShapeBounds[], padding: number = 20): boolean {
    for (const obs of obstacles) {
        if (
            p.x >= obs.x - padding &&
            p.x <= obs.x + obs.width + padding &&
            p.y >= obs.y - padding &&
            p.y <= obs.y + obs.height + padding
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Find an orthogonal path using A* algorithm
 */
export function findOrthogonalPath(
    start: Point,
    end: Point,
    obstacles: ShapeBounds[],
    bounds: { width: number; height: number }
): Point[] {
    // Snap start and end to grid for consistency
    const startGrid = { x: snapToGrid(start.x), y: snapToGrid(start.y) };
    const endGrid = { x: snapToGrid(end.x), y: snapToGrid(end.y) };

    const openSet: GridNode[] = [];
    const closedSet = new Set<string>();

    const startNode: GridNode = {
        x: startGrid.x,
        y: startGrid.y,
        g: 0,
        h: heuristic(startGrid, endGrid),
        f: heuristic(startGrid, endGrid),
        parent: null,
        direction: null
    };

    openSet.push(startNode);

    let iterations = 0;

    // Optimasi: Batasi area pencarian
    // Kita hanya mencari di dalam bounding box antara start dan end + margin
    // Ini mencegah A* mencari ke seluruh kanvas 2000x2000
    const SEARCH_BUFFER = 200; // Buffer pixel di sekitar area pencarian
    const minSearchX = Math.min(startGrid.x, endGrid.x) - SEARCH_BUFFER;
    const maxSearchX = Math.max(startGrid.x, endGrid.x) + SEARCH_BUFFER;
    const minSearchY = Math.min(startGrid.y, endGrid.y) - SEARCH_BUFFER;
    const maxSearchY = Math.max(startGrid.y, endGrid.y) + SEARCH_BUFFER;

    while (openSet.length > 0) {
        iterations++;
        // User reports lag, so we keep this limit reasonable but allow enough steps for local routing
        if (iterations > MAX_ITERATIONS) {
            console.warn("A* pathfinding hit max iterations, falling back to direct path");
            return [start, { x: start.x, y: end.y }, end];
        }

        // Get node with lowest f score
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;

        // Check if reached target (within grid size tolerance)
        if (Math.abs(current.x - endGrid.x) < GRID_SIZE && Math.abs(current.y - endGrid.y) < GRID_SIZE) {
            return reconstructPath(current, start, end);
        }

        const key = `${current.x},${current.y}`;
        closedSet.add(key);

        // Generate neighbors (up, down, left, right)
        const neighbors = [
            { x: current.x + GRID_SIZE, y: current.y, dir: 'horizontal' },
            { x: current.x - GRID_SIZE, y: current.y, dir: 'horizontal' },
            { x: current.x, y: current.y + GRID_SIZE, dir: 'vertical' },
            { x: current.x, y: current.y - GRID_SIZE, dir: 'vertical' }
        ];

        for (const neighbor of neighbors) {
            if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

            const inCanvasBounds = neighbor.x >= 0 && neighbor.y >= 0 && neighbor.x <= bounds.width && neighbor.y <= bounds.height;

            // Check optimization bounds (restricted area)
            const inSearchBounds = neighbor.x >= minSearchX && neighbor.x <= maxSearchX && neighbor.y >= minSearchY && neighbor.y <= maxSearchY;

            if (!inCanvasBounds || !inSearchBounds) continue;

            // Check collision
            if (isBlocked(neighbor, obstacles)) continue;

            // Calculate cost
            let newG = current.g + GRID_SIZE;

            // Add turn penalty
            if (current.direction && current.direction !== neighbor.dir) {
                newG += TURN_PENALTY;
            }

            const existingNeighbor = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);

            if (!existingNeighbor || newG < existingNeighbor.g) {
                const h = heuristic(neighbor, endGrid);
                const newNode: GridNode = {
                    x: neighbor.x,
                    y: neighbor.y,
                    g: newG,
                    h: h,
                    f: newG + h,
                    parent: current,
                    direction: neighbor.dir as 'horizontal' | 'vertical'
                };

                if (!existingNeighbor) {
                    openSet.push(newNode);
                } else {
                    existingNeighbor.g = newG;
                    existingNeighbor.f = newG + h;
                    existingNeighbor.parent = current;
                    existingNeighbor.direction = neighbor.dir as 'horizontal' | 'vertical';
                }
            }
        }
    }

    // No path found
    return [start, { x: start.x, y: end.y }, end];
}

function reconstructPath(node: GridNode, originalStart: Point, originalEnd: Point): Point[] {
    const path: Point[] = [];
    let current: GridNode | null = node;

    while (current) {
        path.unshift({ x: current.x, y: current.y });
        current = current.parent;
    }

    // Simplify path: remove collinear points
    if (path.length > 2) {
        const firstPoint = path[0];
        if (!firstPoint) return path;

        const simplified: Point[] = [firstPoint];
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];

            if (!prev || !curr || !next) continue;

            // If x is same or y is same for all three, skip current
            const sameX = Math.abs(prev.x - curr.x) < 1 && Math.abs(curr.x - next.x) < 1;
            const sameY = Math.abs(prev.y - curr.y) < 1 && Math.abs(curr.y - next.y) < 1;

            if (!sameX && !sameY) {
                simplified.push(curr);
            }
        }

        const lastPoint = path[path.length - 1];
        if (lastPoint) {
            simplified.push(lastPoint);
        }

        // Replace snapped start/end with originals
        simplified[0] = originalStart;
        simplified[simplified.length - 1] = originalEnd;

        return simplified;
    }

    if (path.length > 0) {
        path[0] = originalStart;
        path[path.length - 1] = originalEnd;
    }
    return path;
}
