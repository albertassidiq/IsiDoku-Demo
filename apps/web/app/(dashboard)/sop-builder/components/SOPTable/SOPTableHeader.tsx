
import React from 'react';
import { PelaksanaHeaderCell } from './PelaksanaHeaderCell';

interface SOPTableHeaderProps {
    pelaksanaColumns: any[];
    columnWidths: {
        aktivitas: number;
        kelengkapan: number;
        waktu: number;
        output: number;
        keterangan: number;
    };
    setResizingColumn: (data: any) => void;
    addColumn: (position: "start" | "end" | number) => void;
    removeColumn: (id: string) => void;
    updateColumnName: (id: string, newName: string) => void;
}

export function SOPTableHeader({
    pelaksanaColumns,
    columnWidths,
    setResizingColumn,
    addColumn,
    removeColumn,
    updateColumnName,
    readOnly = false,
}: SOPTableHeaderProps & { readOnly?: boolean }) {
    return (
        <thead style={{ overflow: "visible" }}>
            <tr style={{ overflow: "visible" }}>
                <th
                    rowSpan={2}
                    className="border border-gray-400 p-2 text-center"
                    style={{ backgroundColor: "#DEEAF6", width: "50px" }}
                >
                    No
                </th>
                <th
                    rowSpan={2}
                    className="border border-gray-400 p-2 text-center relative group"
                    style={{ backgroundColor: "#DEEAF6", width: `${columnWidths.aktivitas}px` }}
                >
                    Aktivitas/Kegiatan
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-500"
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResizingColumn({
                                column: 'aktivitas',
                                startX: e.clientX,
                                startWidth: columnWidths.aktivitas,
                            });
                        }}
                    />
                </th>
                <th
                    colSpan={pelaksanaColumns.length}
                    className="border border-gray-400 p-2 text-center"
                    style={{ backgroundColor: "#DEEAF6" }}
                >
                    Pelaksana
                </th>
                <th
                    colSpan={3}
                    className="border border-gray-400 p-2 text-center"
                    style={{ backgroundColor: "#DEEAF6" }}
                >
                    Mutu Baku
                </th>
                <th
                    rowSpan={2}
                    className="border border-gray-400 p-2 text-center relative group"
                    style={{ backgroundColor: "#DEEAF6", width: `${columnWidths.keterangan}px` }}
                >
                    Keterangan
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-500"
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResizingColumn({
                                column: 'keterangan',
                                startX: e.clientX,
                                startWidth: columnWidths.keterangan,
                            });
                        }}
                    />
                </th>
            </tr>
            <tr style={{ overflow: "visible" }}>
                {pelaksanaColumns.map((column, index) => (
                    <PelaksanaHeaderCell
                        key={column.id}
                        column={column}
                        index={index}
                        isFirst={index === 0}
                        isLast={index === pelaksanaColumns.length - 1}
                        totalColumns={pelaksanaColumns.length}
                        onAddColumn={addColumn}
                        onRemoveColumn={removeColumn}
                        onUpdateColumnName={updateColumnName}
                        readOnly={readOnly}
                    />
                ))}
                <th className="border border-gray-400 p-2 text-center relative group" style={{ backgroundColor: "#DEEAF6", width: `${columnWidths.kelengkapan}px` }}>
                    Kelengkapan
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-500"
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResizingColumn({
                                column: 'kelengkapan',
                                startX: e.clientX,
                                startWidth: columnWidths.kelengkapan,
                            });
                        }}
                    />
                </th>
                <th className="border border-gray-400 p-2 text-center relative group" style={{ backgroundColor: "#DEEAF6", width: `${columnWidths.waktu}px` }}>
                    Waktu
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-500"
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResizingColumn({
                                column: 'waktu',
                                startX: e.clientX,
                                startWidth: columnWidths.waktu,
                            });
                        }}
                    />
                </th>
                <th className="border border-gray-400 p-2 text-center relative group" style={{ backgroundColor: "#DEEAF6", width: `${columnWidths.output}px` }}>
                    Output
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-transparent hover:bg-blue-500"
                        style={{ zIndex: 50 }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setResizingColumn({
                                column: 'output',
                                startX: e.clientX,
                                startWidth: columnWidths.output,
                            });
                        }}
                    />
                </th>
            </tr>
            <tr>
                <td className="border border-gray-400 p-2 text-center" style={{ width: "50px" }}>(1)</td>
                <td className="border border-gray-400 p-2 text-center" style={{ width: `${columnWidths.aktivitas}px` }}>(2)</td>
                {pelaksanaColumns.map((column, index) => (
                    <td
                        key={column.id}
                        className="border border-gray-400 p-2 text-center whitespace-nowrap"
                        style={{ width: "100px" }}
                    >
                        ({index + 3})
                    </td>
                ))}
                <td className="border border-gray-400 p-2 text-center" style={{ width: `${columnWidths.kelengkapan}px` }}>({pelaksanaColumns.length + 3})</td>
                <td className="border border-gray-400 p-2 text-center" style={{ width: `${columnWidths.waktu}px` }}>({pelaksanaColumns.length + 4})</td>
                <td className="border border-gray-400 p-2 text-center" style={{ width: `${columnWidths.output}px` }}>({pelaksanaColumns.length + 5})</td>
                <td className="border border-gray-400 p-2 text-center" style={{ width: `${columnWidths.keterangan}px` }}>({pelaksanaColumns.length + 6})</td>
            </tr>
        </thead>
    );
}
