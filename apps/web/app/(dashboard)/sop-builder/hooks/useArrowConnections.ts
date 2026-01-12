"use client";

import { useState, useCallback, useEffect } from "react";
import { Node, Edge, Connection, MarkerType } from "@xyflow/react";
import type { ArrowConnection, NodePosition } from "@/components/ShapeNode";
import type { CellData, ConnectionState, DraggingElbowState } from "../types";

export interface UseArrowConnectionsProps {
    cellDataMap: Record<string, CellData>;
    setCellDataMap: React.Dispatch<React.SetStateAction<Record<string, CellData>>>;
    initialArrows?: ArrowConnection[];
}

/**
 * Return type for the useArrowConnections hook
 */
export interface UseArrowConnectionsReturn {
    arrowConnections: ArrowConnection[];
    setArrowConnections: React.Dispatch<React.SetStateAction<ArrowConnection[]>>;
    connectionState: ConnectionState;
    setConnectionState: React.Dispatch<React.SetStateAction<ConnectionState>>;
    activeNodes: Record<string, NodePosition | null>;
    setActiveNodes: React.Dispatch<React.SetStateAction<Record<string, NodePosition | null>>>;
    selectedArrow: string | null;
    setSelectedArrow: React.Dispatch<React.SetStateAction<string | null>>;
    draggingElbow: DraggingElbowState | null;
    setDraggingElbow: React.Dispatch<React.SetStateAction<DraggingElbowState | null>>;
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    handleNodeClick: (cellId: string, position: NodePosition) => void;
    onConnect: (connection: Connection) => void;
    deleteSelectedArrow: () => void;
}

/**
 * Hook for managing arrow connections and related state
 */
