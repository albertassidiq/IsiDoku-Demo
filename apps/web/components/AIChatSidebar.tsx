"use client";

import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, X, ChevronLeft, Sparkles, ChevronDown, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { GEMINI_MODELS, DEFAULT_GEMINI_MODEL, type GeminiModel } from "@/lib/gemini-models";

// Monkey-patch global fetch to intercept /api/chat requests
const originalFetch = globalThis.fetch;
let currentModelId = DEFAULT_GEMINI_MODEL;

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : String(input);

    // Intercept /api/chat requests and inject modelId
    if (url.includes('/api/chat') && init?.body) {
        try {
            const body = JSON.parse(init.body as string);
            if (!body.modelId) {
                body.modelId = currentModelId;
                init.body = JSON.stringify(body);
            }
        } catch (e) {
            // Body is not JSON, continue with original
        }
    }

    return originalFetch(input, init);
};

interface AIChatSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onSopGenerated?: (data: any) => void;
}

export function AIChatSidebar({ isOpen, onToggle, onSopGenerated }: AIChatSidebarProps) {
    const [input, setInput] = useState('');
    const [selectedModel, setSelectedModel] = useState(DEFAULT_GEMINI_MODEL);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Initialize apiKey from localStorage
    useEffect(() => {
        const storedKey = localStorage.getItem('isiDoku_geminiApiKey');
        if (storedKey) setApiKey(storedKey);
    }, []);

    // Save apiKey to localStorage
    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newKey = e.target.value;
        setApiKey(newKey);
        localStorage.setItem('isiDoku_geminiApiKey', newKey);
    };

    const { messages, sendMessage, status, error } = useChat({});

    // Monkey-patch global fetch to intercept /api/chat requests (Updated to include apiKey)
    useEffect(() => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : String(input);

            // Intercept /api/chat requests and inject modelId AND apiKey
            if (url.includes('/api/chat') && init?.body) {
                try {
                    const body = JSON.parse(init.body as string);

                    // Inject modelId if missing
                    if (!body.modelId) {
                        body.modelId = currentModelId;
                    }

                    // Inject apiKey if missing and available in state (captured via closure/ref if needed, 
                    // but since we passed body to useChat, it should already be there. 
                    // However, useChat options might not update dynamically in Vercel AI SDK versions.
                    // Let's ensure it's injected.)
                    if (!body.apiKey && apiKey) {
                        body.apiKey = apiKey;
                    }

                    init.body = JSON.stringify(body);
                } catch (e) {
                    // Body is not JSON, continue with original
                }
            }
            return originalFetch(input, init);
        };

        return () => {
            globalThis.fetch = originalFetch;
        };
    }, [apiKey]); // Re-run if apiKey changes to ensure closure captures latest key

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Store current model for use in handleSubmit
    const modelRef = useRef(selectedModel);

    const isLoading = status === 'streaming' || status === 'submitted';

    // Update ref when model changes
    useEffect(() => {
        modelRef.current = selectedModel;
        currentModelId = selectedModel;
    }, [selectedModel]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsModelDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey) {
            setIsSettingsOpen(true);
            toast.error("Silakan masukkan Google Gemini API Key Anda terlebih dahulu.");
            return;
        }

        if (!input.trim() || isLoading) return;
        sendMessage({ text: input });
        setInput('');
    };

    // Helper function to extract text from message parts
    const getMessageText = (message: typeof messages[0]) => {
        return message.parts
            .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
            .map(part => part.text)
            .join('');
    };

    // Handle tool invocations (AI SDK v6 uses message.parts with tool-{toolName} types)
    const processedToolCallIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant') return;

        // AI SDK v6: Tool calls are in message.parts with type 'tool-{toolName}'
        lastMessage.parts.forEach((part: any) => {
            const isGenerateSopTool =
                part.type === 'tool-generateSop' ||
                (part.type === 'tool-call' && part.toolName === 'generateSop');

            if (isGenerateSopTool) {
                const toolCallId = part.toolCallId || `tool-${Date.now()}`;
                if (processedToolCallIds.current.has(toolCallId)) return;

                // Try both 'input' and 'args' properties
                const toolArgs = part.input || part.args || {};

                // state can be 'partial-call' | 'call' | 'output-available' | 'output-error'
                if (part.state === 'output-available' || part.state === 'call' || !part.state) {
                    if (onSopGenerated) {
                        // New format: sopData is a JSON string
                        if (toolArgs.sopData && typeof toolArgs.sopData === 'string') {
                            try {
                                const parsedData = JSON.parse(toolArgs.sopData);
                                console.log("Applying SOP from AI tool call (parsed JSON)");
                                onSopGenerated(parsedData);
                                processedToolCallIds.current.add(toolCallId);
                            } catch (e) {
                                console.error("Failed to parse sopData JSON:", e);
                            }
                        }
                        // Legacy format: direct object properties
                        else if (Object.keys(toolArgs).length > 0) {
                            console.log("Applying SOP from AI tool call (direct object)");
                            onSopGenerated(toolArgs);
                            processedToolCallIds.current.add(toolCallId);
                        }
                    }
                }
            }
        });
    }, [messages, onSopGenerated]);

    return (
        <>
            {/* Block overlay during AI generation - prevents accidental clicks */}
            {isLoading && (
                <div
                    className="fixed inset-0 bg-black/30 z-[9999] flex items-center justify-center"
                    style={{ backdropFilter: 'blur(2px)' }}
                    onClick={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className="bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                        </div>
                        <span className="font-medium">AI sedang bekerja...</span>
                    </div>
                </div>
            )}

            {/* Toggle Button (Visible when closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed right-0 top-1/2 -translate-y-1/2 bg-black text-white p-2 border-2 border-black rounded-l-sm hover:bg-white hover:text-black transition-colors z-[50]"
                    title="Buka Asisten AI"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Sidebar Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full bg-white border-l-4 border-black transition-all duration-300 ease-in-out z-[100] flex flex-col shadow-[-10px_0px_20px_rgba(0,0,0,0.1)]",
                    isOpen ? "w-[400px] translate-x-0" : "w-[400px] translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-1 rounded-sm">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="font-black text-lg tracking-tight uppercase">Asisten AI</h2>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={cn("p-1 mr-2 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-sm transition-colors", !apiKey && "text-red-500 animate-pulse")}
                            title="Pengaturan API Key"
                        >
                            <Settings className="w-6 h-6" />
                        </button>
                        <button
                            onClick={onToggle}
                            className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black rounded-sm transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* API Key Settings Panel */}
                {isSettingsOpen && (
                    <div className="p-4 bg-yellow-50 border-b-2 border-black">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                            Google Gemini API Key (Required)
                        </label>
                        <input
                            type="password"
                            placeholder="Paste your API Key here..."
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            className="w-full p-2 border-2 border-black rounded-sm font-mono text-xs mb-2"
                        />
                        <div className="text-[10px] text-gray-500">
                            Key disimpan di browser Anda (Local Storage). <br />
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline font-bold">Dapatkan API Key di sini</a>
                        </div>
                    </div>
                )}


                {/* Model Selector */}
                <div className="p-3 border-b-2 border-black bg-gray-50" ref={dropdownRef}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                        Model AI
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="w-full flex items-center justify-between p-2 bg-white border-2 border-black rounded-sm hover:bg-gray-50 transition-colors text-left"
                            disabled={isLoading}
                        >
                            <span className="text-sm font-medium truncate">
                                {GEMINI_MODELS.find(m => m.id === selectedModel)?.name || 'Select Model'}
                            </span>
                            <ChevronDown className={cn(
                                "w-4 h-4 transition-transform",
                                isModelDropdownOpen && "rotate-180"
                            )} />
                        </button>

                        {isModelDropdownOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-black rounded-sm shadow-lg max-h-[300px] overflow-y-auto">
                                {GEMINI_MODELS.map((model) => {
                                    const isLocked = model.id.startsWith('gemini-3-');
                                    return (
                                        <button
                                            key={model.id}
                                            type="button"
                                            onClick={() => {
                                                if (!isLocked) {
                                                    setSelectedModel(model.id);
                                                    setIsModelDropdownOpen(false);
                                                }
                                            }}
                                            disabled={isLocked}
                                            className={cn(
                                                "w-full text-left p-2 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 relative",
                                                selectedModel === model.id && "bg-gray-100 font-bold",
                                                isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                            )}
                                        >
                                            <div className="text-sm font-medium">{model.name}</div>
                                            <div className="text-xs text-gray-500 truncate">{model.description}</div>
                                            {isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-sm">
                                                    <span className="text-xs font-bold text-black bg-gray-200 px-2 py-1 rounded">LOCKED</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 opacity-60">
                            <Bot className="w-16 h-16" />
                            <div className="max-w-[250px]">
                                <p className="font-bold text-black mb-1">HALO!</p>
                                <p className="text-sm">Saya dapat membantu Anda membuat SOP. Tanyakan saja untuk membuat langkah-langkah atau memberikan saran perbaikan.</p>
                                {!apiKey && (
                                    <p className="text-xs text-red-500 font-bold mt-2">
                                        ⚠️ Masukkan API Key di pengaturan (⚙️) untuk memulai.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border-2 border-red-500 rounded-sm text-red-700 text-sm">
                            Kesalahan: {error.message}
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex gap-3 max-w-[90%]",
                                m.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-sm border-2 border-black flex items-center justify-center shrink-0",
                                    m.role === "user" ? "bg-black text-white" : "bg-white text-black"
                                )}
                            >
                                {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            {getMessageText(m) && (
                                <div
                                    className={cn(
                                        "p-3 rounded-sm border-2 border-black text-sm font-medium",
                                        m.role === "user"
                                            ? "bg-black text-white rounded-tr-none whitespace-pre-wrap"
                                            : "bg-white text-black rounded-tl-none prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-2"
                                    )}
                                >
                                    {m.role === "user" ? (
                                        getMessageText(m)
                                    ) : (
                                        <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-sm border-2 border-black flex items-center justify-center shrink-0 bg-white text-black">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="p-3 rounded-sm border-2 border-black bg-white rounded-tl-none flex items-center gap-1">
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t-2 border-black bg-white">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="flex-1 p-3 border-2 border-black rounded-sm font-mono text-sm outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 resize-none overflow-hidden"
                            placeholder="Ketik pesan... (Shift+Enter untuk baris baru)"
                            rows={1}
                            style={{ minHeight: '44px', maxHeight: '150px' }}
                            disabled={!apiKey}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input || !apiKey}
                            className="bg-black text-white p-3 border-2 border-black rounded-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="mt-2 text-[10px] text-gray-400 font-mono text-center uppercase tracking-widest">
                        AI dapat membuat kesalahan. Periksa hasil yang dihasilkan.
                    </div>
                </div>
            </div>
        </>
    );
}
