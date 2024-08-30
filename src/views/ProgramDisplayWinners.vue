<script setup lang="ts">
import { defineProps, defineEmits, ref, Ref, computed, watch } from "vue";
import { WinnerCandidateLog, Candidate, DisplaySetting } from "@/myTypes";
import { DisplayWinner } from "@/Schema";
import ConfirmRedraw from "@/components/ConfirmRedraw.vue";
import NameLotteryCore from "@/components/NameLotteryCore.vue";

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

const sortedWinnersLog = computed(() =>
  props.winnersLog.map((log) => ({
    ...log,
    selected: [
      ...log.selected.map((s) => ({ ...s, cancelledTS: undefined })),
      ...log.cancelled,
    ]
      .filter((c) => c.candidate.id !== newCandidate.value?.id)
      .sort((a, b) => a.selectTS - b.selectTS),
    cancelled: undefined,
  })),
);

function nextProgram() {
  emit("finishProgram");
}

const redrawingProgramId: Ref<number | null> = ref(null);
const redrawingPrizeName = computed(
  () =>
    props.winnersLog.find(
      (prize) => prize.programId === redrawingProgramId.value,
    )?.prizeName || "",
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
</script>

<template>
  <div class="program">
    <h1>{{ $t("winners-so-far") }}</h1>
    <div class="winners_list_wrapper">
      <div class="winners_list">
        <div v-for="(prize, i) in sortedWinnersLog" :key="i" class="prize">
          <h2>{{ prize.prizeName }}</h2>
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
                <template v-if="!winner.cancelledTS">{{ cell }}</template>
                <s v-else>{{ cell }}</s>
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
    <v-card
      prepend-icon="mdi-reload"
      :title="$t('redraw') + ': ' + redrawingPrizeName"
      fill-height
    >
      <template v-slot:actions>
        <v-btn @click="closeRedrawingDialog" v-show="!redrawing">
          {{ $t("next") }}
        </v-btn>
      </template>
      <div style="width: 100%">
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
  padding: 1rem 1rem;
  user-select: all;
}
td:first-child {
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
