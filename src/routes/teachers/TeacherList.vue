<script setup>
import { computed, ref } from "vue";
import { useAuth } from "../../stores/auth.js";
import { useTeachers } from "../../stores/teachers.js";
import TeacherItem from "../../components/teachers/TeacherItem.vue";
import TeacherFilter from "../../components/teachers/TeacherFilter.vue";

const auth = useAuth();
const teachers = useTeachers();

const areasChecked = ref([]);
const isLoading = ref(false);
const error = ref(null);

const filteredTeachers = computed(() => {
     return teachers.teachers.filter(teacher => {
          for (let area of areasChecked.value) {
               if (teacher.areas.includes(area)) return true;
          }
          return false;
     });
});

const setAreas = (updatedAreas) => areasChecked.value = updatedAreas;
const refreshTeachers = async () => {
     try {
          isLoading.value = true;
          await teachers.fetchTeachers();
          isLoading.value = false;
          areasChecked.value = teachers.areas;
     } catch (err) {
          error.value = err.message;
     }
};

if (!teachers.teachersLoaded) await refreshTeachers();
else areasChecked.value = teachers.areas;

const handleError = () => {
     isLoading.value = false;
     error.value = null;
};

</script>


<template>
     <div>
          <BaseDialog :show="!!error" @close="handleError" title="Error fetching teachers!!" >
               <p>{{ error }}</p>
          </BaseDialog>
          <section>
               <TeacherFilter @change-filter="setAreas" />
          </section>
          <section>
               <BaseCard>
                    <div class="controls">
                         <BaseButton @click="refreshTeachers" v-if="!isLoading" mode="outline">Refresh</BaseButton>
                         <BaseButton
                           v-if="auth.userIsLoggedIn && !teachers.userIsTeacher && !isLoading"
                           link to="/register">
                              Register as Teacher
                         </BaseButton>
                    </div>
                    <div v-if="isLoading">
                         <BaseSpinner />
                    </div>
                    <ul v-else-if="teachers.teachersLoaded">
                         <TeacherItem v-for="teacher in filteredTeachers" :key="teacher.id" :teacher="teacher" />
                    </ul>
                    <h3 v-else>No teachers found.</h3>
               </BaseCard>
          </section>
     </div>
</template>


<style scoped>
ul {
     list-style: none;
     margin: 0;
     padding: 0;
}

.controls {
     display: flex;
     justify-content: space-between;
}
</style>