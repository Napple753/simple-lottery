<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import SelectSavedParties from "./SelectSavedParties.vue";
import PartyPlansLoader from "./PartyPlansLoader.vue";
import CandidatesLoader from "./CandidatesLoader.vue";
import LanguageSwitch from "@/components/LanguageSwitch.vue";
import { Candidate, DisplaySetting } from "@/myTypes.ts";
import { PartyPlans } from "@/Schema";

const partyId: Ref<string | null> = ref(null);
const partyPlans: Ref<PartyPlans | null> = ref(null);
const candidateHeader: Ref<string[] | null> = ref(null);
const candidates: Ref<Candidate[] | null> = ref(null);
const displaySetting: Ref<DisplaySetting | null> = ref(null);

const isLoadSetting = computed(() => partyId.value && !partyPlans.value);
const isLoadCandidates = computed(() => partyPlans.value && !candidates.value);
const stepperNumber = computed(() => {
  if (isLoadSetting.value) {
    return 1;
  } else if (isLoadCandidates.value) {
    return 2;
  } else {
    return 3;
  }
});

const emit = defineEmits<{
  (
    e: "startParty",
    settings: {
      partyId: string;
      partyPlans: PartyPlans;
      candidateHeader: string[];
      candidates: Candidate[];
      displaySetting: DisplaySetting;
    },
  ): void;
}>();

function initializeParty(inPartyId: string | null) {
  if (inPartyId === null) {
    partyId.value = self.crypto.randomUUID();
  } else {
    partyId.value = inPartyId;
  }
}

function loadSetting(arg: PartyPlans) {
  partyPlans.value = arg;
  window.document.title = partyPlans.value.program_name;
}

function setCandidates(arg: {
  candidatesHeader: string[];
  candidates: Candidate[];
  displaySetting: DisplaySetting;
}) {
  candidateHeader.value = arg.candidatesHeader;
  displaySetting.value = arg.displaySetting;
  candidates.value = arg.candidates;

  startParty();
}

function startParty() {
  if (
    partyId.value &&
    partyPlans.value &&
    candidateHeader.value &&
    candidates.value &&
    displaySetting.value
  ) {
    emit("startParty", {
      partyId: partyId.value,
      partyPlans: partyPlans.value,
      candidateHeader: candidateHeader.value,
      candidates: candidates.value,
      displaySetting: displaySetting.value,
    });
  }
}
</script>

<template>
  <header>
    <hgroup>
      <img class="app_icon" src="/sederhana.svg" />
      <div>
        <h1><img src="/logo.svg" alt="SEDERHANA" /></h1>
        <h2>{{ $t("app-description") }}</h2>
      </div>
    </hgroup>
    <language-switch />
  </header>
  <v-stepper :model-value="stepperNumber">
    <v-stepper-header>
      <v-stepper-item
        :title="$t('load-party-plan')"
        :value="1"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :title="$t('load-candidate-list')"
        :value="2"
      ></v-stepper-item>
      <v-divider></v-divider>
      <v-stepper-item
        :title="$t('execute-drawing')"
        :value="3"
      ></v-stepper-item>
    </v-stepper-header>
  </v-stepper>
  <SelectSavedParties
    v-if="!partyId"
    @select-party="initializeParty"
  ></SelectSavedParties>
  <PartyPlansLoader
    v-if="isLoadSetting"
    @load-settings="loadSetting"
  ></PartyPlansLoader>
  <CandidatesLoader
    v-if="isLoadCandidates && partyPlans"
    :party-plans="partyPlans"
    @load-candidates="setCandidates"
  ></CandidatesLoader>
</template>

<style>
header {
  height: 60px;
  width: 100%;
  display: flex;
}
header hgroup {
  width: 100%;
  padding-left: 1rem;
  text-align: left;
  font-size: 15px;
  display: flex;
  color: #333333;
  font-family: futura, sans-serif;
}
header hgroup img.app_icon {
  height: 100%;
  margin-right: 1rem;
}
header h1 {
  margin: 0;
  padding: 0;
  height: 36px;
}
header h1 img {
  height: 36px;
}
header h2 {
  font-size: 12px;
  font-weight: normal;
}
.programPreview {
  width: 100vw;
  height: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 1rem 2rem;
}
.previewWrapper {
  width: 100vw;
  height: 100%;
  overflow-y: hidden;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-shrink: 1;
}
</style>
