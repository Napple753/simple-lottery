<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import ConfirmRedraw from "./ConfirmRedraw.vue";
import NameLotteryCore from "./NameLotteryCore.vue";
import MarkedText from "./MarkedText.vue";
import { useMarkdownStore } from "@/store/markdown";
const markdownStore = useMarkdownStore();
const emit = defineEmits<{
  (e: "finishDraw"): void;
  (e: "redraw", winner: Candidate): void;
}>();

const props = defineProps<{
  /** 当選者 */
  winner: Candidate;
  /** ダミー当選者作成用の候補者 */
  candidates: Candidate[];
  /** ロールの省略 */
  isSimple?: boolean;
  /** 当選者の表示順設定 */
  displaySetting: DisplaySetting;
  /** 読み込みと同時にロール開始 */
  immediate?: boolean;
  /**再抽選 */
  noRedraw?: boolean;
  /** ドラムロール音を再生 */
  playDrumRoll?: boolean;
  /** sub_prize_name */
  subPrizeName?: string;
}>();

const isDeciding: Ref<boolean> = ref(false);

const redrawDialog = ref(false);

const lotteryCore = ref<InstanceType<typeof NameLotteryCore> | null>(null);

function draw(
  drawingTime = 10 * 1000,
  teasing: number | undefined = undefined,
) {
  lotteryCore.value?.draw(drawingTime, teasing);
}

function finishDraw() {
  isDeciding.value = true;
  emit("finishDraw");
}

function redraw() {
  redrawDialog.value = false;
  emit("redraw", props.winner);
}

defineExpose({ draw });

const prizeNameFontWeight = computed(() =>
  markdownStore.markdown ? "normal" : "bold",
);
const wrapperMaxWidth = computed(() => (props.subPrizeName ? "100%" : "30rem"));
</script>

<template>
  <div class="nameRotteryWrapper">
    <MarkedText
      :markdown="subPrizeName"
      v-if="subPrizeName"
      class="subPrizeName"
    ></MarkedText>
    <div style="max-width: 30rem; width: 100%">
      <NameLotteryCore
        ref="lotteryCore"
        :winner="winner"
        :candidates="candidates"
        :isSimple="isSimple"
        :displaySetting="displaySetting"
        :immediate="immediate"
        :playDrumRoll="playDrumRoll"
        @finishDraw="finishDraw"
      ></NameLotteryCore>
      <div style="display: flex; justify-content: end; height: 48px">
        <v-btn
          icon
          class="reload"
          v-show="isDeciding && !noRedraw"
          flat
          @click="redrawDialog = true"
        >
          <v-icon size="small" icon="mdi-reload"></v-icon>
        </v-btn>
      </div>
    </div>

    <ConfirmRedraw
      v-model="redrawDialog"
      :winner="winner"
      :displaySetting="displaySetting"
      v-if="winner"
      @redraw="redraw"
    ></ConfirmRedraw>
  </div>
</template>

<style scoped>
.nameRotteryWrapper {
  max-width: v-bind(wrapperMaxWidth);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.subPrizeName {
  font-size: 1em;
  font-weight: v-bind(prizeNameFontWeight);
  text-align: center;
  display: flex;
  height: 10rem;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}
</style>
