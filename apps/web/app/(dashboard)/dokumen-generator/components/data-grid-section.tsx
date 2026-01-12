import React from "react";
import { Delete } from "lucide-react";
import { DataRow } from "./types";

interface DataGridSectionProps {
    data: DataRow[];
    variables: string[];
    onCellChange: (id: string, field: string, value: string) => void;
    onDeleteRow: (id: string) => void;
}

export function DataGridSection({
    data,
    variables,
    onCellChange,
    onDeleteRow,
}: DataGridSectionProps) {
    return (
        <section className="flex-1 flex flex-col gap-4">
            {data.length > 0 && (
                <div className="overflow-x-auto border-2 border-black rounded-sm">
                    <table className="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                            <tr className="bg-black text-white">
                                {variables.map((variable) => (
                                    <th
                                        key={variable}
                                        className="p-4 font-mono text-sm font-medium tracking-wide border-r border-gray-700"
                                        style={{
                                            width: `${90 / variables.length}%`,
                                        }}
                                    >
                                        {"{" + variable + "}"}
                                    </th>
                                ))}
                                <th className="p-4 font-mono text-sm font-medium tracking-wide w-20 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-black">
                            {data.map((row) => (
                                <tr
                                    key={row.id}
                                    className="bg-white hover:bg-gray-50 transition-colors group"
                                >
                                    {variables.map((variable) => (
                                        <td key={variable} className="p-0 border-r-2 border-black">
                                            <input
                                                type="text"
                                                value={row[variable] || ""}
                                                onChange={(e) =>
                                                    onCellChange(row.id, variable, e.target.value)
                                                }
                                                className="w-full p-4 font-mono text-sm border-none outline-none focus:ring-2 focus:ring-black bg-transparent"
                                                placeholder="Nilai"
                                            />
                                        </td>
                                    ))}
                                    <td className="p-2 text-center">
                                        <button
                                            onClick={() => onDeleteRow(row.id)}
                                            aria-label="Hapus baris"
                                            className="p-2 hover:bg-black hover:text-white rounded-sm transition-colors"
                                        >
                                            <Delete className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="text-xs text-gray-500 font-mono text-right mt-1">
                Menampilkan {data.length} baris
            </div>
        </section>
    );
}
