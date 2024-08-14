<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import SettingControl from "./views/SettingControl.vue";
import PartyControl from "@/views/PartyControl.vue";
import { Candidate, DisplaySetting } from "@/myTypes.ts";
import { PartyPlans } from "@/Schema";

const partyId: Ref<string | null> = ref(null);
const partyPlans: Ref<PartyPlans | null> = ref(null);
const candidateHeader: Ref<string[] | null> = ref(null);
const candidates: Ref<Candidate[] | null> = ref(null);
const displaySetting: Ref<DisplaySetting | null> = ref(null);

const isHoldingParty = computed(
  () =>
    partyId.value !== null &&
    partyPlans.value !== null &&
    candidateHeader.value !== null &&
    candidates.value !== null &&
    displaySetting.value !== null,
);

function startParty(settings: {
  partyId: string;
  partyPlans: PartyPlans;
  candidateHeader: string[];
  candidates: Candidate[];
  displaySetting: DisplaySetting;
}) {
  partyId.value = settings.partyId;
  partyPlans.value = settings.partyPlans;
  candidateHeader.value = settings.candidateHeader;
  candidates.value = settings.candidates;
  displaySetting.value = settings.displaySetting;
}
</script>

<template>
  <SettingControl
    v-if="!isHoldingParty"
    @start-party="startParty"
  ></SettingControl>
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
  display: flex;
  flex-direction: column;
}
body {
  padding: 1px;
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
</style>
