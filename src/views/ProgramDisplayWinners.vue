<script setup lang="ts">
import { defineProps, defineEmits, ref, Ref, computed, watch } from "vue";
import { WinnerCandidateLog, Candidate, DisplaySetting } from "@/myTypes";
import { DisplayWinner } from "@/Schema";
import ConfirmRedraw from "@/components/ConfirmRedraw.vue";
import NameLotteryCore from "@/components/NameLotteryCore.vue";
import MarkedText from "@/components/MarkedText.vue";
import PreWrap from "@/components/PreWrap.vue";
import { useMarkdownStore } from "@/store/markdown";
const markdownStore = useMarkdownStore();

const emit = defineEmits<{
  (e: "finishProgram"): void;
  (e: "redraw", o: { winner: Candidate; programId: number }): void;
}>();

const props = defineProps<{
  program: DisplayWinner;
  winnersLog: WinnerCandidateLog[];
  displaySetting: DisplaySetting;
  candidates: Candidate[];
}>();
const redrawDialog = ref(false);
const cancelledWinner = ref<Candidate | null>(null);

const displayWinnersLog = computed(() => {
  const sortedWinnersLog = props.winnersLog.map((log) => ({
    ...log,
    selected: [
      ...log.selected.map((s) => ({ ...s, cancelledTS: undefined })),
      ...log.cancelled,
    ]
      .filter((c) => c.candidate.id !== newCandidate.value?.id)
      .sort((a, b) => a.selectTS - b.selectTS),
    cancelled: undefined,
  }));
  const prizeNames: { programId: number; prizeName: string }[] =
    uniqueObjectArray(
      sortedWinnersLog
        .map((prize) =>
          prize.selected.map((s) => ({
            programId: prize.programId,
            prizeName: s.prizeName,
          })),
        )
        .flat(),
    );

  return prizeNames
    .map(({ programId, prizeName }) => {
      const prize = sortedWinnersLog.find(
        (prize) => prize.programId === programId,
      );
      if (!prize) return false;
      return {
        ...prize,
        prizeName,
        selected: prize.selected.filter((s) => s.prizeName === prizeName),
      };
    })
    .filter((prize) => prize !== false);
});

function uniqueObjectArray<T>(inputArray: T[]): T[] {
  const inputJSONArrray = inputArray.map((i) => JSON.stringify(i));
  const uniqueJSONArray = Array.from(new Set(inputJSONArrray));
  return uniqueJSONArray.map((u) => JSON.parse(u) as T);
}

function nextProgram() {
  emit("finishProgram");
}

const redrawingProgramId: Ref<number | null> = ref(null);
const redrawingPrizeName = computed(
  () =>
    props.winnersLog
      .find((prize) => prize.programId === redrawingProgramId.value)
      ?.selected.find((s) => s.candidate.id === newCandidate.value?.id)
      ?.prizeName || "",
);

function redrawConfirm(programId: number, candidateId: number) {
  cancelledWinner.value =
    props.winnersLog
      .find((prize) => prize.programId === programId)
      ?.selected.find((winner) => winner.candidate.id === candidateId)
      ?.candidate || null;
  if (cancelledWinner.value === null) {
    throw new Error("No winner found");
  }
  redrawingProgramId.value = programId;

  redrawDialog.value = true;
}

const redrawingDialog = ref(false);

function redraw() {
  redrawDialog.value = false;

  if (redrawingProgramId.value === null || cancelledWinner.value === null) {
    throw new Error("No winner found");
  }
  emit("redraw", {
    winner: cancelledWinner.value,
    programId: redrawingProgramId.value,
  });
}

const newCandidate = ref<Candidate | null>(null);

watch(
  () => props.winnersLog,
  (newValue, oldValue) => {
    if (redrawingProgramId.value === null) {
      return;
    }
    const newWinners =
      newValue.find((prize) => prize.programId === redrawingProgramId.value)
        ?.selected || [];
    const preWinners =
      oldValue.find((prize) => prize.programId === redrawingProgramId.value)
        ?.selected || [];
    newCandidate.value =
      newWinners.find(
        (winner) =>
          !preWinners.find(
            (preWinner) => preWinner.candidate.id === winner.candidate.id,
          ),
      )?.candidate || null;

    redrawingDialog.value = true;

    redrawing.value = true;
  },
);

function closeRedrawingDialog() {
  redrawingDialog.value = false;
  newCandidate.value = null;
  redrawingProgramId.value = null;
}

const redrawing = ref(false);

const prizeNameFontWeight = computed(() =>
  markdownStore.markdown ? "normal" : "bold",
);
</script>

<template>
  <div class="program">
    <h1>{{ $t("winners-so-far") }}</h1>
    <div class="winners_list_wrapper">
      <div class="winners_list">
        <div v-for="(prize, i) in displayWinnersLog" :key="i" class="prize">
          <h2>
            <MarkedText :markdown="prize.prizeName"></MarkedText>
          </h2>
          <table>
            <tr v-for="winner in prize.selected" :key="winner.candidate.id">
              <td>
                <v-btn
                  icon
                  flat
                  @click="redrawConfirm(prize.programId, winner.candidate.id)"
                  v-if="!winner.cancelledTS"
                >
                  <v-icon size="small" icon="mdi-reload"></v-icon>
                </v-btn>
              </td>
              <td
                v-for="(cell, k) in winner.candidate.data"
                :key="winner.candidate.id + '' + k"
              >
                <template v-if="!winner.cancelledTS">
                  <PreWrap :text="cell"></PreWrap>
                </template>
                <s v-else>
                  <PreWrap :text="cell"></PreWrap>
                </s>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="button_wrapper">
      <v-btn @click="nextProgram">{{ $t("next") }}</v-btn>
    </div>
  </div>
  <confirm-redraw
    v-model="redrawDialog"
    :winner="cancelledWinner"
    :newWinner="null"
    :displaySetting="displaySetting"
    v-if="cancelledWinner"
    @redraw="redraw()"
  ></confirm-redraw>

  <v-dialog
    v-model="redrawingDialog"
    v-if="newCandidate"
    persistent
    max-width="35rem"
  >
    <v-card prepend-icon="mdi-reload" :title="$t('redraw') + ': '" fill-height>
      <template v-slot:actions>
        <v-btn @click="closeRedrawingDialog" v-show="!redrawing">
          {{ $t("next") }}
        </v-btn>
      </template>
      <div style="max-width: 30rem; width: 100%; margin: auto">
        <h2><MarkedText :markdown="redrawingPrizeName" /></h2>
        <NameLotteryCore
          style="margin: auto"
          ref="lotteryCore"
          :winner="newCandidate"
          :candidates="candidates"
          :isSimple="true"
          :displaySetting="displaySetting"
          :immediate="true"
          :playDrumRoll="true"
          @finishDraw="
            () => {
              redrawing = false;
            }
          "
        ></NameLotteryCore>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
h2 {
  font-size: 1.2rem;
  font-weight: v-bind(prizeNameFontWeight);
}
.winners_list_wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.winners_list {
  height: 100%;
  overflow: scroll;
  width: 100vw;
  height: 100%;
  column-width: 400px;
  padding: 1rem 2rem;
  box-sizing: border-box;
}
.prize {
  break-inside: avoid;
}
table,
tr,
td {
  border: none;
  height: 2rem;
  white-space: nowrap;
}
td {
  padding: 1rem 0.5rem;
  user-select: all;
}
td:first-child {
  width: 48px;
  padding: 0 0;
}

/* @media (max-width: 1000px) {
  .winners_list {
    column-count: 1;
    display: flex;
    flex-direction: column;
  }
} */
</style>
