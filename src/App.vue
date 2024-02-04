<script setup lang="ts">
import { ref, Ref } from "vue";
import SelectSavedParties from "@/components/SelectSavedParties.vue";
import CandidatesLoader from "@/components/CandidatesLoader.vue";
import PartyPlansLoader from "@/components/PartyPlansLoader.vue";
import PartyControl from "@/components/PartyControl.vue";
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
</script>

<template>
  <SelectSavedParties
    v-if="!partyId"
    @select-party="initializeParty"
  ></SelectSavedParties>
  <PartyPlansLoader
    v-if="partyId && !partyPlans"
    @load-settings="loadSetting"
  ></PartyPlansLoader>
  <CandidatesLoader
    v-if="partyPlans && !candidates"
    @load-candidates="setCandidates"
  ></CandidatesLoader>
  <PartyControl
    v-if="
      partyId && partyPlans && candidateHeader && candidates && displaySetting
    "
    :party-id="partyId"
    :candidate-header="candidateHeader"
    :candidates="candidates"
    :party-plans="partyPlans"
    :display-setting="displaySetting"
  ></PartyControl>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
</style>
