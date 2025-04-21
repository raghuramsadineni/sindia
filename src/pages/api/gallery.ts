import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const bucketName = 'public/sindia';
const folderPath = '';

export const GET: APIRoute = async ({ request }) => {
    const supabase = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY)
    console.log(supabase)
    const res = await supabase
        .storage
        .listBuckets()
    console.log(res)
    // if (error) {
    //     return new Response(
    //         JSON.stringify({
    //             message: error.message,
    //         }), { status: 500, headers: { "Content-Type": "application/json" } })
    // }
    return new Response(
        JSON.stringify({
            message: "Hello from the API route!",
        }), { status: 200, headers: { "Content-Type": "application/json" } })
} 