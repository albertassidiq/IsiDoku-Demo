"use client";

import { useState, useCallback, useRef } from "react";
import type { PelaksanaColumn, TableRow, CellData } from "../types";
import type { ArrowConnection } from "@/components/ShapeNode";

// Snapshot of entire SOP state for undo/redo
export interface SOPSnapshot {
    pelaksanaColumns: PelaksanaColumn[];
    rows: TableRow[];
    cellDataMap: Record<string, CellData>;
    arrowConnections: ArrowConnection[];
}

// Maximum number of undo steps to keep (memory optimization)
const MAX_HISTORY_SIZE = 50;

export interface UseHistoryStateReturn {
    // Push current state before making changes
    pushState: (snapshot: SOPSnapshot) => void;

    // Undo - returns previous state or null if nothing to undo
    undo: (currentSnapshot: SOPSnapshot) => SOPSnapshot | null;

    // Redo - returns next state or null if nothing to redo
    redo: (currentSnapshot: SOPSnapshot) => SOPSnapshot | null;

    // State indicators
    canUndo: boolean;
    canRedo: boolean;

    // Clear history (useful when loading new SOP)
    clearHistory: () => void;
}

/**
 * Hook for managing undo/redo history with snapshot-based approach
 * 
 * Usage:
 * 1. Before any modifying action, call pushState(currentSnapshot)
 * 2. To undo, call undo(currentSnapshot) and restore returned snapshot
 * 3. To redo, call redo(currentSnapshot) and restore returned snapshot
 */
export function useHistoryState(): UseHistoryStateReturn {
    // Past states stack (for undo)
    const [past, setPast] = useState<SOPSnapshot[]>([]);

    // Future states stack (for redo)
    const [future, setFuture] = useState<SOPSnapshot[]>([]);

    // Flag to prevent pushing during undo/redo
    const isUndoRedoing = useRef(false);

    /**
     * Push current state to history before making changes
     * Call this BEFORE the modifying action
     */
    const pushState = useCallback((snapshot: SOPSnapshot) => {
        // Don't push if we're in the middle of undo/redo
        if (isUndoRedoing.current) return;

        setPast(prev => {
            const newPast = [...prev, snapshot];
            // Limit history size
            if (newPast.length > MAX_HISTORY_SIZE) {
                return newPast.slice(-MAX_HISTORY_SIZE);
            }
            return newPast;
        });

        // Clear future when new action is performed
        setFuture([]);
    }, []);

    /**
     * Undo last action
     * Returns the previous state to restore, or null if nothing to undo
     */
    const undo = useCallback((currentSnapshot: SOPSnapshot): SOPSnapshot | null => {
        if (past.length === 0) return null;

        isUndoRedoing.current = true;

        const previousState = past[past.length - 1];
        if (!previousState) return null;

        setPast(prev => prev.slice(0, -1));
        setFuture(prev => [currentSnapshot, ...prev]);

        // Reset flag after state updates
        setTimeout(() => {
            isUndoRedoing.current = false;
        }, 0);

        return previousState;
    }, [past]);

    /**
     * Redo last undone action
     * Returns the next state to restore, or null if nothing to redo
     */
    const redo = useCallback((currentSnapshot: SOPSnapshot): SOPSnapshot | null => {
        if (future.length === 0) return null;

        isUndoRedoing.current = true;

        const nextState = future[0];
        if (!nextState) return null;

        setFuture(prev => prev.slice(1));
        setPast(prev => [...prev, currentSnapshot]);

        // Reset flag after state updates
        setTimeout(() => {
            isUndoRedoing.current = false;
        }, 0);

        return nextState;
    }, [future]);

    /**
     * Clear all history (useful when loading a new SOP)
     */
    const clearHistory = useCallback(() => {
        setPast([]);
        setFuture([]);
    }, []);

    return {
        pushState,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        clearHistory,
    };
}
