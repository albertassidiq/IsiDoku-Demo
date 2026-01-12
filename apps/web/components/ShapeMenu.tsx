"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ShapeType = "rectangle" | "pill" | "diamond" | "pentagon" | null;

interface ShapeMenuProps {
  onShapeSelect: (shape: ShapeType) => void;
  onDelete?: () => void;
  hasShape?: boolean;
}

export function ShapeMenu({ onShapeSelect, onDelete, hasShape = false }: ShapeMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-6 h-6 flex items-center justify-center border-2 border-black rounded-sm bg-white text-black hover:bg-black hover:text-white transition-colors"
          aria-label="Shape options"
        >
          <Plus className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="w-48 p-2 border-2 border-black rounded-sm bg-white shadow-none"
      >
        <div className="grid grid-cols-2 gap-2">
          {/* Rectangle */}
          <button
            onClick={() => onShapeSelect("rectangle")}
            className="flex items-center justify-center p-3 border-2 border-black rounded-sm hover:bg-black hover:text-white transition-colors group"
          >
            <div className="w-12 h-6 border-2 border-current group-hover:border-white" />
          </button>

          {/* Pill (Full Radius Rectangle) */}
          <button
            onClick={() => onShapeSelect("pill")}
            className="flex items-center justify-center p-3 border-2 border-black rounded-sm hover:bg-black hover:text-white transition-colors group"
          >
            <div className="w-12 h-6 border-2 border-current rounded-full group-hover:border-white" />
          </button>

          {/* Diamond - beneran diamond dengan polygon */}
          <button
            onClick={() => onShapeSelect("diamond")}
            className="flex items-center justify-center p-3 border-2 border-black rounded-sm hover:bg-black hover:text-white transition-colors group"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="stroke-current group-hover:stroke-white fill-none">
              <polygon points="16,2 30,16 16,30 2,16" strokeWidth="2" />
            </svg>
          </button>

          {/* Off-Page Connector */}
          <button
            onClick={() => onShapeSelect("pentagon")}
            className="flex items-center justify-center p-3 border-2 border-black rounded-sm hover:bg-black hover:text-white transition-colors group"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="stroke-current group-hover:stroke-white fill-none">
              <polygon points="4,4 28,4 28,20 16,28 4,20" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
