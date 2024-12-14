import { defineStore } from "pinia";
import { ref } from "vue";

export const useReviveCancelledStore = defineStore("reviveCancelled", () => {
  const reviveCancelled = ref(false);
  function enableReviveCancelled() {
    reviveCancelled.value = true;
  }
  function disableReviveCancelled() {
    reviveCancelled.value = false;
  }
  return {
    reviveCancelled,
    enableReviveCancelled,
    disableReviveCancelled,
  };
});
