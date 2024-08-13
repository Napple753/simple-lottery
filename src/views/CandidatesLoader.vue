<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import { readAnyEncoding } from "@/logic/readAnyEncoding";
import CandidateViewer from "@/components/CandidateViewer.vue";
import CandidateViewSetting from "@/components/CandidateViewSetting.vue";
import Papa from "papaparse";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

const emit = defineEmits<{
  (
    e: "loadCandidates",
    arg: {
      candidatesHeader: string[];
      candidates: Candidate[];
      displaySetting: DisplaySetting;
    },
  ): void;
}>();

const CandidateFile: Ref<File | File[] | null | undefined> = ref(null);
const candidates: Ref<Candidate[]> = ref([]);
const displaySetting: Ref<DisplaySetting> = ref({
  top_pos: null,
  main_pos: null,
  bottom_pos: null,
});

async function loadCSVFile(e: Event) {
  const inputElement = e.target as HTMLInputElement;
  const file = inputElement.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const res = readAnyEncoding(reader);

    loadCSVText(res as string);
  });
  reader.readAsArrayBuffer(file);
}
function loadSampleCSV() {
  CandidateFile.value = null;
  fetch(sampleCSVUrl.value)
    .then((res) => res.text())
    .then((res) => loadCSVText(res));
}
const sampleCSVUrl = computed(() => {
  if (locale.value === "ja") {
    return import.meta.env.BASE_URL + "sample.ja.csv";
  } else {
    return import.meta.env.BASE_URL + "sample.csv";
  }
});
function loadCSVText(csvText: string) {
  const rawData = Papa.parse(csvText).data as string[][];
  const columns = rawData[0].length;
  candidates.value = rawData
    .filter((d) => d.length === columns && d.some((cell) => cell !== ""))
    .map((d, i) => ({
      id: i,
      data: d,
    }));

  displaySetting.value = {
    top_pos: 0 >= columns ? null : 0,
    main_pos: 1 >= columns ? null : 1,
    bottom_pos: 2 >= columns ? null : 2,
  };
}
function nextProgram() {
  emit("loadCandidates", {
    candidatesHeader: candidatesHeader.value,
    candidates: candidatesBody.value,
    displaySetting: displaySetting.value,
  });
}

const useHeader = ref(true);

const candidatesHeader = computed(() => {
  if (candidates.value.length < 2) {
    return [];
  }
  const bodyFitstRow = candidates.value[1];
  return useHeader.value
    ? candidates.value.slice(0, 1)[0].data
    : ["A", "B", "C", "D", "E", "F", "G"].slice(0, bodyFitstRow.data.length);
});
const candidatesBody = computed(() => {
  return useHeader.value ? candidates.value.slice(1) : candidates.value;
});

function updateDisplaySetting(newDisplaySetting: DisplaySetting) {
  displaySetting.value = newDisplaySetting;
}
</script>

<template>
  <div class="program">
    <v-row style="height: 48px" justify="space-between" class="w-75">
      <v-col cols="auto" style="opacity: 0.5">
        <v-avatar color="black" size="24">1</v-avatar>
        {{ $t("load-party-plan") }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-avatar color="black" size="24">2</v-avatar>
        {{ $t("load-candidate-list") }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" style="opacity: 0.5">
        <v-avatar color="black" size="24">3</v-avatar>
        {{ $t("execute-drawing") }}
      </v-col>
    </v-row>
    <div class="loadingForm">
      <v-file-input
        :label="$t('candidate-list-file')"
        v-model="CandidateFile"
        accept=".csv"
        @change="loadCSVFile"
      ></v-file-input>
      <v-row justify="start">
        <v-col cols="auto">{{ $t("or-you-can") }}</v-col>
        <v-col cols="auto">
          <v-btn @click="loadSampleCSV">{{ $t("use-sample") }}</v-btn>
        </v-col>
      </v-row>
    </div>
    <div class="previewWrapper">
      <div class="candidatesPreview">
        <label
          ><input type="checkbox" v-model="useHeader" />{{
            $t("use-csv-header")
          }}</label
        >
        <p v-if="candidatesBody.length > 0">
          <small>{{ $t("n-loaded", candidatesBody.length) }}</small>
        </p>
        <table class="candidatesTable">
          <tr>
            <th v-for="(cell, i) in candidatesHeader" :key="i">{{ cell }}</th>
          </tr>
          <tr v-for="candidate in candidatesBody" :key="candidate.id">
            <td v-for="(cell, i) in candidate.data" :key="i">{{ cell }}</td>
          </tr>
        </table>
      </div>
      <div class="displayPreview">
        <template v-if="candidatesBody && candidatesBody[0]">
          <p>{{ $t("display-order") }}</p>
          <CandidateViewSetting
            :header="candidatesHeader"
            :display-setting="displaySetting"
            @change-setting="updateDisplaySetting"
          ></CandidateViewSetting>
          <p>{{ $t("display-sample") }}</p>
          <CandidateViewer
            :candidate="candidatesBody[0]"
            :display-setting="displaySetting"
          ></CandidateViewer>
        </template>
      </div>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram" v-show="candidates.length > 1">{{
        $t("next")
      }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.candidatesTable {
  border-collapse: collapse;
  border: 1px solid lightgray;
}
.candidatesTable tr:nth-child(even) {
  background-color: azure;
}
.candidatesTable tr,
.candidatesTable td,
.candidatesTable th {
  border: 1px solid lightgray;
}
.candidatesPreview {
  width: 50vw;
  height: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 1rem 2rem;
}
.candidatesPreview tr:first-child {
  background: white;
  position: sticky;
  top: -1rem;
}
.candidatesPreview td,
.candidatesPreview th {
  padding: 0 1em;
}

.displayPreview {
  width: 50vw;
  height: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 1rem 2rem;
}
</style>
