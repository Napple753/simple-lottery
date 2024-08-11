// index.js
import { en } from "./en";
import { ja } from "./ja";

export const defaultLocale = "ja";

export const languages = {
  en,
  ja,
};

export function detectLanguage(): string {
  if (["ja", "ja-JP"].includes(navigator.language)) {
    return "ja";
  } else {
    //fallback
    return "en";
  }
}
