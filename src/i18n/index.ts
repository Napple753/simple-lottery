// index.js
import { en } from "./en";
import { ja } from "./ja";

export const languages = {
  en,
  ja,
};

export type language_id = keyof typeof languages;

export const language_names: { id: language_id; title: string }[] = [
  { id: "en", title: "English" },
  { id: "ja", title: "日本語" },
];

export function detectLanguage(): language_id {
  if (["ja", "ja-JP"].includes(navigator.language)) {
    return "ja";
  } else {
    //fallback
    return "en";
  }
}
