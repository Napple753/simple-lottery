<script setup lang="ts">
import { DisplayWinner, Candidate, Log } from '../myTypes'
const emit = defineEmits(['finishProgram'])

defineProps<{ 
  program: DisplayWinner,
  winnersLog: Log<Candidate>
}>()

function nextProgram(){
  emit("finishProgram");
}

</script>

<template>
  <div class="program">
    <h1>ここまでの当選者</h1>
    <div class="winners_list">
      <div v-for="prize in winnersLog" class="prize">
        <h2>{{ prize.prizeName }}</h2>
        <table>
          <tr v-for="winner in prize.selected">
            <td v-for="cell in winner.data">{{ cell }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="button_wrapper">
      <input type="button" value="次へ" @click="nextProgram">
    </div>
  </div>
</template>

<style scoped>
.winners_list{
  height:100%;
  overflow-y: scroll;
  width:100vw;
  column-count: 2;
  padding: 1rem 2rem;
  box-sizing: border-box;
}
.prize{
  break-inside: avoid;
}
table, tr,td{
  border:none;
}
td{
  padding: 0 1em;
}
</style>
