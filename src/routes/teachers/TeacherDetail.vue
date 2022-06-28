<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useTeachers } from "../../stores/teachers.js";

const teachers = useTeachers();
const route = useRoute();

const props = defineProps({ id: String });                    // from path in router.js

const teacher = ref(null);
teacher.value = teachers.teachers.find(teacher => teacher.id === props.id);

const fullName = computed(() => teacher.value.firstName + " " + teacher.value.lastName);
const rate = computed(() => teacher.value.hourlyRate + "$/hour");
const available = computed(() => teacher.value.available ? "Available" : "Not Available");
const contact = computed(() => `${route.path}/contact`);

</script>


<template>
     <div>
          <section>
               <BaseCard>
                    <h2>{{ fullName }}</h2>
                    <h3>{{ rate }}</h3>
                    <h4>{{ available }}</h4>
               </BaseCard>
          </section>
          <section>
               <BaseCard>
                    <header><h2>Interested? Reach out now!</h2>
                         <BaseButton link :to="contact">Contact</BaseButton>
                    </header>
                    <RouterView />
               </BaseCard>
          </section>
          <section>
               <BaseCard>
                    <BaseBadge v-for="area in teacher.areas" :key="area" :title="area" />
                    <p>{{ teacher.description }}</p>
               </BaseCard>
          </section>
     </div>
</template>