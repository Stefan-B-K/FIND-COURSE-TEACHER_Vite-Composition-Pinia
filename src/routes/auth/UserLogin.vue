<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth.js";
import { useTeachers } from "../../stores/teachers.js";
import { useApplications } from "../../stores/applications.js";

const auth = useAuth();
const teachers = useTeachers();
const applications = useApplications();
const router = useRouter();

const email = reactive({ value: "", isValid: true });
const password = reactive({ value: "", isValid: true });
const mode = ref("login");
const isLoading = ref(false);
const error = ref(null);

const formIsValid = computed(() => email.isValid && password.isValid);
const submitButtonCaption = computed(() => mode.value === "login" ? "Log In" : "Sign Up");
const switchButtonCaption = computed(() => mode.value === "login" ? "You have no account? Sign up instead!" : "Already registered? Log in!");

const validateForm = () => {
     if (email.value === "") email.isValid = false;
     if (password.value.length < 6) password.isValid = false;
};
const clearInvalidPrompt = input => [input].isValid = true;
const submitForm = async () => {
     validateForm();
     if (!formIsValid.value) return;

     const userInputData = [
          {
               email: email.value,
               password: password.value
          },
          mode.value
     ];

     try {
          if (mode.value === "signup") isLoading.value = true;
          await auth.authorize(userInputData);

          for (let teacher of teachers.teachers) {
               if (teacher.id === auth.userId) {
                    teachers.setUserIsTeacher();
                    await applications.fetchApplications();
               }
          }

          if (mode.value === "login") router.replace("/teachers");
     } catch (err) {
          error.value = err.message;
     }
};
const switchAuthMode = () => {
     if (mode.value === "login") mode.value = "signup";
     else mode.value = "login";
};
const handleError = () => {
     isLoading.value = false;
     error.value = null;
};
const closeDialog = () => {
     isLoading.value = false;
     router.replace("/teachers");
};

</script>


<template>
     <BaseCard>
          <BaseDialog :show="!!error" @close="handleError" title="Error authenticating at Firebase!!!">
               <h4>{{ error }}</h4>
          </BaseDialog>
          <BaseDialog
            :show="isLoading && !!!error"
            @close="closeDialog"
            title="Registration"
            :fixed="!auth.userIsLoggedIn">
               <BaseSpinner v-if="!auth.userIsLoggedIn"></BaseSpinner>
               <h3 v-else>Successfully signed up!</h3>
          </BaseDialog>
          <form @submit.prevent="submitForm">
               <div class="form-control">
                    <label for="email" :class="{ invalid: !email.isValid }">Email</label>
                    <input
                      v-model.trim="email.value"
                      type="email"
                      id="email"
                      :class="{ invalid: !email.isValid }"
                      @input="clearInvalidPrompt('email')"
                    />
               </div>
               <p v-if="!email.isValid">Please provide a valid email</p>
               <div class="form-control">
                    <label for="password" :class="{ invalid: !password.isValid }">Password</label>
                    <input v-model.trim="password.value"
                           type="password"
                           id="password"
                           :class="{ invalid: !password.isValid }"
                           @input="clearInvalidPrompt('password')"
                    />
               </div>
               <p v-if="!password.isValid">Please enter a password of minimum 6 characters</p>
               <div class="actions">
                    <BaseButton>{{ submitButtonCaption }}</BaseButton>
                    <BaseButton type="button" mode="outline" @click="switchAuthMode">
                         {{ switchButtonCaption }}
                    </BaseButton>
               </div>
          </form>
     </BaseCard>
</template>


<style scoped>
form {
     margin: 1rem;
     padding: 1rem;
}

.form-control {
     margin: 1rem 0 0.2rem 0;
}

label {
     font-weight: bold;
     margin-bottom: 0.5rem;
     display: block;
}

input {
     display: block;
     width: 100%;
     font: inherit;
     border: 1px solid #ccc;
     padding: 0.15rem;
}

input:focus {
     border-color: #3d008d;
     background-color: #faf6ff;
     outline: none;
}

label.invalid {
     color: red;
}

input.invalid {
     border: 1px solid red;
}

.actions {
     display: flex;
     margin-top: 10px;
}

p {
     margin-top: 2px;
     font-size: small;
     font-weight: 100;
}


</style>