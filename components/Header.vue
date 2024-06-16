<script setup>
defineProps({
  title: String
});
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
h1 {
  padding: 2px 5px 2px 5px;
  margin: 0 0 12px 0;
  color: white;
  font-size: 28px;
  font-weight: bold;
}
</style>