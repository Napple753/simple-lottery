import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "@/App.vue";

import { languages } from "./i18n/index";
import { defaultLocale } from "./i18n/index";
const messages = Object.assign(languages);

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: "en",
  messages,
});

createApp(App).use(i18n).mount("#app");

//eslint-disable-next-line
//@ts-ignore
document.title = i18n.global.t("app-name") || document.title;
