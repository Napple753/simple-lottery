import { createApp } from "vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

import { createI18n } from "vue-i18n";
import App from "@/App.vue";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
import { languages, detectLanguage } from "./i18n/index";
const messages = Object.assign(languages);

const i18n = createI18n({
  legacy: false,
  locale: detectLanguage(),
  fallbackLocale: "en",
  messages,
});

createApp(App).use(i18n).use(vuetify).mount("#app");

//eslint-disable-next-line
//@ts-ignore
document.title = i18n.global.t("app-name") || document.title;
