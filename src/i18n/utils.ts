import { ui, defaultLang } from './ui';

export const getLangFromUrl = (url: URL) => {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const useTranslations = (lang: keyof typeof ui) => {
    return function t(key: any) {
        return getNestedValue(ui[lang], key) || getNestedValue(ui[defaultLang], key);
    }
}