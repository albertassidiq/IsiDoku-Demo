"use client";

import { useCallback } from "react";
import { Node } from "@xyflow/react";
import type {
    PelaksanaColumn,
    TableRow,
    CellData
} from "../types";
import type { ShapeType } from "@/components/ShapeMenu";
import type { ArrowConnection } from "@/components/ShapeNode";

export interface UseTableModifiersProps {
    pelaksanaColumns: PelaksanaColumn[];
    setPelaksanaColumns: React.Dispatch<React.SetStateAction<PelaksanaColumn[]>>;
    rows: TableRow[];
    setRows: React.Dispatch<React.SetStateAction<TableRow[]>>;
    cellDataMap: Record<string, CellData>;
    setCellDataMap: React.Dispatch<React.SetStateAction<Record<string, CellData>>>;
    setArrowConnections: React.Dispatch<React.SetStateAction<ArrowConnection[]>>;
}

export interface UseTableModifiersReturn {
    addColumn: (position: "start" | "end" | number) => void;
    removeColumn: (id: string) => void;
    updateColumnName: (id: string, newName: string) => void;
    addRow: (position: "start" | "end" | number) => void;
    removeRow: (id: string) => void;
    handleShapeSelect: (cellId: string, rowIndex: number, colIndex: number, shape: ShapeType) => void;
    handleLabelChange: (cellId: string, newLabel: string) => void;
    handleDeleteShape: (cellId: string) => void;
}

/**
 * Hook for table modification operations (add/remove columns/rows, shape management)
 */
export function useTableModifiers({
    pelaksanaColumns,
    setPelaksanaColumns,
    rows,
    setRows,
    cellDataMap,
    setCellDataMap,
    setArrowConnections,
}: UseTableModifiersProps): UseTableModifiersReturn {

    // Add a new column
    const addColumn = useCallback((position: "start" | "end" | number) => {
        const newColumn: PelaksanaColumn = {
            id: Date.now().toString(),
            name: "-",
        };

        if (position === "start") {
            setPelaksanaColumns(prev => [newColumn, ...prev]);
        } else if (position === "end") {
            setPelaksanaColumns(prev => [...prev, newColumn]);
        } else {
            setPelaksanaColumns(prev => {
                const newColumns = [...prev];
                newColumns.splice(position + 1, 0, newColumn);
                return newColumns;
            });
        }
    }, [setPelaksanaColumns]);

    // Remove a column
    const removeColumn = useCallback((id: string) => {
        if (pelaksanaColumns.length > 1) {
            setPelaksanaColumns(prev => prev.filter((col) => col.id !== id));
            setCellDataMap((prev) => {
                const newMap = { ...prev };
                Object.keys(newMap).forEach(cellId => {
                    if (cellId.includes(`-${id}`)) {
                        delete newMap[cellId];
                    }
                });
                return newMap;
            });
        }
    }, [pelaksanaColumns.length, setPelaksanaColumns, setCellDataMap]);

    // Update column name
    const updateColumnName = useCallback((id: string, newName: string) => {
        setPelaksanaColumns(prev =>
            prev.map((col) =>
                col.id === id ? { ...col, name: newName } : col
            )
        );
    }, [setPelaksanaColumns]);

    // Add a new row
    const addRow = useCallback((position: "start" | "end" | number) => {
        if (position === "start") {
            const newRow: TableRow = {
                id: Date.now().toString(),
                no: 1,
            };
            setRows(prev => [newRow, ...prev.map((r) => ({ ...r, no: r.no + 1 }))]);
        } else if (position === "end") {
            setRows(prev => {
                const newRow: TableRow = {
                    id: Date.now().toString(),
                    no: prev.length + 1,
                };
                return [...prev, newRow];
            });
        } else {
            setRows(prev => {
                const newRow: TableRow = {
                    id: Date.now().toString(),
                    no: position + 2,
                };
                const newRows = [...prev];
                newRows.splice(position + 1, 0, newRow);
                return newRows.map((r, index) => ({ ...r, no: index + 1 }));
            });
        }
    }, [setRows]);

    // Remove a row
    const removeRow = useCallback((id: string) => {
        if (rows.length > 1) {
            setRows(prev => {
                const filteredRows = prev.filter((r) => r.id !== id);
                return filteredRows.map((r, index) => ({ ...r, no: index + 1 }));
            });
            setCellDataMap((prev) => {
                const newMap = { ...prev };
                Object.keys(newMap).forEach(cellId => {
                    if (cellId.startsWith(`${id}-`)) {
                        delete newMap[cellId];
                    }
                });
                return newMap;
            });
        }
    }, [rows.length, setRows, setCellDataMap]);

    // Handle shape selection in a cell
    const handleShapeSelect = useCallback((
        cellId: string,
        rowIndex: number,
        colIndex: number,
        shape: ShapeType
    ) => {
        if (shape === null) {
            setCellDataMap((prev) => {
                const newMap = { ...prev };
                delete newMap[cellId];
                return newMap;
            });
            // Also remove any arrows connected to this shape
            setArrowConnections(prev => prev.filter(
                conn => conn.source.cellId !== cellId && conn.target.cellId !== cellId
            ));
            return;
        }

        const newNode: Node = {
            id: `node-${cellId}`,
            type: "shapeNode",
            position: { x: 0, y: 0 },
            data: {
                label: shape === "pentagon" ? "" : shape.charAt(0).toUpperCase() + shape.slice(1),
                shapeType: shape,
                cellId,
                edges: [],
            },
        };

        setCellDataMap((prev) => ({
            ...prev,
            [cellId]: {
                cellId,
                nodes: [newNode],
            },
        }));
    }, [setCellDataMap, setArrowConnections]);

    // Handle shape label change
    const handleLabelChange = useCallback((cellId: string, newLabel: string) => {
        setCellDataMap((prev) => {
            const cellData = prev[cellId];
            if (!cellData || !cellData.nodes || cellData.nodes.length === 0) return prev;

            return {
                ...prev,
                [cellId]: {
                    ...cellData,
                    nodes: cellData.nodes.map((node) => ({
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    })),
                },
            };
        });
    }, [setCellDataMap]);

    // Handle shape deletion
    const handleDeleteShape = useCallback((cellId: string) => {
        setCellDataMap((prev) => {
            const newMap = { ...prev };
            delete newMap[cellId];
            return newMap;
        });
        // Also remove any arrows connected to this shape
        setArrowConnections(prev => prev.filter(
            conn => conn.source.cellId !== cellId && conn.target.cellId !== cellId
        ));
    }, [setCellDataMap, setArrowConnections]);

    return {
        addColumn,
        removeColumn,
        updateColumnName,
        addRow,
        removeRow,
        handleShapeSelect,
        handleLabelChange,
        handleDeleteShape,
    };
}
