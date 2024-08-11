<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { PartyPlans, isPartyPlans } from "@/myTypes";
import { readAnyEncoding } from "@/logic/readAnyEncoding";
import { parse as JSONCParse } from "jsonc-parser";

const emit = defineEmits<{
  (e: "loadSettings", settings: PartyPlans): void;
}>();
const settings: Ref<PartyPlans | null> = ref(null);

function loadSampleProgram() {
  fetch(sampleProgramUrl.value)
    .then((res) => res.text())
    .then((res) => loadJSONCText(res));
}

async function loadJSONCText(jsoncText: string) {
  const loaded = await JSONCParse(jsoncText);
  if (!isPartyPlans(loaded)) {
    return alert("設定ファイルの形式に間違いがあります。");
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

const sampleProgramUrl = computed(
  () => import.meta.env.BASE_URL + "sample_setting.jsonc",
);
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <h1>{{ $t("load-party-plan") }}</h1>
      <p>
        <input type="file" accept=".jsonc,.json" @change="loadProgramFile" />
      </p>
      <p>
        {{ $t("or-you-can")
        }}<input
          type="button"
          :value="$t('use-sample')"
          @click="loadSampleProgram"
        />
      </p>
      <p>
        <a :href="sampleProgramUrl" download>{{ $t("download-sample") }}</a>
      </p>
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
      <input
        type="button"
        :value="$t('next')"
        @click="nextProgram"
        v-show="settings !== null"
      />
    </div>
  </div>
</template>

<style scoped></style>
