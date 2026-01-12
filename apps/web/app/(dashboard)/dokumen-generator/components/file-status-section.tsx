import React from "react";
import { Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileState } from "./types";

interface FileStatusSectionProps {
    fileState: FileState;
    onRemoveFile: () => void;
    filenameTemplate: string;
    onFilenameTemplateChange: (value: string) => void;
    onDownloadTemplate: () => void;
    onUploadXlsx: (e: React.ChangeEvent<HTMLInputElement>) => void;
    xlsxInputRef: React.RefObject<HTMLInputElement | null>;
}

export function FileStatusSection({
    fileState,
    onRemoveFile,
    filenameTemplate,
    onFilenameTemplateChange,
    onDownloadTemplate,
    onUploadXlsx,
    xlsxInputRef,
}: FileStatusSectionProps) {
    return (
        <section className="flex flex-col gap-6">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-black rounded-full animate-pulse"></span>
                    <h2 className="text-5xl font-black tracking-tight leading-tight">
                        Template Siap.
                    </h2>
                </div>
                <div className="flex items-center gap-4 pl-6">
                    <p className="text-lg text-black font-medium border-l-2 border-black ml-1.5 pl-4">
                        Menggunakan file:{" "}
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded-sm">
                            {fileState.file?.name}
                        </span>
                    </p>
                    <button
                        onClick={onRemoveFile}
                        className="p-2 hover:bg-black hover:text-white rounded-sm transition-colors"
                        title="Hapus file"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                    Variabel Terdeteksi ({fileState.variables.length}):
                </h3>
                <div className="flex flex-wrap gap-3">
                    {fileState.variables.map((variable) => (
                        <div
                            key={variable}
                            className="px-3 py-1.5 border-2 border-black rounded-sm bg-white hover:bg-black hover:text-white transition-colors cursor-default group"
                        >
                            <span className="font-mono text-sm font-medium">{"{" + variable + "}"}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filename Template */}
            <div className="pt-4">
                <label className="text-sm font-bold uppercase tracking-wider block mb-2">
                    Template Nama File (opsional):
                </label>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 w-full max-w-md">
                        <input
                            type="text"
                            value={filenameTemplate}
                            onChange={(e) => onFilenameTemplateChange(e.target.value)}
                            placeholder="dokumen_{namaVariabel}.docx"
                            className="w-full p-3 font-mono text-sm border-2 border-black rounded-sm focus:ring-2 focus:ring-black bg-transparent"
                        />
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            Gunakan {"{namaVariabel}"} untuk menyisipkan data ke nama file
                        </p>
                    </div>
                    {/* Excel Tools */}
                    <div className="flex items-center gap-2">
                        <input
                            ref={xlsxInputRef}
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={onUploadXlsx}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            onClick={onDownloadTemplate}
                            className="bg-white hover:bg-black hover:text-white"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Template Excel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => xlsxInputRef.current?.click()}
                            className="bg-white hover:bg-black hover:text-white"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Unggah Excel
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
