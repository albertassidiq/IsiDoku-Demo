"use client";

import React, { useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import type { ArrowConnection, NodePosition } from "@/components/ShapeNode";
import type { DraggingElbowState, ElbowPathResult } from "../types";

export interface ArrowsLayerProps {
    nodes: Node[];
    edges: Edge[];
    arrowConnections: ArrowConnection[];
    selectedArrow: string | null;
    setSelectedArrow: React.Dispatch<React.SetStateAction<string | null>>;
    setArrowConnections: React.Dispatch<React.SetStateAction<ArrowConnection[]>>;
    draggingElbow: DraggingElbowState | null;
    setDraggingElbow: React.Dispatch<React.SetStateAction<DraggingElbowState | null>>;
    getConnectorPosition: (cellId: string, position: NodePosition) => { x: number; y: number } | null;
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
}

/**
 * SVG layer for rendering arrows and edges
 */
export function ArrowsLayer({
    nodes,
    edges,
    arrowConnections,
    selectedArrow,
    setSelectedArrow,
    setArrowConnections,
    draggingElbow,
    setDraggingElbow,
    getConnectorPosition,
    generateElbowPath,
    readOnly = false,
}: ArrowsLayerProps & { readOnly?: boolean }) {

    const [isMounted, setIsMounted] = React.useState(false);
    const [layoutReady, setLayoutReady] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        // Force a re-calculation after a tick to allow DOM to settle
        const timer = setTimeout(() => {
            setLayoutReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Render elbow arrows
    const renderArrows = useCallback(() => {
        if (!isMounted) return null;

        return arrowConnections.map(conn => {
            const sourcePos = getConnectorPosition(conn.source.cellId, conn.source.position);
            const targetPos = getConnectorPosition(conn.target.cellId, conn.target.position);

            if (!sourcePos || !targetPos) return null;

            const { path, midPoint, bypassPoint, isHorizontalFirst, defaultMidOffset, defaultBypassOffset } = generateElbowPath(
                sourcePos,
                targetPos,
                conn.source.position,
                conn.target.position,
                conn.source.cellId,
                conn.target.cellId,
                conn.midSegmentOffset,
                conn.bypassOffset,
                conn.horizontalFirst
            );

            // Hide selection/interaction if readOnly
            const isSelected = !readOnly && (selectedArrow === conn.id || draggingElbow?.arrowId === conn.id);
            const dragCursor = isHorizontalFirst ? 'ew-resize' : 'ns-resize';

            return (
                <g key={conn.id} style={{ pointerEvents: readOnly ? 'none' : 'auto' }}>
                    {/* Invisible wider path for easier click - disabled in readOnly */}
                    {!readOnly && (
                        <path
                            d={path}
                            stroke="transparent"
                            strokeWidth="15"
                            fill="none"
                            data-arrow-path={conn.id}
                            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (selectedArrow === conn.id) {
                                    setSelectedArrow(null);
                                } else {
                                    setSelectedArrow(conn.id);
                                }
                            }}
                        />
                    )}
                    {/* Visible arrow path */}
                    <path
                        d={path}
                        stroke={isSelected ? "#0066ff" : "#000000"}
                        strokeWidth={isSelected ? "2" : "1"}
                        fill="none"
                        markerEnd="url(#arrowhead-end)"
                        style={{ pointerEvents: 'none' }}
                    />
                    {/* Draggable handle for mid segment */}
                    {isSelected && (
                        <circle
                            data-elbow-handle={conn.id}
                            cx={midPoint.x}
                            cy={midPoint.y}
                            r="6"
                            fill="white"
                            stroke="#0066ff"
                            strokeWidth="2"
                            style={{ cursor: dragCursor, pointerEvents: 'auto' }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
                                if (!parentElement) return;

                                const parentRect = parentElement.getBoundingClientRect();
                                const startX = e.clientX - parentRect.left;
                                const startY = e.clientY - parentRect.top;

                                if (conn.midSegmentOffset === undefined || conn.bypassOffset === undefined) {
                                    setArrowConnections(prev => prev.map(c => {
                                        if (c.id !== conn.id) return c;
                                        return {
                                            ...c,
                                            midSegmentOffset: c.midSegmentOffset ?? defaultMidOffset,
                                            bypassOffset: c.bypassOffset ?? defaultBypassOffset,
                                            horizontalFirst: isHorizontalFirst,
                                        };
                                    }));
                                }

                                setDraggingElbow({
                                    arrowId: conn.id,
                                    pointIndex: 0,
                                    startX,
                                    startY,
                                    originalPoint: { ...midPoint },
                                    direction: isHorizontalFirst ? 'horizontal' : 'vertical',
                                });
                            }}
                        />
                    )}
                    {/* Bypass handle */}
                    {isSelected && bypassPoint && (
                        <circle
                            data-elbow-handle={`bypass-${conn.id}`}
                            cx={bypassPoint.x}
                            cy={bypassPoint.y}
                            r="6"
                            fill="white"
                            stroke="#0066ff"
                            strokeWidth="2"
                            style={{ cursor: isHorizontalFirst ? 'ns-resize' : 'ew-resize', pointerEvents: 'auto' }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const parentElement = document.querySelector('.sop-page-container') as HTMLElement;
                                if (!parentElement) return;

                                const parentRect = parentElement.getBoundingClientRect();
                                const startX = e.clientX - parentRect.left;
                                const startY = e.clientY - parentRect.top;

                                if (conn.midSegmentOffset === undefined || conn.bypassOffset === undefined) {
                                    setArrowConnections(prev => prev.map(c => {
                                        if (c.id !== conn.id) return c;
                                        return {
                                            ...c,
                                            midSegmentOffset: c.midSegmentOffset ?? defaultMidOffset,
                                            bypassOffset: c.bypassOffset ?? defaultBypassOffset,
                                            horizontalFirst: isHorizontalFirst,
                                        };
                                    }));
                                }

                                setDraggingElbow({
                                    arrowId: conn.id,
                                    pointIndex: 1,
                                    startX,
                                    startY,
                                    originalPoint: { ...bypassPoint },
                                    direction: isHorizontalFirst ? 'vertical' : 'horizontal',
                                });
                            }}
                        />
                    )}
                    {/* Delete button */}
                    {isSelected && (
                        <g
                            data-elbow-handle={`delete-${conn.id}`}
                            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setArrowConnections(prev => prev.filter(c => c.id !== conn.id));
                                setSelectedArrow(null);
                            }}
                        >
                            <circle
                                cx={midPoint.x + 20}
                                cy={midPoint.y - 20}
                                r="10"
                                fill="#ff4444"
                                stroke="white"
                                strokeWidth="2"
                            />
                            <text
                                x={midPoint.x + 20}
                                y={midPoint.y - 16}
                                fill="white"
                                fontSize="14"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{ pointerEvents: 'none' }}
                            >
                                ×
                            </text>
                        </g>
                    )}
                </g>
            );
        });
    }, [arrowConnections, getConnectorPosition, generateElbowPath, selectedArrow, draggingElbow, setArrowConnections, setSelectedArrow, setDraggingElbow, isMounted, layoutReady]);

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 15,
                pointerEvents: "none",
            }}
        >
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}
            >
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="0"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
                    </marker>
                    <marker
                        id="arrowhead-end"
                        markerWidth="10"
                        markerHeight="10"
                        refX="10"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
                    </marker>
                </defs>
                {/* Render ReactFlow edges */}
                {edges.map((edge) => {
                    const sourceNode = nodes.find((n) => n.id === edge.source);
                    const targetNode = nodes.find((n) => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    return (
                        <path
                            key={edge.id}
                            d={`M ${sourceNode.position.x} ${sourceNode.position.y} L ${targetNode.position.x} ${targetNode.position.y}`}
                            stroke="#000000"
                            strokeWidth="1"
                            fill="none"
                            markerStart="url(#arrowhead)"
                            style={{ pointerEvents: "none" }}
                        />
                    );
                })}
                {/* Render elbow arrows */}
                {renderArrows()}
            </svg>
        </div>
    );
}
