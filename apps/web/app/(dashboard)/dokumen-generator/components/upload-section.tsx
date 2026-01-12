import React from "react";
import { Upload } from "lucide-react";

interface UploadSectionProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
}

export function UploadSection({
    onUpload,
    fileInputRef,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
}: UploadSectionProps) {
    return (
        <section className="flex-1 flex flex-col items-center justify-center">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`w-full max-w-2xl border-2 border-dashed p-12 rounded-sm transition-colors cursor-pointer ${isDragging
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-black hover:bg-gray-50"
                    }`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx"
                    onChange={onUpload}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                    <Upload className="w-16 h-16 text-gray-400" />
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Unggah template DOCX Anda</h2>
                        <p className="text-gray-500">
                            Seret dan lepas file di sini, atau klik untuk mencari
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                            Gunakan variabel dengan format {"{namaVariabel}"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4 text-center max-w-lg">
                <h3 className="font-bold uppercase tracking-wider text-sm">Cara penggunaan:</h3>
                <ol className="text-sm text-gray-600 space-y-2 text-left list-decimal list-inside">
                    <li>Buat dokumen Word dengan variabel seperti {"{Nama}"}, {"{Tanggal}"}, dll.</li>
                    <li>Unggah file template</li>
                    <li>Isi tabel data</li>
                    <li>Buat dan unduh dokumen Anda</li>
                </ol>
            </div>
        </section>
    );
}
