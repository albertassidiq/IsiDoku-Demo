"use client";

import React, { useMemo, useState } from "react";
import { SOPBuilderContent } from "../../sop-builder/components/SOPBuilderContent";

interface SOPViewerProps {
    sop: {
        id: string;
        title: string;
        description?: string | null;
        content: any; // The JSON snapshot
        pdfUrl?: string | null;
    };
}

export default function SOPViewer({ sop }: SOPViewerProps) {
    const { content, pdfUrl, title } = sop;

    // Use SOPBuilderContent in read-only mode
    // We pass the content directly as initialData

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* 1. Header Section */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{title}</h1>
                    {sop.description && (
                        <p className="text-gray-600 max-w-3xl leading-relaxed">{sop.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <a href={`/my-sops/${sop.id}/edit`} className="inline-flex items-center px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        Edit SOP
                    </a>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 gap-8 flex flex-col items-center">

                {/* 2. Top Section: Attached PDF (if any) */}
                {pdfUrl && (
                    <div className="w-full max-w-[1200px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden shrink-0">
                        <div className="px-6 py-4 border-b-2 border-black bg-white flex justify-between items-center">
                            <h2 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
                                Dokumen PDF Terlampir (Merge)
                            </h2>
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border-2 border-black bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                                Buka di Tab Baru
                            </a>
                        </div>
                        <div className="w-full h-[800px] bg-gray-100 relative">
                            <object
                                data={pdfUrl}
                                type="application/pdf"
                                className="w-full h-full"
                            >
                                <div className="flex items-center justify-center h-full flex-col gap-2 p-4 text-center">
                                    <p>Browser Anda tidak dapat menampilkan PDF ini.</p>
                                    <a href={pdfUrl} target="_blank" className="text-blue-600 underline">Download PDF</a>
                                </div>
                            </object>
                        </div>
                    </div>
                )}

                {/* 3. Bottom Section: SOP Diagram (Using Builder Content) */}
                <div className="w-full max-w-[1200px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden flex flex-col relative shrink-0">
                    <div className="px-6 py-4 border-b-2 border-black bg-white">
                        <h2 className="font-bold text-lg text-gray-800">
                            Diagram SOP
                        </h2>
                    </div>

                    {/* Render SOPBuilderContent in read-only mode */}
                    <SOPBuilderContent initialData={content} readOnly={true} />
                </div>
            </div>
        </div>
    );
}
