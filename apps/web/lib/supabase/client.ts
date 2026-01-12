import { createBrowserClient } from '@supabase/ssr'

export function createClient(supabaseAccessToken?: string) {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: supabaseAccessToken
                    ? { Authorization: `Bearer ${supabaseAccessToken}` }
                    : {},
            },
        }
    )
}
