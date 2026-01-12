"use client";

import React from "react";
import { ShapeNode, NodePosition } from "@/components/ShapeNode";
import { ShapeMenu, ShapeType } from "@/components/ShapeMenu";
import type { CellData } from "../../types";

export interface ShapeCellProps {
    cellId: string;
    rowIndex: number;
    colIndex: number;
    cellData: CellData | undefined;
    activeNode: NodePosition | null;
    isConnecting: boolean;
    onShapeSelect: (cellId: string, rowIndex: number, colIndex: number, shape: ShapeType) => void;
    onNodeClick: (cellId: string, position: NodePosition) => void;
    onLabelChange: (cellId: string, newLabel: string) => void;
}

/**
 * Cell in Pelaksana columns that can contain shapes
 */
export function ShapeCell({
    cellId,
    rowIndex,
    colIndex,
    cellData,
    activeNode,
    isConnecting,
    onShapeSelect,
    onNodeClick,
    onLabelChange,
    readOnly = false,
}: ShapeCellProps & { readOnly?: boolean }) {
    const hasShape = cellData?.nodes && cellData.nodes.length > 0;

    return (
        <td
            data-cell-id={cellId}
            className="border border-gray-400 p-0 relative group"
            style={{
                width: "100px",
                maxWidth: "100px",
                minWidth: "100px",
                height: "80px",
                padding: 0,
                position: "relative",
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            {/* Shape Node */}
            {hasShape && cellData && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "auto",
                    }}
                >
                    <ShapeNode
                        data={{
                            label: cellData.nodes[0]?.data?.label as string || '',
                            shapeType: cellData.nodes[0]?.data?.shapeType as string || 'rectangle',
                            cellId,
                        }}
                        selected={false}
                        activeNode={activeNode}
                        onNodeClick={readOnly ? () => { } : onNodeClick}
                        isConnecting={isConnecting}
                        onLabelChange={readOnly ? () => { } : onLabelChange}
                    />
                </div>
            )}

            {/* Delete shape button */}
            {hasShape && !readOnly && (
                <button
                    onClick={() => onShapeSelect(cellId, rowIndex, colIndex, null)}
                    className="absolute left-0 top-0 w-6 h-6 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold z-20 hover:bg-black hover:text-white"
                    title="Hapus shape"
                >
                    ×
                </button>
            )}

            {/* Shape menu */}
            {!readOnly && (
                <div className="absolute top-0 right-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShapeMenu
                        onShapeSelect={(shape) => onShapeSelect(cellId, rowIndex, colIndex, shape)}
                    />
                </div>
            )}
        </td>
    );
}
