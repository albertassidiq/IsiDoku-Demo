"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner"; // Use sonner toast

interface SaveSOPDialogProps {
    onSave: (title: string, description?: string) => void;
    initialTitle?: string;
    initialDescription?: string;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SaveSOPDialog({
    onSave,
    initialTitle = "",
    initialDescription = "",
    onTitleChange,
    onDescriptionChange,
    isOpen,
    onOpenChange
}: SaveSOPDialogProps) {
    // Internal state if NOT controlled, otherwise use props
    const [internalOpen, setInternalOpen] = useState(false);
    const [internalTitle, setInternalTitle] = useState(initialTitle);
    const [internalDescription, setInternalDescription] = useState(initialDescription);
    const [loading, setLoading] = useState(false);

    const isControlled = isOpen !== undefined;
    const open = isControlled ? isOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;

    const title = onTitleChange ? initialTitle : internalTitle;
    const setTitle = onTitleChange ? onTitleChange : setInternalTitle;

    const description = onDescriptionChange ? initialDescription : internalDescription;
    const setDescription = onDescriptionChange ? onDescriptionChange : setInternalDescription;

    // Update internal state when initials change (for uncontrolled mode)
    // Actually simpler: just blindly use whatever is passed. If controlled, use props. If not, use local state initialized with props.
    // Wait, SOPToolbar is controlling it now. 

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Mohon isi judul SOP");
            return;
        }

        setLoading(true);
        try {
            await onSave(title, description);
            setOpen(false);
            // Don't clear title/description if controlled/Edit mode - user might want to keep editing
            if (!isControlled) {
                setTitle("");
                setDescription("");
            }
            // Toast is handled by parent for create/update separation, 
            // but we can keep a generic success here if needed, or remove it.
            // Parent handles it now.
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan proyek");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="px-6 py-2 bg-yellow-400 text-black border-2 border-black rounded-sm hover:bg-yellow-300 transition-colors font-bold flex items-center gap-2"
                    title="Simpan Proyek"
                >
                    <Save className="w-5 h-5" />
                    Simpan Proyek
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Simpan Proyek</DialogTitle>
                    <DialogDescription>
                        Simpan progres pekerjaanmu saat ini. Kamu bisa mengaksesnya kembali nanti di menu "My Projects".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul SOP</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: SOP Pengajuan Cuti"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi singkat mengenai SOP ini..."
                        />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:justify-end gap-2">
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={loading}
                        variant="outline"
                        className="border-2 border-black rounded-sm hover:bg-gray-100 transition-colors font-bold"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-black text-white border-2 border-black rounded-sm hover:bg-white hover:text-black transition-colors font-bold"
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