export function useArrowConnections({
    cellDataMap,
    setCellDataMap,
    initialArrows = [],
}: UseArrowConnectionsProps): UseArrowConnectionsReturn {

    // Arrow connections state
    const [arrowConnections, setArrowConnections] = useState<ArrowConnection[]>(initialArrows);

    // Connection state for creating new arrows
    const [connectionState, setConnectionState] = useState<ConnectionState>({
        isConnecting: false,
        sourceCell: null,
        sourcePosition: null,
    });

    // Active nodes during connection
    const [activeNodes, setActiveNodes] = useState<Record<string, NodePosition | null>>({});

    // Selected arrow for editing/deletion
    const [selectedArrow, setSelectedArrow] = useState<string | null>(null);

    // Dragging elbow state
    const [draggingElbow, setDraggingElbow] = useState<DraggingElbowState | null>(null);

    // ReactFlow nodes/edges state
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // ESC key handler to cancel connection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && connectionState.isConnecting) {
                setConnectionState({
                    isConnecting: false,
                    sourceCell: null,
                    sourcePosition: null,
                });
                setActiveNodes({});
            }

            // Delete selected arrow
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedArrow) {
                setArrowConnections(prev => prev.filter(conn => conn.id !== selectedArrow));
                setSelectedArrow(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [connectionState.isConnecting, selectedArrow]);

    // Handle elbow dragging mouse events
    useEffect(() => {
        if (!draggingElbow) return;

        const handleMouseMove = (e: MouseEvent) => {
            const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
            if (!parentElement) return;

            const parentRect = parentElement.getBoundingClientRect();
            const currentX = e.clientX - parentRect.left;
            const currentY = e.clientY - parentRect.top;

            const deltaX = currentX - draggingElbow.startX;
            const deltaY = currentY - draggingElbow.startY;

            setArrowConnections(prev => prev.map(conn => {
                if (conn.id !== draggingElbow.arrowId) return conn;

                // Determine the current raw value based on ORIGINAL start point + delta
                // This prevents "stickiness" by not relying on the current (snapped) value
                let proposedValue: number;

                if (draggingElbow.pointIndex === 0) {
                    // Mid segment
                    const midStartVal = draggingElbow.direction === 'horizontal'
                        ? draggingElbow.originalPoint.x
                        : draggingElbow.originalPoint.y;

                    proposedValue = draggingElbow.direction === 'horizontal'
                        ? midStartVal + deltaX
                        : midStartVal + deltaY;
                } else {
                    // Bypass
                    const isHorizontal = draggingElbow.direction === 'horizontal';
                    const bypassStartVal = isHorizontal ? draggingElbow.originalPoint.x : draggingElbow.originalPoint.y;
                    const delta = isHorizontal ? deltaX : deltaY;

                    proposedValue = bypassStartVal + delta;
                }

                // Snap logic
                let finalValue = proposedValue;
                const SNAP_THRESHOLD = 8;

                // Find potential snap targets (node centers)
                for (const node of nodes) {
                    if (draggingElbow.direction === 'horizontal') {
                        // Snapping X
                        const diff = Math.abs(proposedValue - node.position.x);
                        if (diff < SNAP_THRESHOLD) {
                            finalValue = node.position.x;
                            break;
                        }
                    } else {
                        // Snapping Y
                        const diff = Math.abs(proposedValue - node.position.y);
                        if (diff < SNAP_THRESHOLD) {
                            finalValue = node.position.y;
                            break;
                        }
                    }
                }

                if (draggingElbow.pointIndex === 0) {
                    return { ...conn, midSegmentOffset: finalValue };
                } else {
                    return { ...conn, bypassOffset: finalValue };
                }
            }));

            // DO NOT update draggingElbow startX/Y here. 
            // We want deltaX/Y to be relative to the initial click for smooth unsnapping.
        };

        const handleMouseUp = () => {
            setDraggingElbow(null);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.body.style.cursor = draggingElbow.direction === 'horizontal' ? 'ew-resize' : 'ns-resize';
        document.body.style.userSelect = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [draggingElbow, setArrowConnections, setDraggingElbow, nodes]);

    // Handle node click for connection
    const handleNodeClick = useCallback((cellId: string, position: NodePosition) => {
        if (!connectionState.isConnecting) {
            // Start connection
            setConnectionState({
                isConnecting: true,
                sourceCell: cellId,
                sourcePosition: position,
            });
            setActiveNodes({ [cellId]: position });
        } else {
            // Complete connection
            if (connectionState.sourceCell && connectionState.sourcePosition) {
                // Don't connect to same node
                if (cellId === connectionState.sourceCell && position === connectionState.sourcePosition) {
                    return;
                }

                // Create new arrow connection
                const newConnection: ArrowConnection = {
                    id: `arrow-${connectionState.sourceCell}-${connectionState.sourcePosition}-${cellId}-${position}-${Date.now()}`,
                    source: {
                        cellId: connectionState.sourceCell,
                        position: connectionState.sourcePosition,
                    },
                    target: {
                        cellId,
                        position,
                    },
                };

                setArrowConnections(prev => [...prev, newConnection]);
            }

            // Reset connection state
            setConnectionState({
                isConnecting: false,
                sourceCell: null,
                sourcePosition: null,
            });
            setActiveNodes({});
        }
    }, [connectionState]);

    // Handle ReactFlow edge connection
    const onConnect = useCallback((connection: Connection) => {
        const edgeId = `edge-${connection.source}-${connection.target}-${Date.now()}`;
        const newEdge: Edge = {
            ...connection,
            id: edgeId,
            type: "smoothstep" as const,
            markerStart: { type: MarkerType.ArrowClosed, width: 10, height: 10 },
            style: { strokeWidth: 1, stroke: "#000000" },
        };
        setEdges((eds) => [...eds, newEdge]);

        // Update cellDataMap with new edge
        setCellDataMap((prevMap) => {
            const newMap = { ...prevMap };

            Object.entries(newMap).forEach(([cellId, cellData]) => {
                cellData.nodes.forEach((node) => {
                    if (node.id === connection.source) {
                        newMap[cellId] = {
                            ...cellData,
                            nodes: cellData.nodes.map((n) =>
                                n.id === connection.source
                                    ? {
                                        ...n,
                                        data: {
                                            ...n.data,
                                            edges: [...((n.data.edges || []) as Edge[]), newEdge],
                                        },
                                    }
                                    : n
                            ),
                        };
                    }
                });
            });

            return newMap;
        });
    }, [setCellDataMap]);

    // Delete selected arrow
    const deleteSelectedArrow = useCallback(() => {
        if (selectedArrow) {
            setArrowConnections(prev => prev.filter(conn => conn.id !== selectedArrow));
            setSelectedArrow(null);
        }
    }, [selectedArrow]);

    return {
        arrowConnections,
        setArrowConnections,
        connectionState,
        setConnectionState,
        activeNodes,
        setActiveNodes,
        selectedArrow,
        setSelectedArrow,
        draggingElbow,
        setDraggingElbow,
        nodes,
        setNodes,
        edges,
        setEdges,
        handleNodeClick,
        onConnect,
        deleteSelectedArrow,
    };
}
