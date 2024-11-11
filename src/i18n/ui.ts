import en from "./en.json";
import it from "./it.json";

export const languages = {
    en: 'English',
    it: 'Italiano',
};

export const defaultLang = 'en';

export const ui = {
    en: en,
    it: it,
} as const;

export const showDefaultLang = false;