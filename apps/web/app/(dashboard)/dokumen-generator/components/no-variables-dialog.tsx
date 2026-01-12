import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface NoVariablesDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NoVariablesDialog({ isOpen, onOpenChange }: NoVariablesDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md p-0 gap-0 overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="p-6 border-b-2 border-black bg-gray-50">
                    <DialogTitle className="text-2xl font-black tracking-tight text-left">
                        Variabel Tidak Ditemukan
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium text-gray-600 text-left mt-2 relative top-1">
                        Kami tidak dapat mendeteksi variabel apa pun dalam dokumen Anda.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 bg-white">
                    <div className="space-y-3">
                        <p className="font-bold uppercase tracking-wider text-xs text-black">
                            Format yang Diperlukan
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Untuk membuat template, Anda harus membungkus variabel dalam format kurung kurawal. Generator akan mengidentifikasi ini sebagai bagian yang harus diisi.
                        </p>
                    </div>

                    <div className="relative mt-2">
                        <div className="absolute -top-3 left-4 bg-white px-2 border-2 border-black text-[10px] font-black uppercase tracking-wider z-10">
                            Contoh Benar
                        </div>
                        <div className="bg-white p-5 border-2 border-black rounded-sm font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative">
                            <div className="space-y-2 text-gray-800">
                                <p>Halo <span className="bg-yellow-200 text-black font-bold border border-black px-1">{"{NamaKlien}"}</span>,</p>
                                <p>Faktur Anda <span className="bg-yellow-200 text-black font-bold border border-black px-1">{"{NoFaktur}"}</span> sudah siap.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 italic">
                        * Variabel peka huruf besar/kecil (case-sensitive).
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
