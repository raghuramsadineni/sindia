import { supabase } from "./supabase";

const schema = 'public';
const tableName = 'media';
const bucketName = 'sindia';
const gallery = 'gallery';

export interface Image {
    id?: string;
    filename: string;
    public_url: string;
    sort_order: number;
    category: string;
}

export const getImages = async () => {
    return await supabase.schema(schema).from(tableName).select('*').eq('category', gallery);
}

export const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage.from(bucketName).upload(`${gallery}/${file.name}`, file);
    if (error) {
        throw error;
    }
    return data;
}

export const getImagePublicUrl = async (path) => {
    const { data } = await supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
}

export const getMaxSortOrder = async () => {
    const { data, error } = await supabase.schema(schema).from(tableName).select('sort_order').eq('category', gallery).order('sort_order', { ascending: false }).limit(1);
    if (error) {
        throw error;
    }
    const max_sort_order = data[0]?.sort_order ?? 0;
    return max_sort_order;
}

export const insertImage = async (image:Image) => {
    const { data, error } = await supabase.schema(schema).from(tableName).insert(image);
    if (error) {
        throw error;
    }
    return data;
}