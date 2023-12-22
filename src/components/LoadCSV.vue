<script setup lang="ts">
import { onMounted } from 'vue'
import { Person } from '../myTypes'

const emit = defineEmits(['loadNames'])

onMounted(()=>{
  const fileInput = document.querySelector("input[type=file]");
  if(fileInput==null)return;

  fileInput.addEventListener("change", () => {
    const [file] = fileInput.files;
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const res = reader.result;
        if(res==null) return;
        const rows = (res as string).split("\n");
        rows.splice(0,1);
        const persons = rows.map(line=>{
          const cells = line.split(",");
          return {
            id:cells[0],
            name:cells[1],
            ruby:cells[2],
          } as Person
        })
        emit("loadNames",persons)
      });
      reader.readAsText(file);
    }
  });
});



</script>

<template>
  <div>
    <input type="file" accept="csv">
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
