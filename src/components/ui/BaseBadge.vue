<script setup>
defineProps({ title: String });
</script>


<template>
  <span class="badge">
    {{ title.toUpperCase() }}
  </span>
</template>


<style scoped>
.badge {
  background-color: #3d008d;
  color: white;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  display: inline-block;
  margin-right: 0.5rem;
}
</style>