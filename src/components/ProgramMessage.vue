<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '../myTypes'
const emit = defineEmits(['finishProgram'])

defineProps<{ program: Message }>()

function nextProgram(){
  emit("finishProgram");
}

</script>

<template>
  <div>
    <p>{{ program.message }}</p>
    <input type="button" value="次へ" @click="nextProgram">
  </div>
</template>

<style scoped>

</style>
