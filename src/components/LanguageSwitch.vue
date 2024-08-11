<script setup lang="ts">
import { language_names } from "@/i18n";
</script>

<template>
  <div style="width: 10em">
    <v-select
      density="compact"
      v-model="$i18n.locale"
      label="Language"
      :items="language_names"
      item-title="title"
      item-value="id"
    ></v-select>
  </div>
</template>

<style scoped></style>
