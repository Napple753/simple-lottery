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
  <footer>
    <a href="https://github.com/Napple753/simple-lottery" target="_blank">
      SEDERHANA &copy;2024
      <img src="/github-mark.svg" style="height: 14px" /> Napple753
    </a>
  </footer>
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
  background-color: white;
}
#app {
  display: flex;
  flex-direction: column;
}
body {
  padding: 1px;
}

.button_wrapper {
  width: 100%;
  padding-right: 1em;
  height: 2rem;
  text-align: right;
  margin-bottom: 1rem;

  position: relative;
  z-index: 1000;
}

.loadingForm {
  width: 100vw;
  padding: 1rem 2rem;
  box-sizing: border-box;
  flex-shrink: 0;
}

h1 .markDownWrapper strong,
.message .markDownWrapper strong {
  font-size: 2rem;
}

footer {
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  position: absolute;
  bottom: 0;
}
footer a {
  display: block;
  color: #000000;
  text-decoration: none;
  break-inside: avoid;
  opacity: 0.15;
}
footer a:hover {
  color: #777;
  text-decoration: underline;
  opacity: 0.4;
}
</style>
