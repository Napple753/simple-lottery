<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { PartyPlans } from "@/Schema";
import { readAnyEncoding } from "@/logic/readAnyEncoding";
import { parse as JSONCParse } from "jsonc-parser";
import { VFileInput } from "vuetify/components";
import { useI18n } from "vue-i18n";
import { ZodError } from "zod";
const { locale } = useI18n();

const emit = defineEmits<{
  (e: "loadSettings", settings: PartyPlans): void;
}>();
const settings: Ref<PartyPlans | null> = ref(null);
const partyPlanFile: Ref<File | File[] | null | undefined> = ref(null);
const partyFileInvalidSnackBar = ref(false);

function loadSampleProgram() {
  partyPlanFile.value = null;

  fetch(sampleProgramUrl.value)
    .then((res) => res.text())
    .then((res) => loadJSONCText(res));
}

async function loadJSONCText(jsoncText: string) {
  partyFileInvalidSnackBar.value = false;
  const loaded = await JSONCParse(jsoncText);
  try {
    PartyPlans.parse(loaded);
  } catch (e) {
    if (e instanceof ZodError) {
      partyFileInvalidSnackBar.value = true;
      partyPlanFile.value = null;
    }
    throw e;
  }
  settings.value = loaded;
}
async function loadProgramFile(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const res = readAnyEncoding(reader);

    inputElement.value = "";
    loadJSONCText(res as string);
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
  link.href = sampleProgramUrl.value;
  link.click();
}

const sampleProgramUrl = computed(() => {
  if (locale.value === "ja") {
    return import.meta.env.BASE_URL + "sample_setting.ja.jsonc";
  } else {
    return import.meta.env.BASE_URL + "sample_setting.jsonc";
  }
});
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <v-file-input
        :label="$t('party-plan-file')"
        accept=".jsonc,.json"
        v-model="partyPlanFile"
        @change="loadProgramFile"
        ref="inputPartyPlan"
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
    <div class="programPreview">
      <p>{{ settings?.program_name }}</p>
      <ul>
        <li v-for="(program, i) in settings?.program" :key="i">
          <template v-if="program.type == 'MESSAGE'">{{
            program.message
          }}</template>
          <template v-if="program.type == 'PRIZE'">
            <img
              v-if="program.img"
              :src="program.img"
              style="max-height: 2em"
            />
            {{ program.prize_name }} ({{
              $t("winner-count", program.winner_number)
            }})
          </template>
          <template v-if="program.type == 'DISPLAY_WINNERS'"
            >({{ $t("list-up-winners") }})</template
          >
        </li>
      </ul>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram" v-show="settings !== null">{{
        $t("next")
      }}</v-btn>
    </div>
  </div>
  <v-snackbar v-model="partyFileInvalidSnackBar" color="red accent-2">
    {{ $t("plan-file-invalid") }}
  </v-snackbar>
</template>

<style scoped></style>
