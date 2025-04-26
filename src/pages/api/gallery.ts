import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

const bucketName = 'public/sindia';
const folderPath = '';

const getImages = async () => {
    return await supabase.schema('public').from('media').select('*').eq('category', 'gallery');
}

export const GET: APIRoute = async ({ request }) => {

    const { data, error } = await getImages();
    if (error) {
        console.error('Error fetching images:', error);
        return new Response(
            JSON.stringify({
                message: "Error fetching images",
                error: error.message,
            }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
    console.log('Fetched images:', data);

    return new Response(
        JSON.stringify({
            message: "Hello from the API route!",
        }), { status: 200, headers: { "Content-Type": "application/json" } })
} 

export const POST: APIRoute = async ({ request }) => {
    console.log(request.body);

    const formData = await request.formData();
    console.log(formData);
    
    return new Response();
}