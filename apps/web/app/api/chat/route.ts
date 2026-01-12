import {
    type UIMessage,
    convertToModelMessages,
    streamText,
    tool,
} from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

// Create Google Gemini provider
// Google client is now initialized per-request to support dynamic API Keys

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define tools using the tool() helper with inputSchema
const tools = {
    generateSop: tool({
        description: 'Generate a complete SOP (Standard Operating Procedure) flowchart diagram. Call this tool when user asks to create an SOP.',
        inputSchema: z.object({
            pelaksanaColumns: z.array(z.object({
                id: z.string(),
                name: z.string()
            })).optional().default([]),
            rows: z.array(z.object({
                id: z.string(),
                no: z.number(),
                activity: z.string(),
                kelengkapan: z.string().optional().or(z.null()),
                waktu: z.string().optional().or(z.null()),
                output: z.string().optional().or(z.null()),
                keterangan: z.string().optional().or(z.null())
            })).optional().default([]),
            shapes: z.array(z.object({
                rowId: z.string(),
                colId: z.string(),
                type: z.string(),
                label: z.string().optional().or(z.null())
            })).optional().default([]),
            connections: z.array(z.object({
                fromRowId: z.string(),
                fromColId: z.string(),
                fromPos: z.string().optional(), // Position might be omitted by model
                toRowId: z.string(),
                toColId: z.string(),
                toPos: z.string().optional(),   // Position might be omitted by model
                label: z.string().optional().or(z.null())
            })).optional().default([])
        }),
        execute: async (args) => {
            return { success: true, message: "SOP generated successfully" };
        }
    })
};

const systemPrompt = `Kamu adalah AI pembuat Standard Operating Procedure (SOP) dalam format tabel flowchart.

PERATURAN PENTING:
1. KETIKA USER MINTA BUATKAN/MODIFIKASI SOP:
   - JAWAB DULU dengan sopan (contoh: "Baik, saya akan buatkan...", "Tentu, saya update bagian...").
   - LALU PANGGIL TOOL generateSop.
   - JANGAN PERNAH hanya memanggil tool tanpa teks pengantar.
   - JANGAN PERNAH mengeluarkan output "data", JSON mentah, atau debugging text.

2. PANGGIL TOOL generateSop dengan data lengkap sesuai permintaan.

STRUKTUR DATA:
- pelaksanaColumns: array role/pelaksana [{id: "c1", name: "Karyawan"}, ...]
- rows: array baris aktivitas [{id: "r1", no: 1, activity: "Deskripsi", kelengkapan: "", waktu: "", output: "", keterangan: ""}, ...]
- shapes: array shapes [{rowId: "r1", colId: "c1", type: "terminator|process|decision|document", label: "Label"}, ...]
- connections: array koneksi [{fromRowId: "r1", fromColId: "c1", fromPos: "top|right|bottom|left", toRowId: "r2", toColId: "c1", toPos: "top|right|bottom|left", label: "optional"}, ...]

SHAPE TYPES:
- terminator (kapsul/pill): HANYA untuk MULAI dan SELESAI
- process (kotak/rectangle): untuk aktivitas biasa - WAJIB punya koneksi keluar ke shape lain
- decision (diamond): untuk keputusan Ya/Tidak - WAJIB punya 2 koneksi keluar
- document: untuk dokumen - WAJIB punya koneksi keluar ke shape lain

ATURAN WAJIB:
1. Shape PERTAMA harus terminator dengan label "Mulai"
2. Shape TERAKHIR harus terminator dengan label "Selesai" 
3. Shape process, decision, dan document TIDAK BOLEH menjadi shape terakhir - harus ada koneksi ke shape berikutnya
4. SETIAP shape (kecuali terminator "Selesai") WAJIB punya minimal 1 koneksi keluar
5. Decision (diamond) WAJIB punya TEPAT 2 koneksi keluar: satu untuk "Ya", satu untuk "Tidak"

CONTOH PANGGIL TOOL:
generateSop({
  pelaksanaColumns: [{id: "c1", name: "Karyawan"}, {id: "c2", name: "Atasan"}],
  rows: [
    {id: "r1", no: 1, activity: "Mulai proses", kelengkapan: "-", waktu: "-", output: "-", keterangan: ""},
    {id: "r2", no: 2, activity: "Melakukan aktivitas", kelengkapan: "Form", waktu: "10 menit", output: "Hasil", keterangan: ""},
    {id: "r3", no: 3, activity: "Selesai", kelengkapan: "-", waktu: "-", output: "-", keterangan: ""}
  ],
  shapes: [
    {rowId: "r1", colId: "c1", type: "terminator", label: "Mulai"},
    {rowId: "r2", colId: "c1", type: "process", label: "Aktivitas"},
    {rowId: "r3", colId: "c1", type: "terminator", label: "Selesai"}
  ],
  connections: [
    {fromRowId: "r1", fromColId: "c1", fromPos: "bottom", toRowId: "r2", toColId: "c1", toPos: "top"},
    {fromRowId: "r2", fromColId: "c1", fromPos: "bottom", toRowId: "r3", toColId: "c1", toPos: "top"}
  ]
})

Jawab dalam bahasa Indonesia.`;

export async function POST(req: Request) {
    const { messages, modelId, apiKey }: { messages: UIMessage[], modelId?: string, apiKey?: string } = await req.json();

    const selectedModel = modelId || 'gemini-2.0-flash';

    // Use user provided API Key, or fallback to server env var (only if not strictly enforced, but here we favor user key)
    const effectiveApiKey = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!effectiveApiKey) {
        return new Response("Missing API Key. Please provide a Google Gemini API Key.", { status: 401 });
    }

    const google = createGoogleGenerativeAI({
        apiKey: effectiveApiKey,
    });

    const result = streamText({
        model: google(selectedModel),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        tools,
        maxSteps: 10, // Allow multi-step interactions to resolve tool calls
    } as any); // Cast to any to avoid type error with maxSteps

    return result.toUIMessageStreamResponse();
}
