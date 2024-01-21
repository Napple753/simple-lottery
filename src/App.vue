<script setup lang="ts">
import { ref, Ref } from "vue";
//import DisplayName from './components/DisplayName.vue'
import CandidatesLoader from "./components/CandidatesLoader.vue";
import PartyPlansLoader from "./components/PartyPlansLoader.vue";
import PartyControl from "./components/PartyControl.vue";
import { Candidate, DisplaySetting, PartyPlans } from "./myTypes.ts";

const partyId: Ref<string | null> = ref(null);
partyId.value = self.crypto.randomUUID();
const partyPlans: Ref<PartyPlans | null> = ref(null);
const candidateHeader: Ref<string[] | null> = ref(null);
const candidates: Ref<Candidate[] | null> = ref(null);
const displaySetting: Ref<DisplaySetting | null> = ref(null);

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
  <PartyPlansLoader
    v-if="!partyPlans"
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
</style>
