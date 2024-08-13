<script setup lang="ts">
import { ref, Ref } from "vue";
import { PartyLog } from "@/Schema";
import { PartyLogControl } from "@/logic/PartyLogControl";

const emit = defineEmits<{
  (e: "selectParty", id: string | null): void;
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

<style scoped></style>
