<script setup>
import { useTeachers } from "../../stores/teachers.js";
import { computed, ref, watch } from "vue";

const teachers = useTeachers();
const areasChecked = ref(teachers.areas);

const allAreas = computed(() => teachers.areas);
watch(allAreas, newValue => areasChecked.value = newValue);

const emit = defineEmits(["change-filter"]);

const setFilter = (event) => {
     const areaChanged = event.target.id;
     if (event.target.checked) {
          areasChecked.value.push(areaChanged);
     } else {
          areasChecked.value = areasChecked.value.filter(area => area !== areaChanged);
     }
     emit("change-filter", areasChecked.value);
};

</script>


<template>
     <BaseCard>
          <h2>Find Your Teacher</h2>
          <span v-for="area in allAreas" :key="area" class="filter-option">
               <input type="checkbox" :id="area" checked @change="setFilter">
               <label :for="area">{{ area }}</label>
          </span>
     </BaseCard>
</template>


<style scoped>
h2 {
     margin: 0.5rem 0;
}

.filter-option {
     margin-right: 1rem;
}

.filter-option label,
.filter-option input {
     vertical-align: middle;
}

.filter-option label {
     margin-left: 0.25rem;
}

.filter-option.active label {
     font-weight: bold;
}
</style>