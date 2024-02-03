<script setup lang="ts">
import { ref, Ref } from "vue";
import { PartyLog } from "@/myTypes";
import { PartyLogControl } from "@/logic/PartyLogControl";

const emit = defineEmits<{
  selectParty: [id: string | null];
}>();

function startNewParty() {
  emit("selectParty", null);
}

const savedPartyList: Ref<PartyLog[]> = ref(
  PartyLogControl.getSavedPartyList(),
);

if (savedPartyList.value.length == 0) {
  emit("selectParty", null);
}
</script>

<template>
  <div class="program">
    <div class="loadingForm">
      <h1>保存済みの抽選会の選択</h1>
      <p>
        <input type="button" value="新規抽選会を開始" @click="startNewParty" />
      </p>
    </div>
    <div class="previewWrapper">
      <ul>
        <li v-for="partyLog in savedPartyList" :key="partyLog.partyId">
          {{ partyLog.partyName }} ({{
            new Date(partyLog.startDateTS).toLocaleString()
          }})
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
</style>
