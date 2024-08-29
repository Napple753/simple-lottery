<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import CandidateViewer from "@/components/CandidateViewer.vue";

const emit = defineEmits<{
  (e: "redraw", winner: Candidate): void;
}>();
const model = defineModel<boolean>();

const props = defineProps<{
  /** 当選者 */
  winner: Candidate;
  /** 当選者 */
  displaySetting: DisplaySetting;
}>();

function redraw() {
  model.value = false;
  emit("redraw", props.winner);
}
</script>
<template>
  <v-dialog v-model="model" max-width="35rem">
    <v-card
      prepend-icon="mdi-alert-circle-outline"
      :title="$t('redraw')"
      :text="$t('redraw-confirmation')"
      fill-height
    >
      <template v-slot:actions>
        <v-btn @click="model = false"> {{ $t("keep-winner") }} </v-btn>
        <v-btn @click="redraw" color="warning">{{ $t("redraw") }}</v-btn>
      </template>
      <div style="width: 100%">
        <div class="isDeciding" style="max-width: 30rem; margin: auto">
          <CandidateViewer
            class="winner"
            :candidate="winner"
            :display-setting="displaySetting"
          ></CandidateViewer>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.isDeciding .winner {
  background-color: yellow;
  color: red;
  box-shadow: none;
}
.isDeciding .inner {
  transform: scale(1.25);
  transform-origin: center center;
  transition: transform 0.5s;
}
</style>
