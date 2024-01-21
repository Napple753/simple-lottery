<script setup lang="ts">
import { ref, Ref } from "vue";
import { PartyPlans, isPartyPlans } from "../myTypes";
import { readAnyEncoding } from "../logic/readAnyEncoding";
import { parse as JSONCParse } from "jsonc-parser";

const emit = defineEmits(["loadSettings"]);
const settings: Ref<PartyPlans | null> = ref(null);

function loadSampleProgram() {
  fetch("/sample_setting.jsonc")
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
  const inputElement = e.target as any;
  if (inputElement === null) {
    return;
  }
  const [file] = inputElement.files;

  if (file === null) {
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
  emit("loadSettings", settings.value);
}
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <h1>進行プログラムの読み込み</h1>
      <p>
        <input type="file" accept=".jsonc,.json" @change="loadProgramFile" />
      </p>
      <p>
        または<input
          type="button"
          value="サンプルを使う"
          @click="loadSampleProgram"
        />
      </p>
      <p>
        <a href="/sample_setting.jsonc" download
          >サンプルファイルのダウンロード</a
        >
      </p>
    </div>
    <div class="programPreview">
      <p>{{ settings?.program_name }}</p>
      <ul>
        <li v-for="program in settings?.program">
          <template v-if="program.type == 'MESSAGE'">{{
            program.message
          }}</template>
          <template v-if="program.type == 'PRIZE'"
            >{{ program.prize_name }} (当選者{{
              program.winner_number
            }}人)</template
          >
          <template v-if="program.type == 'DISPLAY_WINNERS'"
            >(当選者一覧表示)</template
          >
        </li>
      </ul>
    </div>
    <div class="button_wrapper">
      <input
        type="button"
        value="次へ"
        @click="nextProgram"
        v-show="settings !== null"
      />
    </div>
  </div>
</template>

<style scoped>
.loadingForm {
  width: 100vw;
  padding: 1rem 2rem;
  box-sizing: border-box;
}
.programPreview {
  width: 100vw;
  height: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 1rem 2rem;
}
</style>
