import { getSOPs } from "@/actions/sop";
import { formatDate } from "@/utils/format";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOPRowActions } from "./components/SOPRowActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { SearchInput } from "./components/SearchInput";

export default async function MySOPsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const sops = await getSOPs(q);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">List SOP</h1>
                    <p className="text-gray-600">Lihat semua SOP yang telah dibuat</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchInput />
                    <Link href="/sop-builder">
                        <Button variant="outline" className="flex items-center gap-2 group cursor-pointer border-2 border-black bg-white hover:bg-black hover:text-white shrink-0">
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            SOP Baru
                        </Button>
                    </Link>
                </div>
            </div>

            {sops.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-sm border-2 border-dashed border-black text-center">
                    <FileText className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900">Belum ada proyek</h3>
                    <p className="text-gray-500 mb-6 font-medium">Buat Standard Operating Procedure pertamamu sekarang</p>
                    <Link href="/sop-builder">
                        <Button className="flex items-center gap-2 border-2 border-black rounded-sm bg-black text-white hover:bg-white hover:text-black transition-colors">
                            <Plus className="w-4 h-4" />
                            Buat SOP
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="border-2 border-black rounded-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-black">
                            <TableRow className="hover:bg-black border-black">
                                <TableHead className="text-white w-[300px]">Project</TableHead>
                                <TableHead className="text-white">Description</TableHead>
                                <TableHead className="text-white w-[150px]">Last Updated</TableHead>
                                <TableHead className="text-white w-[140px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sops.map((sop) => (
                                <TableRow key={sop.id} className="border-b-2 border-black hover:bg-yellow-50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-yellow-300 rounded-sm border-2 border-black shrink-0">
                                                <FileText className="w-4 h-4 text-black" />
                                            </div>
                                            <span className="truncate max-w-[200px]" title={sop.title}>{sop.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-gray-600 truncate max-w-[400px]">
                                            {sop.description || "-"}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                                            {sop.updatedAt ? new Date(sop.updatedAt).toLocaleDateString('id-ID') : 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <SOPRowActions sopId={sop.id} sopTitle={sop.title} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
