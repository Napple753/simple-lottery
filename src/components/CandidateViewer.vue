<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import { Candidate, DisplaySetting } from "@/myTypes";
import PreWrap from "./PreWrap.vue";

defineProps<{
  /** 候補者 */
  candidate: Candidate;
  /** 当選者の表示順設定 */
  displaySetting: DisplaySetting;
}>();

const top_info: Ref<HTMLElement | null> = ref(null);
const topScale = ref(1);
const main_info: Ref<HTMLElement | null> = ref(null);
const mainScale = ref(1);
const bottom_info: Ref<HTMLElement | null> = ref(null);
const bottomScale = ref(1);
const info_wrapper: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  if (
    top_info.value == null ||
    main_info.value == null ||
    bottom_info.value == null ||
    info_wrapper.value == null
  ) {
    return;
  }

  const baseW = info_wrapper.value.clientWidth;

  const topW = top_info.value.clientWidth;
  if (topW > baseW) {
    topScale.value = baseW / topW;
  }
  const mainW = main_info.value.clientWidth;
  if (mainW > baseW) {
    mainScale.value = baseW / mainW;
  }
  const bottomW = bottom_info.value.clientWidth;
  if (bottomW > baseW) {
    bottomScale.value = baseW / bottomW;
  }
});
</script>

<template>
  <div class="candidate_wrapper">
    <div class="candidate" ref="info_wrapper">
      <p class="top_info" ref="top_info">
        <PreWrap
          :text="
            displaySetting.top_pos === null
              ? ''
              : candidate.data[displaySetting.top_pos]
          "
        >
        </PreWrap>
      </p>
      <p class="main_info" ref="main_info">
        <PreWrap
          :text="
            displaySetting.main_pos === null
              ? ''
              : candidate.data[displaySetting.main_pos]
          "
        >
        </PreWrap>
      </p>
      <p class="bottom_info" ref="bottom_info">
        <PreWrap
          :text="
            displaySetting.bottom_pos === null
              ? ''
              : candidate.data[displaySetting.bottom_pos]
          "
        >
        </PreWrap>
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
  height: 10rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid grey;
  overflow: hidden;
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
  margin: 0;
  user-select: all;
  white-space: nowrap;
  transform-origin: center;
  transform: scaleX(var(--scale));
}

.top_info {
  font-size: 1rem;
  --scale: v-bind(topScale);
}
.main_info {
  font-size: 2rem;
  font-weight: 800;
  --scale: v-bind(mainScale);
}
.bottom_info {
  font-size: 1rem;
  --scale: v-bind(bottomScale);
}
</style>
