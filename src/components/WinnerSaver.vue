<script setup lang="ts">
import { Candidate, WinnerLog } from "@/myTypes";
import Papa from "papaparse";

const props = defineProps<{
  /** 抽選会の名前(保存時に使用) */
  partyName: string;
  /** 候補者データのヘッダー(保存時に使用) */
  candidateHeader: string[];
  /** 当選者の記録 */
  winnersLog: WinnerLog<Candidate>[];
}>();

function saveWinnersLog() {
  const data = props.winnersLog
    .map((log) => {
      const timeISOString = new Date(log.timestamp).toISOString();
      return log.selected.map((c) => {
        return [log.prizeName, timeISOString, "-", ...c.data];
      });
    })
    .flat();
  console.log(props.candidateHeader);
  const header = [
    "当選賞名",
    "当選時刻",
    "キャンセル済み",
    ...props.candidateHeader,
  ];
  data.splice(0, 0, header);
  const csvText = Papa.unparse(data, {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: false,
    newline: "\r\n",
    skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
  });
  console.log(csvText);
  const filename = props.partyName + ".csv";
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csvText], { type: "text/csv" });
  //リンク先にダウンロード用リンクを指定する
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();

  //createObjectURLで作成したオブジェクトURLを開放する
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <input type="button" value="当選者をCSVで保存" @click="saveWinnersLog" />
</template>

<style scoped>
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
