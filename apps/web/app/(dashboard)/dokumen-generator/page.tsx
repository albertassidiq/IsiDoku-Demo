"use client";

import React, { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import {
  extractVariablesFromDocx,
  generateZip,
  downloadDocx,
  generateDocx,
} from "@/lib/docx-utils";
import { DataRow, FileState, AlertState } from "./components/types";
import { UploadSection } from "./components/upload-section";
import { FileStatusSection } from "./components/file-status-section";
import { DataGridSection } from "./components/data-grid-section";
import { ActionFooter } from "./components/action-footer";
import { NoVariablesDialog } from "./components/no-variables-dialog";
import { AlertDialog } from "./components/alert-dialog";

export default function DokumenGeneratorPage() {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    variables: [],
    templateBuffer: null,
  });
  const [data, setData] = useState<DataRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filenameTemplate, setFilenameTemplate] = useState("");
  const [showNoVariablesModal, setShowNoVariablesModal] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xlsxInputRef = useRef<HTMLInputElement>(null);

  const showAlert = (title: string, message: string, type: "info" | "error" | "confirm" = "info", onConfirm?: () => void) => {
    setAlertState({ isOpen: true, title, message, type, onConfirm });
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.name.endsWith(".docx")) {
        showAlert("Format File Salah", "Mohon unggah file dengan format .docx", "error");
        return;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const variables = await extractVariablesFromDocx(file);

        if (variables.length === 0) {
          setShowNoVariablesModal(true);
          return;
        }

        setFileState({
          file,
          variables,
          templateBuffer: arrayBuffer,
        });

        // Initialize with one empty row
        const emptyRow: DataRow = {
          id: Date.now().toString(),
        };
        variables.forEach((v) => {
          emptyRow[v] = "";
        });
        setData([emptyRow]);

        // Set default filename template using first variable
        if (variables.length > 0) {
          setFilenameTemplate(`dokumen_{${variables[0]}}.docx`);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        showAlert("Gagal Memproses File", "Terjadi kesalahan saat memproses file. Pastikan file tersebut adalah file .docx yang valid/tidak rusak.", "error");
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleRemoveFile = useCallback(() => {
    setFileState({
      file: null,
      variables: [],
      templateBuffer: null,
    });
    setData([]);
    setFilenameTemplate("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleCellChange = (id: string, field: string, value: string) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleDeleteRow = (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleAddRow = () => {
    const newRow: DataRow = {
      id: Date.now().toString(),
    };
    fileState.variables.forEach((v) => {
      newRow[v] = "";
    });
    setData((prev) => [...prev, newRow]);
  };

  const handleDownloadXlsxTemplate = () => {
    if (fileState.variables.length === 0) return;

    // Create worksheet data with headers
    const ws = XLSX.utils.aoa_to_sheet([fileState.variables]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Write to file and download
    XLSX.writeFile(wb, "template.xlsx");
  };

  const handleUploadXlsx = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      try {
        const wb = XLSX.read(data, { type: "binary" });
        const sheetName = wb.SheetNames[0];
        if (!sheetName) throw new Error("No sheet found in workbook");

        const ws = wb.Sheets[sheetName];
        if (!ws) throw new Error("Sheet data not found");

        // Parse data to JSON, header: 1 means we get array of arrays
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (jsonData.length < 2) {
          showAlert("File Excel Kosong", "File Excel tampaknya kosong atau tidak memiliki baris data yang valid.", "error");
          return;
        }

        // First row is header
        const headers = jsonData[0] as string[];

        // Filter out empty headers if any
        const validHeaders = headers.filter(h => !!h);

        // Validation: Check if headers match variables
        const missingVars = fileState.variables.filter(v => !validHeaders.includes(v));
        if (missingVars.length > 0) {
          showAlert("Header Tidak Cocok", `Header Excel tidak cocok dengan variabel dokumen. Variabel yang hilang: ${missingVars.join(", ")}`, "error");
          return;
        }

        const newRows: DataRow[] = [];

        // Correctly map rows based on headers
        for (let i = 1; i < jsonData.length; i++) {
          const rowValues = jsonData[i] as any[];
          // Skip empty rows
          if (!rowValues || rowValues.length === 0) continue;

          const rowData: DataRow = {
            id: Date.now().toString() + i,
          };

          // Map values by index corresponding to header
          headers.forEach((header, index) => {
            if (header && fileState.variables.includes(header)) {
              // Ensure value is string
              rowData[header] = rowValues[index] !== undefined ? String(rowValues[index]) : "";
            }
          });

          // Ensure all variables exist in row
          fileState.variables.forEach(v => {
            if (rowData[v] === undefined) rowData[v] = "";
          });

          newRows.push(rowData);
        }

        // Append new rows to existing data
        setData(prev => [...prev, ...newRows]);

      } catch (error) {
        console.error("Error parsing Excel file:", error);
        showAlert("Format Excel Tidak Valid", "Gagal membaca file Excel. Pastikan format file valid dan tidak rusak.", "error");
      }

      // Reset input
      if (xlsxInputRef.current) {
        xlsxInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  const performGeneration = async () => {
    setIsGenerating(true);
    try {
      if (data.length === 1 && data[0]) {
        // Single file download
        const firstRow = data[0];
        const blob = generateDocx(fileState.templateBuffer!, firstRow);
        const filename =
          filenameTemplate.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => firstRow[key] || "1") ||
          "dokumen.docx";
        downloadDocx(blob, filename);
      } else {
        // Multiple files - ZIP download
        await generateZip(fileState.templateBuffer!, data, filenameTemplate);
      }
    } catch (error) {
      console.error("Error generating documents:", error);
      showAlert("Gagal Membuat Dokumen", "Terjadi kesalahan saat membuat dokumen. Silakan coba lagi.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAndDownload = async () => {
    if (!fileState.templateBuffer || data.length === 0) {
      showAlert("Data Belum Lengkap", "Harap unggah template dan tambahkan data sebelum membuat dokumen.", "info");
      return;
    }

    // Validate all rows have data
    const emptyRows = data.filter((row) => {
      return fileState.variables.some((v) => !row[v] || row[v].trim() === "");
    });

    if (emptyRows.length > 0) {
      showAlert(
        "Data Tidak Lengkap",
        "Beberapa baris memiliki kolom kosong. Apakah Anda yakin ingin melanjutkan pembuatan dokumen?",
        "confirm",
        performGeneration
      );
      return;
    }

    performGeneration();
  };

  return (
    <>
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:px-12 lg:px-20 flex flex-col gap-10">
        {!fileState.file ? (
          <UploadSection
            onUpload={handleFileInputChange}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        ) : (
          <>
            <FileStatusSection
              fileState={fileState}
              onRemoveFile={handleRemoveFile}
              filenameTemplate={filenameTemplate}
              onFilenameTemplateChange={setFilenameTemplate}
              onDownloadTemplate={handleDownloadXlsxTemplate}
              onUploadXlsx={handleUploadXlsx}
              xlsxInputRef={xlsxInputRef}
            />

            <DataGridSection
              data={data}
              variables={fileState.variables}
              onCellChange={handleCellChange}
              onDeleteRow={handleDeleteRow}
            />

            <ActionFooter
              onAddRow={handleAddRow}
              onGenerate={handleGenerateAndDownload}
              isGenerating={isGenerating}
              dataCount={data.length}
            />
          </>
        )}
      </main>

      <NoVariablesDialog
        isOpen={showNoVariablesModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowNoVariablesModal(false);
          }
        }}
      />

      <AlertDialog
        state={alertState}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
