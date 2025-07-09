<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { PartyPlans } from "@/Schema";
import { readAnyEncoding } from "@/logic/readAnyEncoding";
import { parse as JSONCParse } from "jsonc-parser";
import { VFileInput } from "vuetify/components";
import { useI18n } from "vue-i18n";
import { ZodError } from "zod";
import MarkedText from "@/components/MarkedText.vue";
import { useMarkdownStore } from "@/store/markdown";
import { useReviveCancelledStore } from "@/store/reviveCancelled";
const { t, locale } = useI18n();
const markdownStore = useMarkdownStore();
const redrawCancelled = useReviveCancelledStore();

const emit = defineEmits<{
  (e: "loadSettings", settings: PartyPlans): void;
}>();
const settings: Ref<PartyPlans | null> = ref(null);
const partyPlanFile: Ref<File | File[] | null | undefined> = ref(null);
const errorMessage: Ref<string | null> = ref(null);
const displayingErrorMessage: Ref<boolean> = ref(false);

watch(errorMessage, (newValue) => {
  displayingErrorMessage.value = newValue !== null;
});

function loadSampleProgram() {
  partyPlanFile.value = null;

  const sampleProgramUrl =
    locale.value === "ja"
      ? import.meta.env.BASE_URL + "sample_setting_url.ja.jsonc"
      : import.meta.env.BASE_URL + "sample_setting_url.jsonc";

  fetch(sampleProgramUrl)
    .then((res) => res.text())
    .then((res) => loadPartyPlan(res));
}

async function parsePartyPlanFile(jsoncText: string): Promise<PartyPlans> {
  const jsoncObj = await JSONCParse(jsoncText);
  const partyPlan = PartyPlans.parse(jsoncObj);

  partyPlan.program.forEach((program) => {
    if (program.type === "PRIZE") {
      if (
        program.sub_prize_names &&
        program.sub_prize_names.length !== program.winner_number
      ) {
        throw new Error("sub_prize_names");
      }
    }
  });

  return partyPlan;
}

async function loadPartyPlan(jsoncText: string, files?: File[]) {
  errorMessage.value = null;
  try {
    const partyPlan = await parsePartyPlanFile(jsoncText);
    settings.value = await replaceFileNameToDataURL(partyPlan, files || []);
  } catch (e) {
    if (
      e instanceof ZodError ||
      (e instanceof Error && e.message === "sub_prize_names")
    ) {
      errorMessage.value = t("plan-file-invalid");
      partyPlanFile.value = null;
      settings.value = null;
    } else {
      throw e;
    }
  }

  if (settings.value?.markdown) {
    markdownStore.enableMarkdown();
  } else {
    markdownStore.disableMarkdown();
  }

  if (settings.value?.revive_cancelled) {
    redrawCancelled.enableReviveCancelled();
  } else {
    redrawCancelled.disableReviveCancelled();
  }
}

async function replaceFileNameToDataURL(
  setting: PartyPlans,
  files: File[],
): Promise<PartyPlans> {
  const replacedSetting = JSON.parse(JSON.stringify(setting)) as PartyPlans;

  for (const program of replacedSetting.program) {
    if (program.type === "PRIZE" && program.img) {
      const file = files.find((f) => f.name === program.img);
      if (file) {
        const reader = new FileReader();
        const dataURL = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        program.img = dataURL;
      }
    }
  }
  return replacedSetting;
}
async function loadProgramFile(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  if (inputElement.files === null || inputElement.files.length === 0) {
    partyPlanFile.value = null;
    settings.value = null;
    return;
  }
  const setting_files = Array.from(inputElement.files).filter(
    (f) => f.name.endsWith(".jsonc") || f.name.endsWith(".json"),
  );
  const image_files = Array.from(inputElement.files).filter(
    (f) => !(f.name.endsWith(".jsonc") || f.name.endsWith(".json")),
  );

  if (setting_files.length === 0) {
    errorMessage.value = t("plan-file-needed");
    partyPlanFile.value = null;
    settings.value = null;
    return;
  } else if (setting_files.length > 1) {
    errorMessage.value = t("plan-file-must-be-only-one");
    partyPlanFile.value = null;
    settings.value = null;
    return;
  }

  const file = setting_files[0];

  const reader = new FileReader();
  reader.addEventListener("load", async () => {
    const res = readAnyEncoding(reader);

    loadPartyPlan(res as string, image_files);
  });
  reader.readAsArrayBuffer(file);
}

function nextProgram() {
  if (settings.value === null) return;
  emit("loadSettings", settings.value);
}

function downloadSample() {
  const link = document.createElement("a");
  link.download = "sample_setting.jsonc"; //filename for download dialog
  if (locale.value === "ja") {
    link.href = import.meta.env.BASE_URL + "sample_setting.ja.jsonc";
  } else {
    link.href = import.meta.env.BASE_URL + "sample_setting.jsonc";
  }
  link.click();
}
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <v-file-input
        :label="$t('party-plan-file')"
        accept=".jsonc,.json,image/*"
        v-model="partyPlanFile"
        @change="loadProgramFile"
        ref="inputPartyPlan"
        multiple
      ></v-file-input>
      <v-row justify="start">
        <v-col cols="auto">{{ $t("or-you-can") }}</v-col>
        <v-col cols="auto">
          <v-btn @click="loadSampleProgram">{{ $t("use-sample") }}</v-btn>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn @click="downloadSample">{{ $t("download-sample") }}</v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="programPreview" v-if="settings">
      <table>
        <caption style="font-weight: 800">
          {{
            settings.program_name
          }}
        </caption>
        <tr>
          <th colspan="2"></th>
          <th>{{ $t("winner-s") }}</th>
          <th>{{ $t("time-before-first-winner-s") }}</th>
          <th>{{ $t("time-between-winners-s") }}</th>
        </tr>
        <template v-for="(program, i) in settings?.program" :key="i">
          <tr v-if="program.type == 'MESSAGE'">
            <td colspan="5">
              <MarkedText :markdown="program.message"></MarkedText>
            </td>
          </tr>
          <tr v-if="program.type == 'PRIZE'">
            <td>
              <img
                v-if="program.img"
                :src="program.img"
                style="max-height: 2em"
              />
            </td>
            <td>
              <MarkedText :markdown="program.prize_name"></MarkedText>
            </td>
            <td style="text-align: right">{{ program.winner_number }}</td>
            <td style="text-align: right">
              {{
                (program.time_before_first_winner ??
                  settings.time_before_first_winner) / 1000
              }}
            </td>
            <td style="text-align: right">
              {{
                (program.time_between_winners ??
                  settings.time_between_winners) / 1000
              }}
            </td>
          </tr>
          <tr v-if="program.type == 'DISPLAY_WINNERS'">
            <td colspan="5">({{ $t("list-up-winners") }})</td>
          </tr>
        </template>
      </table>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram" v-show="settings !== null">{{
        $t("next")
      }}</v-btn>
    </div>
  </div>
  <v-snackbar v-model="displayingErrorMessage" color="red accent-2">
    {{ errorMessage }}
  </v-snackbar>
</template>

<style scoped>
table {
  border-collapse: collapse;
  border: 1px solid lightgray;
}

tr,
td,
th {
  border: 1px solid lightgray;
}

td,
th {
  padding: 0 1rem;
}

tr:first-of-type {
  background: white;
  position: sticky;
  top: -1rem;
}
</style>
