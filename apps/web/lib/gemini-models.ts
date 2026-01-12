// Available Gemini models for SOP Builder
export interface GeminiModel {
    id: string;
    name: string;
    description: string;
    category: 'latest' | 'stable' | 'experimental' | 'budget';
}

export const GEMINI_MODELS: GeminiModel[] = [
    // Gemini 3 Series (Latest - Nov/Dec 2025)
    {
        id: 'gemini-3-pro-preview',
        name: 'Gemini 3 Pro Preview',
        description: 'Most intelligent model - best for complex reasoning and multimodal tasks',
        category: 'latest'
    },
    {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3 Flash Preview',
        description: 'Fast and intelligent - combines frontier intelligence with superior speed',
        category: 'latest'
    },

    // Gemini 2.5 Series (Stable - Best Price-Performance)
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Best price-performance - recommended for SOP Builder (default)',
        category: 'stable'
    },
    {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        description: 'Fastest & most cost-efficient - optimized for high throughput',
        category: 'budget'
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Advanced thinking model - best for complex reasoning tasks',
        category: 'stable'
    },

    // Gemini 2.0 Series (Previous Generation)
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Second generation workhorse with 1M token context',
        category: 'stable'
    },
    {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        description: 'Cost-efficient second generation model',
        category: 'budget'
    },
];

// Default model for SOP Builder
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

// Helper function to get model by ID
export function getGeminiModel(modelId: string): GeminiModel | undefined {
    return GEMINI_MODELS.find(m => m.id === modelId);
}

// Helper function to get models by category
export function getGeminiModelsByCategory(category: GeminiModel['category']): GeminiModel[] {
    return GEMINI_MODELS.filter(m => m.category === category);
}
