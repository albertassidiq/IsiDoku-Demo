
import { useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { CellData } from '../types';

interface UseNodePositionsProps {
    cellDataMap: Record<string, CellData>;
    pelaksanaColumns: any[];
    rows: any[];
    columnWidths: any;
    setNodes: (nodes: Node[]) => void;
}

export function useNodePositions({
    cellDataMap,
    pelaksanaColumns,
    rows,
    columnWidths,
    setNodes
}: UseNodePositionsProps) {
    // Calculate node positions based on DOM
    const calculateNodePositions = useCallback(() => {
        const positionedNodes: Node[] = [];

        Object.entries(cellDataMap).forEach(([cellId, cellData]) => {
            if (!cellData.nodes || cellData.nodes.length === 0) return;

            const node = cellData.nodes[0];
            if (!node || !node.id) return;

            const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`) as HTMLElement;

            if (cellElement) {
                const parentElement = cellElement.closest('.bg-white') as HTMLElement;
                if (parentElement) {
                    const cellRect = cellElement.getBoundingClientRect();
                    const parentRect = parentElement.getBoundingClientRect();

                    const xPos = cellRect.left - parentRect.left + cellRect.width / 2;
                    const yPos = cellRect.top - parentRect.top + cellRect.height / 2;

                    positionedNodes.push({
                        ...node,
                        id: node.id,
                        position: { x: xPos, y: yPos },
                        data: { ...node.data, cellId },
                    });
                }
            }
        });

        return positionedNodes;
    }, [cellDataMap]);

    // Sync nodes when cellDataMap or layout changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setNodes(calculateNodePositions());
        }, 50);
        return () => clearTimeout(timer);
    }, [calculateNodePositions, pelaksanaColumns, rows, columnWidths, setNodes]);

    // Update positions on window resize
    useEffect(() => {
        const updatePositions = () => {
            setTimeout(() => {
                setNodes(calculateNodePositions());
            }, 100);
        };

        window.addEventListener('resize', updatePositions);
        return () => window.removeEventListener('resize', updatePositions);
    }, [calculateNodePositions, setNodes]);

    return { calculateNodePositions };
}
