import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertState } from "./types";

interface AlertDialogProps {
    state: AlertState;
    onClose: () => void;
}

export function AlertDialog({ state, onClose }: AlertDialogProps) {
    return (
        <Dialog
            open={state.isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent
                className="sm:max-w-md p-0 gap-0 overflow-hidden"
                onInteractOutside={(e) => {
                    if (state.type === 'error' || state.type === 'confirm') {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader className={`p-6 border-b-2 border-black ${state.type === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <DialogTitle className={`text-2xl font-black tracking-tight text-left ${state.type === 'error' ? 'text-red-600' : 'text-black'}`}>
                        {state.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 bg-white">
                    <p className="text-base font-medium text-gray-800 leading-relaxed">
                        {state.message}
                    </p>
                </div>

                <DialogFooter className="p-4 bg-gray-50 border-t-2 border-black flex flex-row justify-end gap-3">
                    {state.type === 'confirm' ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-2 border-black hover:bg-gray-100"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={() => {
                                    state.onConfirm?.();
                                    onClose();
                                }}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                Lanjut
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={onClose}
                            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
                        >
                            {state.type === 'error' ? 'Tutup' : 'Mengerti'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
