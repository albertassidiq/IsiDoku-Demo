"use client";

import React from "react";
import { ShapeMenu, ShapeType } from "./ShapeMenu";

interface FlowCellProps {
  cellId: string;
  hasShape: boolean;
  onShapeSelect: (shape: ShapeType) => void;
  onDeleteShape: () => void;
  onAddShape: () => void;
}

/**
 * FlowCell - Component untuk cell di table
 * Ini hanya wrapper untuk UI interaction (shape menu, delete button)
 * Node dan edge dikelola secara global di parent component (ReactFlow)
 */
export function FlowCell({
  cellId,
  hasShape,
  onShapeSelect,
  onDeleteShape,
  onAddShape,
}: FlowCellProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "80px",
        position: "relative",
      }}
      className="group"
    >
      {/* Empty state indicator */}
      {!hasShape && (
        <div
          className="flex items-center justify-center text-gray-300 text-xs font-mono border border-dashed border-gray-300 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          +
        </div>
      )}

      {/* Delete button (X) - pojok kiri atas cell */}
      {hasShape && (
        <button
          onClick={onDeleteShape}
          className="absolute left-0 top-0 w-6 h-6 bg-white text-black border-2 border-black rounded-sm opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold z-20 hover:bg-black hover:text-white"
          title="Hapus shape"
        >
          ×
        </button>
      )}

      {/* ShapeMenu button - muncul saat hover di pojok kanan atas */}
      <div className="absolute top-0 right-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <ShapeMenu onShapeSelect={onShapeSelect} />
      </div>
    </div>
  );
}
