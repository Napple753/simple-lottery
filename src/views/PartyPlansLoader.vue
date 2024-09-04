<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { PartyPlans } from "@/Schema";
import { readAnyEncoding } from "@/logic/readAnyEncoding";
import { parse as JSONCParse } from "jsonc-parser";
import { VFileInput } from "vuetify/components";
import { useI18n } from "vue-i18n";
import { ZodError } from "zod";
import MarkedText from "@/components/MarkedText.vue";
import { useMarkdownStore } from "@/store/markdown";
const { locale } = useI18n();
const markdownStore = useMarkdownStore();

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
    settings.value = PartyPlans.parse(loaded);

    settings.value.program.forEach((program) => {
      if (program.type === "PRIZE") {
        if (
          program.sub_prize_names &&
          program.sub_prize_names.length !== program.winner_number
        ) {
          throw new Error("sub_prize_names");
        }
      }
    });
  } catch (e) {
    if (
      e instanceof ZodError ||
      (e instanceof Error && e.message === "sub_prize_names")
    ) {
      partyFileInvalidSnackBar.value = true;
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
  <v-snackbar v-model="partyFileInvalidSnackBar" color="red accent-2">
    {{ $t("plan-file-invalid") }}
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
