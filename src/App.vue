<script setup lang="ts">
import { ref, Ref } from "vue";
//import DisplayName from './components/DisplayName.vue'
import CSVLoader from "./components/CSVLoader.vue";
import ProgramLoader from "./components/ProgramLoader.vue";
import ProgramControl from "./components/ProgramControl.vue";
import {
  Candidate,
  DisplaySetting,
  EventPlans,
} from "./myTypes.ts";

const partyId:Ref<string|null> = ref(null);
const eventPlans: Ref<EventPlans | null> = ref(null);
const candidates: Ref<Candidate[]|null> = ref(null);
const displaySetting: Ref<DisplaySetting | null> = ref(null);


function loadSetting(arg: EventPlans) {
  eventPlans.value = arg;
  window.document.title = eventPlans.value.program_name;
}
function setCandidates(arg: {
  candidates: Candidate[];
  displaySetting: DisplaySetting;
}) {
  displaySetting.value = arg.displaySetting;
  candidates.value = arg.candidates;
}
</script>

<template>
  <ProgramLoader
    @load-settings="loadSetting"
    v-if="!eventPlans"
  ></ProgramLoader>
  <CSVLoader
    @load-candidates="setCandidates"
    v-if="eventPlans && !candidates"
  ></CSVLoader>
  <ProgramControl
    v-if="eventPlans && candidates && displaySetting"
    :candidates="candidates"
    :event-plans="eventPlans"
    :display-setting="displaySetting"
  ></ProgramControl>
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
