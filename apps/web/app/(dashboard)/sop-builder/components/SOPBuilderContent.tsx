"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { Node } from "@xyflow/react";
import { AIChatSidebar } from "@/components/AIChatSidebar";

import { toast } from "sonner"; // Import toast
import type { CellData } from "../types";
import {
    useSOPState,
    useTableModifiers,
    useArrowConnections,
    useElbowPath,
    useColumnResize,
    usePDFExport,
    useHistoryState,
    useNodePositions,
    type SOPSnapshot,
} from "../hooks";
import { SOPToolbar } from "./SOPToolbar";
import { ArrowsLayer } from "./ArrowsLayer";
import { SOPTableHeader, SOPTableBody } from "./SOPTable";
import { createSOP, updateSOP } from "@/actions/sop";

/**
 * Main SOP Builder content component - orchestrates all hooks and components
 */

export interface SOPBuilderContentProps {
    initialData?: SOPSnapshot;
    readOnly?: boolean;
    initialTitle?: string;
    initialDescription?: string;
    sopId?: string;
}

export function SOPBuilderContent({
    initialData,
    readOnly = false,
    initialTitle = "Untitled SOP",
    initialDescription = "",
    sopId,
    initialPdfUrl
}: SOPBuilderContentProps & { initialPdfUrl?: string }) {
    // Core state
    const {
        pelaksanaColumns,
        setPelaksanaColumns,
        rows,
        setRows,
        cellDataMap,
        setCellDataMap,
        columnWidths,
        setColumnWidths,
        resizingColumn,
        setResizingColumn,
        uploadedPdf,
        setUploadedPdf,
        isChatOpen,
        setIsChatOpen,
        documentRef,
        fileInputRef,
    } = useSOPState(initialData);

    // Track the initial file object to avoid re-uploading if unchanged
    const [originalPdfFile, setOriginalPdfFile] = React.useState<File | null>(null);
    const [hasInitialPdfLoaded, setHasInitialPdfLoaded] = React.useState(false);

    // Initial PDF Load
    useEffect(() => {
        if (initialPdfUrl && !hasInitialPdfLoaded) {
            const fetchPdf = async () => {
                try {
                    const response = await fetch(initialPdfUrl);
                    if (!response.ok) throw new Error('Failed to fetch PDF');
                    const blob = await response.blob();
                    const filename = initialPdfUrl.split('/').pop() || 'document.pdf';
                    const file = new File([blob], filename, { type: 'application/pdf' });
                    setUploadedPdf(file);
                    setOriginalPdfFile(file);
                } catch (error) {
                    console.error("Error loading initial PDF:", error);
                    toast.error("Gagal memuat PDF yang tersimpan.");
                } finally {
                    setHasInitialPdfLoaded(true);
                }
            };
            fetchPdf();
        } else if (!initialPdfUrl) {
            setHasInitialPdfLoaded(true);
        }
    }, [initialPdfUrl, hasInitialPdfLoaded, setUploadedPdf]);

    // Arrow connections
    const {
        arrowConnections,
        setArrowConnections,
        connectionState,
        activeNodes,
        selectedArrow,
        setSelectedArrow,
        draggingElbow,
        setDraggingElbow,
        nodes,
        setNodes,
        edges,
        setEdges,
        handleNodeClick,
    } = useArrowConnections({
        cellDataMap,
        setCellDataMap,
        initialArrows: initialData?.arrowConnections
    });

    // History state for undo/redo
    const {
        pushState,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useHistoryState();

    // Helper to get current snapshot
    const getCurrentSnapshot = useCallback((): SOPSnapshot => ({
        pelaksanaColumns,
        rows,
        cellDataMap,
        arrowConnections,
    }), [pelaksanaColumns, rows, cellDataMap, arrowConnections]);

    // Helper to restore snapshot
    const restoreSnapshot = useCallback((snapshot: SOPSnapshot) => {
        setPelaksanaColumns(snapshot.pelaksanaColumns);
        setRows(snapshot.rows);
        setCellDataMap(snapshot.cellDataMap);
        setArrowConnections(snapshot.arrowConnections);
    }, [setPelaksanaColumns, setRows, setCellDataMap, setArrowConnections]);

    // Undo handler
    const handleUndo = useCallback(() => {
        const previousSnapshot = undo(getCurrentSnapshot());
        if (previousSnapshot) {
            restoreSnapshot(previousSnapshot);
        }
    }, [undo, getCurrentSnapshot, restoreSnapshot]);

    // Redo handler
    const handleRedo = useCallback(() => {
        const nextSnapshot = redo(getCurrentSnapshot());
        if (nextSnapshot) {
            restoreSnapshot(nextSnapshot);
        }
    }, [redo, getCurrentSnapshot, restoreSnapshot]);

    // Wrap modifier functions to save state before action
    const saveStateBeforeAction = useCallback(() => {
        pushState(getCurrentSnapshot());
    }, [pushState, getCurrentSnapshot]);

    // Table modifiers with history
    const tableModifiers = useTableModifiers({
        pelaksanaColumns,
        setPelaksanaColumns,
        rows,
        setRows,
        cellDataMap,
        setCellDataMap,
        setArrowConnections,
    });

    // Wrapped table modifiers that save state before action
    const addColumn = useCallback((position: "start" | "end" | number) => {
        saveStateBeforeAction();
        tableModifiers.addColumn(position);
    }, [saveStateBeforeAction, tableModifiers]);

    const removeColumn = useCallback((id: string) => {
        saveStateBeforeAction();
        tableModifiers.removeColumn(id);
    }, [saveStateBeforeAction, tableModifiers]);

    const updateColumnName = useCallback((id: string, newName: string) => {
        saveStateBeforeAction();
        tableModifiers.updateColumnName(id, newName);
    }, [saveStateBeforeAction, tableModifiers]);

    const addRow = useCallback((position: "start" | "end" | number) => {
        saveStateBeforeAction();
        tableModifiers.addRow(position);
    }, [saveStateBeforeAction, tableModifiers]);

    const removeRow = useCallback((id: string) => {
        saveStateBeforeAction();
        tableModifiers.removeRow(id);
    }, [saveStateBeforeAction, tableModifiers]);

    const handleShapeSelect = useCallback((cellId: string, rowIndex: number, colIndex: number, shape: any) => {
        saveStateBeforeAction();
        tableModifiers.handleShapeSelect(cellId, rowIndex, colIndex, shape);
    }, [saveStateBeforeAction, tableModifiers]);

    const handleLabelChange = useCallback((cellId: string, newLabel: string) => {
        saveStateBeforeAction();
        tableModifiers.handleLabelChange(cellId, newLabel);
    }, [saveStateBeforeAction, tableModifiers]);

    // Wrapped node click handler that saves state when completing a connection
    const handleNodeClickWithHistory = useCallback((cellId: string, position: any) => {
        // Save state if we're about to complete a connection
        if (connectionState.isConnecting && connectionState.sourceCell) {
            saveStateBeforeAction();
        }
        handleNodeClick(cellId, position);
    }, [connectionState, saveStateBeforeAction, handleNodeClick]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Z for Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
            // Ctrl+Shift+Z or Ctrl+Y for Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || e.key === 'y') && (e.shiftKey || e.key === 'y')) {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    // Elbow path generation
    const { generateElbowPath, getConnectorPos } = useElbowPath({ cellDataMap });

    // Column resize
    useColumnResize({ resizingColumn, setResizingColumn, setColumnWidths });

    // PDF export
    const { handleFileUpload, clearUploadedPdf, exportToPDF } = usePDFExport({
        documentRef,
        fileInputRef,
        uploadedPdf,
        setUploadedPdf,
    });

    // Node Positions Logic
    useNodePositions({
        cellDataMap,
        pelaksanaColumns,
        rows,
        columnWidths,
        setNodes
    });

    // Collect all edges
    const allEdges = useMemo(() => {
        const edgeList: any[] = [];
        Object.values(cellDataMap).forEach(cell => {
            cell.nodes.forEach(node => {
                const nodeEdges = (node.data.edges || []) as any[];
                edgeList.push(...nodeEdges);
            });
        });
        return edgeList;
    }, [cellDataMap]);

    // Sync edges
    useEffect(() => {
        setEdges(allEdges);
    }, [allEdges, setEdges]);

    // Click outside to deselect arrow
    useEffect(() => {
        if (!selectedArrow) return;

        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isArrowElement = target.closest('[data-arrow-path]') || target.closest('[data-elbow-handle]');
            if (!isArrowElement) {
                setSelectedArrow(null);
            }
        };

        const timeoutId = setTimeout(() => {
            window.addEventListener('click', handleGlobalClick);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('click', handleGlobalClick);
        };
    }, [selectedArrow, setSelectedArrow]);

    // Handle AI-generated SOP data
    const handleSopGenerated = useCallback((data: any) => {
        // Save state before AI generates
        saveStateBeforeAction();

        // 1. Update Columns
        if (data.pelaksanaColumns && Array.isArray(data.pelaksanaColumns)) {
            setPelaksanaColumns(data.pelaksanaColumns);
        }

        // 2. Update Rows
        if (data.rows && Array.isArray(data.rows)) {
            setRows(data.rows);
        }

        // 3. Update Shapes (Cell Data)
        if (data.shapes && Array.isArray(data.shapes)) {
            const newCellDataMap: Record<string, CellData> = {};

            data.shapes.forEach((shape: any) => {
                const cellId = `${shape.rowId}-${shape.colId}`;

                let appShapeType = 'rectangle';
                switch (shape.type) {
                    case 'start':
                    case 'end':
                    case 'terminator':
                        appShapeType = 'pill'; // Capsule
                        break;
                    case 'process':
                    case 'document':        // Map document to rectangle
                    case 'manual-input':    // Map manual-input to rectangle
                    case 'preparation':     // Map preparation to rectangle
                        appShapeType = 'rectangle';
                        break;
                    case 'decision':
                        appShapeType = 'diamond';
                        break;
                    case 'off-page':
                        appShapeType = 'pentagon'; // Off-page connector
                        break;
                    default:
                        appShapeType = 'rectangle';
                }

                const newNode: Node = {
                    id: `node-${cellId}`,
                    type: "shapeNode",
                    position: { x: 0, y: 0 },
                    data: {
                        label: shape.label,
                        shapeType: appShapeType,
                        cellId,
                        edges: [],
                    },
                };

                newCellDataMap[cellId] = {
                    cellId,
                    nodes: [newNode],
                };
            });

            setCellDataMap(newCellDataMap);
        }

        // 4. Update Arrows
        // Handle both old format (fromRowId/fromColId/fromPos) and new format (source/target)
        if (data.connections && Array.isArray(data.connections)) {
            // Helper function to determine smart arrow position
            const determineSmartPosition = (fromColId: string, toColId: string, isSource: boolean): 'top' | 'right' | 'bottom' | 'left' => {
                // Extract column number from colId (e.g., "c1" -> 1, "c2" -> 2)
                const fromColNum = parseInt(fromColId.replace(/\D/g, ''), 10);
                const toColNum = parseInt(toColId.replace(/\D/g, ''), 10);

                if (isSource) {
                    // SOURCE position logic
                    if (toColNum < fromColNum) {
                        // Target is on the LEFT → start from LEFT node
                        return 'left';
                    } else if (toColNum > fromColNum) {
                        // Target is on the RIGHT → start from RIGHT node
                        return 'right';
                    } else {
                        // Same column → start from BOTTOM node
                        return 'bottom';
                    }
                } else {
                    // TARGET position logic
                    if (fromColNum < toColNum) {
                        // Coming from LEFT → enter from LEFT node
                        return 'left';
                    } else if (fromColNum > toColNum) {
                        // Coming from RIGHT → enter from RIGHT node
                        return 'right';
                    } else {
                        // Same column → enter from TOP node
                        return 'top';
                    }
                }
            };

            const newArrows = data.connections.map((conn: any, index: number) => {
                // Check if using new schema format (source/target) or old format (fromRowId/toRowId)
                const hasSourceTarget = conn.source && conn.target;

                const fromColId = hasSourceTarget ? conn.source.colId : conn.fromColId;
                const toColId = hasSourceTarget ? conn.target.colId : conn.toColId;

                // Use provided positions if available, otherwise use smart position logic
                const sourcePos = hasSourceTarget ? conn.source.position : conn.fromPos;
                const targetPos = hasSourceTarget ? conn.target.position : conn.toPos;

                const arrow = {
                    id: `arrow-generated-${index}-${Date.now()}`,
                    source: {
                        cellId: hasSourceTarget
                            ? `${conn.source.rowId}-${conn.source.colId}`
                            : `${conn.fromRowId}-${conn.fromColId}`,
                        position: sourcePos || determineSmartPosition(fromColId, toColId, true),
                    },
                    target: {
                        cellId: hasSourceTarget
                            ? `${conn.target.rowId}-${conn.target.colId}`
                            : `${conn.toRowId}-${conn.toColId}`,
                        position: targetPos || determineSmartPosition(fromColId, toColId, false),
                    }
                };
                return arrow;
            });

            // Delay setting arrows to ensure DOM nodes are rendered first
            setTimeout(() => {
                setArrowConnections(newArrows);
            }, 100);
        }
    }, [saveStateBeforeAction, setPelaksanaColumns, setRows, setCellDataMap, setArrowConnections]);

    // Handle Save Project

    const handleSaveProject = useCallback(async (title: string, description?: string) => {
        toast.info("DEMO MODE: Fitur Simpan dinonaktifkan.");
        /*
        try {
            const currentState = getCurrentSnapshot();

            let pdfUrl: string | null = null; // Default to null (deletion)

            // Logic to determine PDF URL:
            // 1. If currently has file:
            //    a. If it's the same file we loaded initially -> Use initialPdfUrl (no upload)
            //    b. If it's a different file -> Upload new file
            // 2. If no file (uploadedPdf is null) -> pdfUrl remains null (delete from DB)

            if (uploadedPdf) {
                if (uploadedPdf === originalPdfFile && initialPdfUrl) {
                    // Case 1a: No change
                    pdfUrl = initialPdfUrl;
                } else {
                    // Case 1b: New upload
                    const token = await getToken({ template: 'supabase' });
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient(token || undefined);

                    const fileExt = uploadedPdf.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { data, error } = await supabase
                        .storage
                        .from('sops-pdfs')
                        .upload(filePath, uploadedPdf);

                    if (error) {
                        console.error("Supabase upload error:", error);
                        throw new Error(`Gagal mengunggah PDF: ${error.message}`);
                    }

                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('sops-pdfs')
                        .getPublicUrl(filePath);

                    pdfUrl = publicUrl;
                }
            }
            // Case 2: uploadedPdf is null, pdfUrl stays null -> triggers deletion in DB update

            if (sopId) {
                await updateSOP(sopId, {
                    title,
                    description,
                    content: currentState,
                    pdfUrl
                });
                toast.success("Project updated successfully");
            } else {
                await createSOP({
                    title,
                    description,
                    content: currentState,
                    pdfUrl
                });
                toast.success("Project created successfully");
            }

        } catch (error: any) {
            console.error("Failed to save project:", error);

            // Check for specific Clerk error regarding missing template
            if (error.message && error.message.includes("No JWT template exists")) {
                toast.error("Konfigurasi Error: JWT Template 'supabase' belum dibuat di Clerk Dashboard.");
            } else {
                toast.error(error.message || "Gagal menyimpan proyek");
            }
        }
        */
    }, [getCurrentSnapshot, uploadedPdf, originalPdfFile, initialPdfUrl, sopId]);

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center bg-gray-100 p-8">
            {/* Toolbar - hide actions if readOnly */}
            {!readOnly && (
                <SOPToolbar
                    initialTitle={initialTitle}
                    initialDescription={initialDescription}
                    uploadedPdf={uploadedPdf}
                    fileInputRef={fileInputRef}
                    onExportPDF={exportToPDF}
                    onFileUpload={handleFileUpload}
                    onClearPdf={clearUploadedPdf}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onSave={handleSaveProject}
                />
            )}

            {/* If readOnly, we might simply show nothing or a minimal header is handled by parent page */}

            {/* Document container */}
            <div
                ref={documentRef}
                className="bg-white p-8 relative sop-page-container"
                style={{
                    width: "fit-content",
                    minWidth: "29.7cm",
                    minHeight: "21cm",
                    fontFamily: "Arial Narrow",
                    pointerEvents: readOnly ? "none" : "auto", // Optional: disable global pointer events? No, we want scroll/copy text
                }}
            >
                {/* Arrow layer */}
                <ArrowsLayer
                    nodes={nodes}
                    edges={edges}
                    arrowConnections={arrowConnections}
                    selectedArrow={selectedArrow}
                    setSelectedArrow={setSelectedArrow}
                    setArrowConnections={setArrowConnections}
                    draggingElbow={draggingElbow}
                    setDraggingElbow={setDraggingElbow}
                    getConnectorPosition={getConnectorPos}
                    generateElbowPath={generateElbowPath}
                    readOnly={readOnly}
                />

                {/* Table */}
                <div style={{ position: "relative", zIndex: 10 }}>
                    <table
                        className="border-collapse"
                        style={{
                            fontSize: "10pt",
                            fontFamily: "Arial Narrow, sans-serif",
                            tableLayout: "fixed",
                            width: `${50 + columnWidths.aktivitas + (pelaksanaColumns.length * 100) + columnWidths.kelengkapan + columnWidths.waktu + columnWidths.output + columnWidths.keterangan}px`,
                        }}
                    >
                        <colgroup>
                            <col style={{ width: "50px" }} />
                            <col style={{ width: `${columnWidths.aktivitas}px` }} />
                            {pelaksanaColumns.map((col) => (
                                <col key={col.id} style={{ width: "100px", maxWidth: "100px" }} />
                            ))}
                            <col style={{ width: `${columnWidths.kelengkapan}px` }} />
                            <col style={{ width: `${columnWidths.waktu}px` }} />
                            <col style={{ width: `${columnWidths.output}px` }} />
                            <col style={{ width: `${columnWidths.keterangan}px` }} />
                        </colgroup>

                        <SOPTableHeader
                            pelaksanaColumns={pelaksanaColumns}
                            columnWidths={columnWidths}
                            setResizingColumn={setResizingColumn}
                            addColumn={addColumn}
                            removeColumn={removeColumn}
                            updateColumnName={updateColumnName}
                            readOnly={readOnly}
                        />

                        <SOPTableBody
                            rows={rows}
                            pelaksanaColumns={pelaksanaColumns}
                            columnWidths={columnWidths}
                            cellDataMap={cellDataMap}
                            activeNodes={activeNodes}
                            connectionState={connectionState}
                            addRow={addRow}
                            removeRow={removeRow}
                            handleShapeSelect={handleShapeSelect}
                            handleNodeClickWithHistory={handleNodeClickWithHistory}
                            handleLabelChange={handleLabelChange}
                            readOnly={readOnly}
                        />
                    </table>
                </div>
            </div>

            {/* AI Chat Sidebar - disabled in readOnly */}
            {!readOnly && (
                <AIChatSidebar
                    isOpen={isChatOpen}
                    onToggle={() => setIsChatOpen(!isChatOpen)}
                    onSopGenerated={handleSopGenerated}
                />
            )}
        </div>
    );
}

