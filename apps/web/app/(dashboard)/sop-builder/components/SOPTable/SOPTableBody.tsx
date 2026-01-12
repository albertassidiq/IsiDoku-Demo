
import React from 'react';
import { RowNumberCell } from './RowNumberCell';
import { ShapeCell } from './ShapeCell';
import { CellData } from '../../types';

interface SOPTableBodyProps {
    rows: any[];
    pelaksanaColumns: any[];
    columnWidths: {
        aktivitas: number;
        kelengkapan: number;
        waktu: number;
        output: number;
        keterangan: number;
    };
    cellDataMap: Record<string, CellData>;
    activeNodes: Record<string, any>;
    connectionState: { isConnecting: boolean };
    addRow: (position: "start" | "end" | number) => void;
    removeRow: (id: string) => void;
    handleShapeSelect: (cellId: string, rowIndex: number, colIndex: number, shape: any) => void;
    handleNodeClickWithHistory: (cellId: string, position: any) => void;
    handleLabelChange: (cellId: string, newLabel: string) => void;
}

export function SOPTableBody({
    rows,
    pelaksanaColumns,
    columnWidths,
    cellDataMap,
    activeNodes,
    connectionState,
    addRow,
    removeRow,
    handleShapeSelect,
    handleNodeClickWithHistory,
    handleLabelChange,
    readOnly = false,
}: SOPTableBodyProps & { readOnly?: boolean }) {
    return (
        <tbody>
            {rows.map((row, rowIndex) => (
                <tr key={row.id}>
                    <RowNumberCell
                        row={row}
                        index={rowIndex}
                        isFirst={rowIndex === 0}
                        isLast={rowIndex === rows.length - 1}
                        totalRows={rows.length}
                        onAddRow={addRow}
                        onRemoveRow={removeRow}
                        readOnly={readOnly}
                    />
                    <td
                        contentEditable={!readOnly}
                        suppressContentEditableWarning
                        className="border border-gray-400 p-2 align-top text-left outline-none"
                        style={{ width: `${columnWidths.aktivitas}px`, overflow: "hidden", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: row.activity || '' }}
                    />
                    {pelaksanaColumns.map((column, colIndex) => {
                        const cellId = `${row.id}-${column.id}`;
                        return (
                            <ShapeCell
                                key={column.id}
                                cellId={cellId}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                cellData={cellDataMap[cellId]}
                                activeNode={activeNodes[cellId] || null}
                                isConnecting={connectionState.isConnecting}
                                onShapeSelect={handleShapeSelect}
                                onNodeClick={handleNodeClickWithHistory}
                                onLabelChange={handleLabelChange}
                                readOnly={readOnly}
                            />
                        );
                    })}
                    <td
                        contentEditable={!readOnly}
                        suppressContentEditableWarning
                        className="border border-gray-400 p-2 align-top text-left outline-none"
                        style={{ width: `${columnWidths.kelengkapan}px`, overflow: "hidden", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: row.kelengkapan || '' }}
                    />
                    <td
                        contentEditable
                        suppressContentEditableWarning
                        className="border border-gray-400 p-2 align-top text-left outline-none"
                        style={{ width: `${columnWidths.waktu}px`, overflow: "hidden", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: row.waktu || '' }}
                    />
                    <td
                        contentEditable
                        suppressContentEditableWarning
                        className="border border-gray-400 p-2 align-top text-left outline-none"
                        style={{ width: `${columnWidths.output}px`, overflow: "hidden", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: row.output || '' }}
                    />
                    <td
                        contentEditable
                        suppressContentEditableWarning
                        className="border border-gray-400 p-2 align-top text-left outline-none"
                        style={{ width: `${columnWidths.keterangan}px`, overflow: "hidden", wordWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: row.keterangan || '' }}
                    />
                </tr>
            ))}
        </tbody>
    );
}
