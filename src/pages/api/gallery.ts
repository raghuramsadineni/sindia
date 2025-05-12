import type { APIRoute } from "astro";
import { getImagePublicUrl, getImages, getMaxSortOrder, insertImage, updateImageOrder, uploadImage, type Image } from "../../lib/data";

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
        return redirect('/en/dashboard?success=Images uploaded successfully!!!');
    }
    catch (error) {
        return redirect('/en/dashboard?error=Failed to upload Images!!!');
    }
}

export const PUT: APIRoute = async ({ request }) => {
    const data = await request.json();

    try {
        data.forEach(async (image: Image) => {
            await updateImageOrder(image.id, image.sort_order);
        });


        return new Response(
            JSON.stringify({
                message: "Image order updated successfully",
                data: data,
            }), { status: 200, headers: { "Content-Type": "application/json" } })
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: "Error updating image order",
                error: error.message,
            }), { status: 500, headers: { "Content-Type": "application/json" } })
    }
}