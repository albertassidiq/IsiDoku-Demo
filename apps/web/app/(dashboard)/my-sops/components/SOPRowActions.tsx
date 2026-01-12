"use client";

import { deleteSOP } from "@/actions/sop";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface SOPRowActionsProps {
    sopId: string;
    sopTitle: string;
}

export function SOPRowActions({ sopId, sopTitle }: SOPRowActionsProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteSOP(sopId);
            toast.success("SOP berhasil dihapus");
            setOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Gagal menghapus SOP");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-2 justify-end">
            <Link href={`/my-sops/${sopId}/edit`} title="Edit SOP">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 group border-2 border-black bg-white hover:bg-black hover:text-white cursor-pointer"
                >
                    <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>

            <Link href={`/my-sops/${sopId}`} title="Lihat SOP">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 group border-2 border-black bg-white hover:bg-black hover:text-white cursor-pointer"
                >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>
            </Link>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 group border-2 border-black bg-white hover:bg-black hover:text-white cursor-pointer"
                        title="Hapus SOP"
                    >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus SOP?</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus SOP <strong>"{sopTitle}"</strong>? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting} className="border-2 border-black cursor-pointer bg-white hover:bg-black hover:text-white">
                                Batal
                            </Button>
                            <Button variant="outline" onClick={handleDelete} disabled={isDeleting} className="border-2 border-black cursor-pointer bg-white hover:bg-yellow-400 hover:text-black">
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
