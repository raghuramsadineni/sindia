import en from "./en.json";
import it from "./it.json";

export const languages = {
    en: 'English',
    it: 'Italiano',
};

export const defaultLang = 'it';

export const ui = {
    en: en,
    it: it,
} as const;

export const showDefaultLang = false;