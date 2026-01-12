import React from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionFooterProps {
    onAddRow: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
    dataCount: number;
}

export function ActionFooter({
    onAddRow,
    onGenerate,
    isGenerating,
    dataCount,
}: ActionFooterProps) {
    return (
        <section className="mt-4 pb-12 sticky bottom-0 bg-white/90 backdrop-blur-sm pt-4 border-t-2 border-black">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Button
                    variant="outline"
                    onClick={onAddRow}
                    className="group flex items-center gap-2 px-6 py-3 font-bold text-sm"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    TAMBAH BARIS BARU
                </Button>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <Button
                        variant="default"
                        onClick={onGenerate}
                        disabled={isGenerating || dataCount === 0}
                        className="flex items-center justify-center gap-3 px-8 py-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <span className="animate-pulse">Memproses...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                {dataCount === 1
                                    ? "BUAT & UNDUH DOCX"
                                    : "BUAT & UNDUH ZIP"}
                            </>
                        )}
                    </Button>
                    <span className="text-xs font-mono text-gray-500 hidden md:block">
                        {dataCount > 1
                            ? `${dataCount} dokumen akan dibuat`
                            : "Satu dokumen akan dibuat"}
                    </span>
                </div>
            </div>
        </section>
    );
}
