<script setup>
import { computed } from "vue";
import { useRoute } from 'vue-router'

const props = defineProps({ teacher: Object })

const fullName = computed(() => props.teacher.firstName + ' ' + props.teacher.lastName)
const rate = computed(() => props.teacher.hourlyRate + '$/hour')
const available = computed(() => props.teacher.available ? 'Available' : 'Not Available')
const route = useRoute()
const contact = computed(() => `${route.path}/${props.teacher.id}/contact`)
const details = computed(() => `${route.path}/${props.teacher.id}`)

</script>


<template>
     <li>
          <h3>{{ fullName }}</h3>
          <h4>{{ rate }}</h4>
          <h5> {{ available }}</h5>
          <div>
               <BaseBadge
                 v-for="area in teacher.areas"
                 :key="area"
                 :title="area"
               ></BaseBadge>
          </div>
          <div class="actions">
               <BaseButton link :to="contact" mode="outline">Contact</BaseButton>
               <BaseButton link :to="details">View Details</BaseButton>
          </div>
     </li>
</template>


<style scoped>
li {
     margin: 1rem 0;
     border: 1px solid #424242;
     border-radius: 12px;
     padding: 1rem;
}

h3 {
     font-size: 1.5rem;
}

h3, h4, h5 {
     margin: 0.5rem 0;
}

h5 {
     font-style: italic;
}

div {
     margin: 0.5rem 0;
}

.actions {
     display: flex;
     justify-content: flex-end;
}
</style>