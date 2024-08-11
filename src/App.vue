<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import SelectSavedParties from "@/views/SelectSavedParties.vue";
import CandidatesLoader from "@/views/CandidatesLoader.vue";
import PartyPlansLoader from "@/views/PartyPlansLoader.vue";
import PartyControl from "@/views/PartyControl.vue";
import LanguageSwitch from "./components/LanguageSwitch.vue";
import { Candidate, DisplaySetting, PartyPlans } from "@/myTypes.ts";

const partyId: Ref<string | null> = ref(null);
const partyPlans: Ref<PartyPlans | null> = ref(null);
const candidateHeader: Ref<string[] | null> = ref(null);
const candidates: Ref<Candidate[] | null> = ref(null);
const displaySetting: Ref<DisplaySetting | null> = ref(null);

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
}

const isLoadSetting = computed(() => partyId.value && !partyPlans.value);
const isLoadCandidates = computed(() => partyPlans.value && !candidates.value);
const isHoldingParty = computed(
  () =>
    partyId.value !== null &&
    partyPlans.value !== null &&
    candidateHeader.value !== null &&
    candidates.value !== null &&
    displaySetting.value !== null,
);

function scrollControl() {
  if (window.innerHeight < 480) {
    document.body.style.overflowY = "scroll";
  } else {
    document.body.style.overflowY = "hidden";
  }
  if (window.innerWidth < 960) {
    document.body.style.overflowX = "scroll";
  } else {
    document.body.style.overflowX = "hidden";
  }
}
scrollControl();
window.addEventListener("resize", scrollControl);
</script>

<template>
  <header v-show="!isHoldingParty">
    <h1 style="width: 100%">{{ $t("app-name") }}</h1>
    <language-switch />
  </header>
  <SelectSavedParties
    v-if="!partyId"
    @select-party="initializeParty"
  ></SelectSavedParties>
  <PartyPlansLoader
    v-if="isLoadSetting"
    @load-settings="loadSetting"
  ></PartyPlansLoader>
  <CandidatesLoader
    v-if="isLoadCandidates"
    @load-candidates="setCandidates"
  ></CandidatesLoader>
  <PartyControl
    v-if="isHoldingParty"
    :party-id="partyId!"
    :candidate-header="candidateHeader!"
    :candidates="candidates!"
    :party-plans="partyPlans!"
    :display-setting="displaySetting!"
  ></PartyControl>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  min-width: 960px;
  min-height: 480px;
  display: flex;
  flex-direction: column;
}
body {
  padding: 1px;
}
h1 {
  text-align: center;
}
.program {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;

  padding: 1rem 2rem;
  box-sizing: border-box;
  align-items: center;

  flex-shrink: 1;
  overflow: hidden;
}

.button_wrapper {
  width: 80%;
  height: 2rem;
  text-align: right;
  margin-bottom: 1rem;
}

.loadingForm {
  width: 100vw;
  padding: 1rem 2rem;
  box-sizing: border-box;
  flex-shrink: 0;
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
.programPreview {
  width: 100vw;
  height: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 1rem 2rem;
}
.message {
  font-size: 200%;
  font-weight: bold;
  margin: auto;
}

header {
  height: 48px;
  width: 100%;
  display: flex;
}
header h1 {
  font-size: 30px;
}
</style>
