<script setup>
import { computed } from "vue";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps({ application: Object })

const emit = defineEmits(['delete-app'])

const emailLink = computed(() => 'mailto: ' + props.application.userEmail)

const deleteApplication = () => emit('delete-app', props.application.id)

</script>


<template>
     <li>
          <div class="controls">
               <div>
                    <div>
                         <a :href="emailLink">{{ application.userEmail }}</a>
                    </div>
                    <p>{{ application.message }}</p>
               </div>
               <BaseButton @click="deleteApplication" mode="outline">Delete</BaseButton>
          </div>
     </li>
</template>


<style scoped>
li {
     margin: 1rem 0;
     border: 1px solid #ccc;
     padding: 1rem;
}

a {
     color: #3d008d;
     text-decoration: none;
     font-weight: bold;
}

a:hover,
a:active {
     color: #8d007a;
}

p {
     margin: 0.5rem 0 0 0;
}

.controls {
     display: flex;
     justify-content: space-between;
}
</style>