"use client";

import React, { useState } from "react";
import { Upload, FileText, X, Download, Undo2, Redo2 } from "lucide-react";
import { SaveSOPDialog } from "./SaveSOPDialog";

export interface SOPToolbarProps {
    uploadedPdf: File | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onExportPDF: () => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearPdf: () => void;
    // Undo/Redo props
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onSave: (title: string, description?: string) => void; // Changed return type from Promise<void> to void
    initialTitle?: string;
    initialDescription?: string;
}

/**
 * Toolbar component with export buttons, PDF upload, and undo/redo
 */
export function SOPToolbar({
    uploadedPdf,
    fileInputRef,
    onExportPDF,
    onFileUpload,
    onClearPdf,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onSave,
    initialTitle = "",
    initialDescription = "",
}: SOPToolbarProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

    return (
        <div className="mb-4 flex gap-3 items-center">
            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-1 mr-2">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-2 border-2 border-black rounded-sm transition-colors font-bold disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-gray-100"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 className="w-5 h-5" />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="p-2 border-2 border-black rounded-sm transition-colors font-bold disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-gray-100"
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo2 className="w-5 h-5" />
                </button>
            </div>

            <SaveSOPDialog
                onSave={onSave}
                initialTitle={title}
                initialDescription={description}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                isOpen={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
            />

            <button
                onClick={onExportPDF}
                className="px-6 py-2 bg-black text-white border-2 border-black rounded-sm hover:bg-white hover:text-black transition-colors font-bold flex items-center gap-2"
            >
                <Download className="w-5 h-5" />
                Download PDF
            </button>

            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={onFileUpload}
                    className="hidden"
                    ref={fileInputRef}
                />

                {!uploadedPdf ? (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-white text-black border-2 border-black rounded-sm hover:bg-black hover:text-white transition-colors font-bold flex items-center gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        Merge PDF
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-black rounded-sm">
                        <FileText className="w-5 h-5" />
                        <span className="font-mono text-sm max-w-[200px] truncate" title={uploadedPdf.name}>
                            {uploadedPdf.name}
                        </span>
                        <button
                            onClick={onClearPdf}
                            className="ml-2 hover:bg-gray-200 rounded-full p-1 transition-colors"
                        >
                            <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
