<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DisplaySetting } from "@/myTypes";

const emit = defineEmits<{
  (e: "changeSetting", displaySetting: DisplaySetting): void;
}>();
const props = defineProps<{
  /** 当選者の表示順設定 */
  displaySetting: DisplaySetting;
  /** 候補者データのヘッダー */
  header: string[];
}>();

const top_pos = ref(props.displaySetting.top_pos);
watch(top_pos, () => updateDisplaySetting());
const main_pos = ref(props.displaySetting.main_pos);
watch(main_pos, () => updateDisplaySetting());
const bottom_pos = ref(props.displaySetting.bottom_pos);
watch(bottom_pos, () => updateDisplaySetting());

const headerPositions = computed(() => {
  return props.header.map((header, i) => ({
    title: header,
    value: i,
  }));
});

function updateDisplaySetting() {
  emit("changeSetting", {
    top_pos: top_pos.value,
    main_pos: main_pos.value,
    bottom_pos: bottom_pos.value,
  });
}
</script>

<template>
  <div class="candidate_wrapper">
    <div class="candidate">
      <p class="top_info">
        <v-select
          clearable
          density="compact"
          v-model="top_pos"
          label=""
          :items="headerPositions"
          item-title="title"
          item-value="value"
        ></v-select>
      </p>
      <p class="main_info">
        <v-select
          clearable
          density="compact"
          v-model="main_pos"
          label=""
          :items="headerPositions"
          item-title="title"
          item-value="value"
        ></v-select>
      </p>
      <p class="bottom_info">
        <v-select
          clearable
          density="compact"
          v-model="bottom_pos"
          label=""
          :items="headerPositions"
          item-title="title"
          item-value="value"
        ></v-select>
      </p>
    </div>
  </div>
</template>

<style scoped>
.candidate_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid grey;
}
.candidate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 80%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}
.candidate p {
  width: 100%;
  margin: 0;
  padding: 0;
  user-select: all;
  break-inside: avoid;
}
</style>
