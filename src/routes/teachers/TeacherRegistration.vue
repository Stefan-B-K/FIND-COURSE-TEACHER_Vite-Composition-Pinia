<script setup>
import { ref } from "vue";
import { useTeachers } from "../../stores/teachers.js";
import { useRouter } from "vue-router";
import TeacherForm from "../../components/teachers/TeacherForm.vue";

const teachers = useTeachers();
const router = useRouter();

const isLoading = ref(false);
const error = ref(null);

const registerTeacher = async (newOne) => {
     try {
          isLoading.value = true;
          await teachers.addTeacher(newOne);
          isLoading.value = false;
          router.replace("/teachers");
     } catch (err) {
          error.value = err.message;
     }
};
const handleError = () => {
     isLoading.value = false;
     error.value = null;
     router.replace("/teachers");
};

</script>


<template>
     <div>
          <BaseDialog :show="!!error" @close="handleError" title="Error sending registration request!!!">
               <p>{{ error }}</p>
          </BaseDialog>
          <section>
               <BaseCard><h2>Register as a teacher now!</h2>
                    <div v-if="isLoading">
                         <BaseSpinner />
                    </div>
                    <TeacherForm v-else :allAreas="teachers.areas" @save-data="registerTeacher" />
               </BaseCard>
          </section>
     </div>
</template>


<style scoped>
</style>