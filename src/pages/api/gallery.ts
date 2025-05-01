import type { APIRoute } from "astro";
import { getImagePublicUrl, getImages, getMaxSortOrder, insertImage, uploadImage } from "../../lib/data";

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

    return new Response(
        JSON.stringify(data.sort((a, b) => a.sort_order - b.sort_order)), { status: 200, headers: { "Content-Type": "application/json" } })
}

export const POST: APIRoute = async ({ request, redirect }) => {
    const formData = await request.formData();

    const files = formData.getAll('gallery') as File[];
    try {
        for (const file of files) {
            const image = await uploadImage(file);
            const publicUrl = await getImagePublicUrl(image.path);
            const sort_order = await getMaxSortOrder();

            const imageData = {
                filename: file.name,
                public_url: publicUrl,
                sort_order: sort_order + 1,
                category: 'gallery'
            };
            await insertImage(imageData);
        }
        return redirect('/en/dashboard?success=Files uploaded successfully!!!');
    }
    catch (error) {
        return redirect('/en/dashboard?error=Failed to upload files!!!');
    }
}