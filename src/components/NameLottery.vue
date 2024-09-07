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

const props = withDefaults(
  defineProps<{
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
    /** 横幅[rem] */
    lotterySize?: number;
  }>(),
  {
    lotterySize: 30,
  },
);

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

const prizeNameFontSize = computed(() => (props.lotterySize / 30) * 1 + "rem");

const prizeNameFontWeight = computed(() =>
  markdownStore.markdown ? "normal" : "bold",
);

const LotteryWidth = computed(() => `${props.lotterySize}rem`);
const wrapperMaxWidth = computed(() =>
  props.subPrizeName ? "100%" : LotteryWidth.value,
);
const controlHeight = computed(() => `${(props.lotterySize / 30) * 48}px`);
</script>

<template>
  <div class="nameRotteryWrapper">
    <MarkedText
      :markdown="subPrizeName"
      v-if="subPrizeName"
      class="subPrizeName"
    ></MarkedText>
    <div class="innerWrapper">
      <NameLotteryCore
        ref="lotteryCore"
        :winner="winner"
        :candidates="candidates"
        :isSimple="isSimple"
        :displaySetting="displaySetting"
        :immediate="immediate"
        :playDrumRoll="playDrumRoll"
        @finishDraw="finishDraw"
        :lotterySize="lotterySize"
      ></NameLotteryCore>
      <div class="reloadControl">
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
  font-size: v-bind(prizeNameFontSize);
  font-weight: v-bind(prizeNameFontWeight);
  text-align: center;
  display: flex;
  height: 10rem;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}
.innerWrapper {
  width: 100%;
  max-width: v-bind(LotteryWidth);
}
.reloadControl {
  display: flex;
  justify-content: end;
  height: v-bind(controlHeight);
}
</style>
