"use client";

import { useCallback } from "react";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { PDFDocument } from "pdf-lib";

export interface UsePDFExportProps {
    documentRef: React.RefObject<HTMLDivElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    uploadedPdf: File | null;
    setUploadedPdf: React.Dispatch<React.SetStateAction<File | null>>;
}

export interface UsePDFExportReturn {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearUploadedPdf: () => void;
    downloadPDF: () => Promise<void>;
    exportToPDF: () => void;
}

/**
 * Hook for PDF export and file upload functionality
 */
export function usePDFExport({
    documentRef,
    fileInputRef,
    uploadedPdf,
    setUploadedPdf,
}: UsePDFExportProps): UsePDFExportReturn {

    // Handle file upload
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setUploadedPdf(file);
        }
    }, [setUploadedPdf]);

    // Clear uploaded PDF
    const clearUploadedPdf = useCallback(() => {
        setUploadedPdf(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [setUploadedPdf, fileInputRef]);

    // Export to PDF using html-to-image and jspdf
    const downloadPDF = useCallback(async () => {
        if (!documentRef.current) return;

        try {
            const element = documentRef.current;

            // Save original styles
            const originalStyle = {
                width: element.style.width,
                height: element.style.height,
                transform: element.style.transform,
            };

            const dataUrl = await toPng(element, {
                quality: 1.0,
                pixelRatio: 2, // Higher resolution
                backgroundColor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                }
            });

            // Restore style
            element.style.width = originalStyle.width;
            element.style.height = originalStyle.height;
            element.style.transform = originalStyle.transform;

            // Get actual element dimensions
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            // Convert pixels to mm (assuming 96 DPI: 1 inch = 25.4mm, 1 inch = 96px)
            const pxToMm = 25.4 / 96;
            const contentWidthMm = elementWidth * pxToMm;
            const contentHeightMm = elementHeight * pxToMm;

            // Determine orientation - if wider than tall, use landscape
            const isLandscape = contentWidthMm > contentHeightMm;

            // Use content size as page size, with some padding
            const padding = 10; // 10mm padding
            const pageWidth = contentWidthMm + (padding * 2);
            const pageHeight = contentHeightMm + (padding * 2);

            const pdf = new jsPDF({
                orientation: isLandscape ? "landscape" : "portrait",
                unit: "mm",
                format: [pageWidth, pageHeight], // Custom page size based on content
            });

            // Add image centered with padding
            pdf.addImage(dataUrl, "PNG", padding, padding, contentWidthMm, contentHeightMm);

            if (uploadedPdf) {
                try {
                    const sopPdfBytes = pdf.output('arraybuffer');
                    const sopPdfDoc = await PDFDocument.load(sopPdfBytes);

                    const uploadedPdfBytes = await uploadedPdf.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(uploadedPdfBytes);

                    const copiedPages = await pdfDoc.copyPages(sopPdfDoc, sopPdfDoc.getPageIndices());
                    copiedPages.forEach((page) => pdfDoc.addPage(page));

                    const mergedPdfBytes = await pdfDoc.save();
                    const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'sop-document-merged.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error("Error merging PDFs:", error);
                    alert("Gagal menggabungkan PDF. Pastikan file yang diupload valid.");
                    pdf.save("sop-document.pdf");
                }
            } else {
                pdf.save("sop-document.pdf");
            }

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Gagal mengunduh PDF. Silakan coba lagi.");
        }
    }, [documentRef, uploadedPdf]);

    // Export to PDF function - wrapper for downloadPDF
    const exportToPDF = useCallback(() => {
        downloadPDF();
    }, [downloadPDF]);

    return {
        handleFileUpload,
        clearUploadedPdf,
        downloadPDF,
        exportToPDF,
    };
}
