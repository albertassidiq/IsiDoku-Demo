import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface VariableMap {
  [key: string]: string;
}

/**
 * Extract variables from a DOCX file
 * Pattern: {variableName}
 * Returns variables in the order they first appear in the document
 */
export async function extractVariablesFromDocx(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = new PizZip(arrayBuffer);

  // Get the document.xml content
  const docXml = zip.file("word/document.xml")?.asText() || "";

  // Regex to find variables in the format {variableName}
  const regex = /\{([a-zA-Z0-9_]+)\}/g;
  const matches = docXml.match(regex);

  if (!matches) {
    return [];
  }

  // Extract variable names without braces, keeping order of first appearance
  const seen = new Set<string>();
  const variables: string[] = [];

  for (const match of matches) {
    const variableName = match.replace(/[{}]/g, "");
    if (!seen.has(variableName)) {
      seen.add(variableName);
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Generate a single DOCX document from template
 */
export function generateDocx(
  templateBuffer: ArrayBuffer,
  data: VariableMap
): Blob {
  const zip = new PizZip(templateBuffer);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.setData(data);
  doc.render();

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  return blob;
}

/**
 * Generate multiple DOCX documents and create a ZIP file
 */
export async function generateZip(
  templateBuffer: ArrayBuffer,
  dataList: VariableMap[],
  filenameTemplate?: string
): Promise<void> {
  const zip = new JSZip();

  const seenFilenames = new Map<string, number>();

  dataList.forEach((data, index) => {
    const docBlob = generateDocx(templateBuffer, data);

    // Generate filename based on template or index
    let filename = `document_${index + 1}.docx`;

    if (filenameTemplate) {
      // Replace variables in filename template
      filename = filenameTemplate.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
        return data[key] || `_${index + 1}`;
      });

      // Ensure .docx extension
      if (!filename.endsWith(".docx")) {
        filename += ".docx";
      }
    }

    // Handle string duplication
    if (seenFilenames.has(filename)) {
      const count = seenFilenames.get(filename)! + 1;
      seenFilenames.set(filename, count);

      // Insert number before extension
      const extensionIndex = filename.lastIndexOf(".");
      if (extensionIndex !== -1) {
        filename = `${filename.substring(0, extensionIndex)} (${count})${filename.substring(extensionIndex)}`;
      } else {
        filename = `${filename} (${count})`;
      }
    } else {
      seenFilenames.set(filename, 0);
    }

    zip.file(filename, docBlob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "documents.zip");
}

/**
 * Download a single DOCX file
 */
export function downloadDocx(blob: Blob, filename: string = "document.docx"): void {
  saveAs(blob, filename);
}
