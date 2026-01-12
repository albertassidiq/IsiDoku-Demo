"use client";

import React from "react";

const NODE_WIDTH = 50;
const NODE_HEIGHT = 50;

export type NodePosition = "top" | "right" | "bottom" | "left";

interface ShapeNodeData {
  label: string;
  shapeType: string;
  cellId: string;
}

interface ConnectionNode {
  cellId: string;
  position: NodePosition;
}

interface ShapeNodeProps {
  data: ShapeNodeData;
  selected?: boolean;
  activeNode?: NodePosition | null;
  onNodeClick?: (cellId: string, position: NodePosition) => void;
  isConnecting?: boolean;
  onLabelChange?: (cellId: string, newLabel: string) => void;
}

export function ShapeNode({
  data,
  selected,
  activeNode,
  onNodeClick,
  isConnecting,
  onLabelChange
}: ShapeNodeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleNodeClick = (e: React.MouseEvent, position: NodePosition) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick(data.cellId, position);
    }
  };

  const getNodeContent = () => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative" as const,
    };

    switch (data.shapeType) {
      case "rectangle":
        return (
          <div
            style={{
              ...baseStyle,
              width: `${NODE_WIDTH}px`,
              height: `${NODE_HEIGHT * 0.6}px`,
              border: "1px solid black",
              background: "white",
              borderRadius: "2px",
            }}
          />
        );

      case "pill":
        return (
          <div
            style={{
              ...baseStyle,
              width: `${NODE_WIDTH}px`,
              height: `${NODE_HEIGHT * 0.6}px`,
              border: "1px solid black",
              background: "white",
              borderRadius: "9999px",
            }}
          />
        );

      case "diamond":
        const diamondSize = NODE_HEIGHT * 0.6;
        return (
          <div
            style={{
              ...baseStyle,
              width: `${diamondSize}px`,
              height: `${diamondSize}px`,
            }}
          >
            <svg
              width={diamondSize}
              height={diamondSize}
              viewBox={`0 0 ${diamondSize} ${diamondSize}`}
              style={{ display: "block" }}
            >
              <polygon
                points={`${diamondSize / 2},0 ${diamondSize},${diamondSize / 2} ${diamondSize / 2},${diamondSize} 0,${diamondSize / 2}`}
                fill="white"
                stroke="black"
                strokeWidth="1"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
        );

      case "pentagon":
        // Off-page connector: flat top (rectangle) with pointed bottom (triangle)
        // Using full height for more proportional 1:1 aspect ratio
        const offPageHeight = NODE_HEIGHT * 0.9; // Taller shape, almost 1:1
        const triangleStartY = offPageHeight * 0.65; // 65% untuk bagian rectangle, 35% untuk triangle
        return (
          <div
            style={{
              ...baseStyle,
              width: `${NODE_WIDTH}px`,
              height: `${offPageHeight}px`,
            }}
          >
            <svg
              width={NODE_WIDTH}
              height={offPageHeight}
              viewBox={`0 0 ${NODE_WIDTH} ${offPageHeight}`}
              style={{ display: "block" }}
            >
              <polygon
                points={`0,0 ${NODE_WIDTH},0 ${NODE_WIDTH},${triangleStartY} ${NODE_WIDTH / 2},${offPageHeight} 0,${triangleStartY}`}
                fill="white"
                stroke="black"
                strokeWidth="1"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
        );

      case "document":
        // Document shape: rectangle with folded bottom-right corner
        const docWidth = NODE_WIDTH;
        const docHeight = NODE_HEIGHT * 0.7;
        const foldSize = 8;
        return (
          <div
            style={{
              ...baseStyle,
              width: `${docWidth}px`,
              height: `${docHeight}px`,
            }}
          >
            <svg
              width={docWidth}
              height={docHeight}
              viewBox={`0 0 ${docWidth} ${docHeight}`}
              style={{ display: "block" }}
            >
              <path
                d={`M 0,0 L ${docWidth - foldSize},0 L ${docWidth},${foldSize} L ${docWidth},${docHeight} L 0,${docHeight} Z`}
                fill="white"
                stroke="black"
                strokeWidth="1"
              />
              <line
                x1={docWidth - foldSize}
                y1={0}
                x2={docWidth - foldSize}
                y2={foldSize}
                stroke="black"
                strokeWidth="1"
              />
              <line
                x1={docWidth - foldSize}
                y1={foldSize}
                x2={docWidth}
                y2={foldSize}
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case "hexagon":
        // Hexagon shape for preparation
        const hexHeight = NODE_HEIGHT * 0.65;
        const hexWidth = NODE_WIDTH;
        const flatHeight = hexHeight * 0.25;
        return (
          <div
            style={{
              ...baseStyle,
              width: `${hexWidth}px`,
              height: `${hexHeight}px`,
            }}
          >
            <svg
              width={hexWidth}
              height={hexHeight}
              viewBox={`0 0 ${hexWidth} ${hexHeight}`}
              style={{ display: "block" }}
            >
              <polygon
                points={`0,${flatHeight} 0,${hexHeight - flatHeight} ${hexWidth / 2},${hexHeight} ${hexWidth},${hexHeight - flatHeight} ${hexWidth},${flatHeight} ${hexWidth / 2},0`}
                fill="white"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      case "trapezoid":
        // Manual input shape: trapezoid with sloping left side
        const trapWidth = NODE_WIDTH;
        const trapHeight = NODE_HEIGHT * 0.65;
        const slopeOffset = 8;
        return (
          <div
            style={{
              ...baseStyle,
              width: `${trapWidth}px`,
              height: `${trapHeight}px`,
            }}
          >
            <svg
              width={trapWidth}
              height={trapHeight}
              viewBox={`0 0 ${trapWidth} ${trapHeight}`}
              style={{ display: "block" }}
            >
              <polygon
                points={`${slopeOffset},0 ${trapWidth},0 ${trapWidth},${trapHeight} 0,${trapHeight}`}
                fill="white"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  // Different shapes have different heights
  const getNodeHeight = () => {
    switch (data.shapeType) {
      case "pentagon":
        return NODE_HEIGHT * 0.9;
      case "document":
      case "hexagon":
      case "trapezoid":
        return NODE_HEIGHT * 0.65;
      case "diamond":
        return NODE_HEIGHT * 0.6;
      default:
        return NODE_HEIGHT * 0.6;
    }
  };

  const nodeHeight = getNodeHeight();
  const nodeWidth = data.shapeType === "diamond" ? NODE_HEIGHT * 0.6 : NODE_WIDTH;

  // Nodes visible saat hover atau saat sedang connecting mode
  const showNodes = isHovered || isConnecting;

  // Style untuk connection nodes (titik-titik di tepi shape)
  const getConnectorStyle = (position: NodePosition): React.CSSProperties => {
    const isActive = activeNode === position;
    const baseConnectorStyle: React.CSSProperties = {
      position: "absolute",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: isActive ? "white" : "black",
      border: `2px solid ${isActive ? "black" : "black"}`,
      cursor: "pointer",
      zIndex: 30,
      transition: "all 0.15s ease",
      boxShadow: isActive ? "0 0 0 2px black" : "none",
      opacity: showNodes ? 1 : 0,
      pointerEvents: showNodes ? "auto" : "none",
    };

    // Position connectors on shape edges
    switch (position) {
      case "top":
        return {
          ...baseConnectorStyle,
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "right":
        return {
          ...baseConnectorStyle,
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "bottom":
        return {
          ...baseConnectorStyle,
          bottom: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          ...baseConnectorStyle,
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
        };
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection nodes - 4 titik di setiap sisi shape */}
      <div
        data-connector={`${data.cellId}-top`}
        style={getConnectorStyle("top")}
        onClick={(e) => handleNodeClick(e, "top")}
        onMouseEnter={(e) => {
          if (isConnecting) {
            (e.target as HTMLElement).style.transform = "translateX(-50%) scale(1.3)";
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "translateX(-50%)";
        }}
      />
      <div
        data-connector={`${data.cellId}-right`}
        style={getConnectorStyle("right")}
        onClick={(e) => handleNodeClick(e, "right")}
        onMouseEnter={(e) => {
          if (isConnecting) {
            (e.target as HTMLElement).style.transform = "translateY(-50%) scale(1.3)";
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "translateY(-50%)";
        }}
      />
      <div
        data-connector={`${data.cellId}-bottom`}
        style={getConnectorStyle("bottom")}
        onClick={(e) => handleNodeClick(e, "bottom")}
        onMouseEnter={(e) => {
          if (isConnecting) {
            (e.target as HTMLElement).style.transform = "translateX(-50%) scale(1.3)";
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "translateX(-50%)";
        }}
      />
      <div
        data-connector={`${data.cellId}-left`}
        style={getConnectorStyle("left")}
        onClick={(e) => handleNodeClick(e, "left")}
        onMouseEnter={(e) => {
          if (isConnecting) {
            (e.target as HTMLElement).style.transform = "translateY(-50%) scale(1.3)";
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "translateY(-50%)";
        }}
      />

      {/* Shape content */}
      <div style={{ pointerEvents: "none", position: "relative", width: "100%", height: "100%" }}>
        {getNodeContent()}

        {/* Text label - only for pentagon (off-page connector) */}
        {data.shapeType === "pentagon" && data.label && (
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              outline: "none",
              textAlign: "center",
              fontSize: "8px",
              fontFamily: "Arial, sans-serif",
              maxWidth: "90%",
              maxHeight: "80%",
              overflow: "hidden",
              wordWrap: "break-word",
              cursor: "text",
              padding: "2px",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onBlur={(e) => {
              if (onLabelChange) {
                onLabelChange(data.cellId, e.currentTarget.textContent || "");
              }
            }}
          >
            {data.label}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper types untuk arrow/edge
export interface ArrowConnection {
  id: string;
  source: {
    cellId: string;
    position: NodePosition;
  };
  target: {
    cellId: string;
    position: NodePosition;
  };
  // For the middle vertical/horizontal segment position
  // For horizontal-first paths: this is the X position of the vertical segment
  // For vertical-first paths: this is the Y position of the horizontal segment
  midSegmentOffset?: number;
  // For the bypass segment position (when path needs to go around obstacles)
  // For horizontal-first paths: this is the Y position of the horizontal bypass segment
  // For vertical-first paths: this is the X position of the vertical bypass segment
  bypassOffset?: number;
  // Whether the path goes horizontal first (true) or vertical first (false)
  horizontalFirst?: boolean;
}
