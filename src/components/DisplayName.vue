<script setup lang="ts">
import { ref } from 'vue'
import { Person } from '../myTypes'

defineProps<{ person: Person }>()


</script>

<template>
  <div class="person">
    <p class="person_id">{{ person.id }}</p>
    <p class="person_name">{{ person.name }}</p>
    <p class="person_ruby">{{ person.ruby }}</p>
  </div>
</template>

<style scoped>
.person{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:10rem;
  width:100%;
  box-sizing: border-box;
  border:1px solid grey;
  margin:0;
  padding:0;
  flex-shrink: 0;
}
.person p{
  margin:0;
  user-select: all;
}

.person_id{
  font-size: 1rem;
}
.person_name{
  font-size: 2rem;
  font-weight: 800;
}
.person_ruby{
  font-size:1rem;
}
</style>
