<script setup>
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApplications } from "../../stores/applications.js";

const applications = useApplications()
const route = useRoute()
const router = useRouter()

const email = reactive({ value: '', isValid: true })
const message = reactive({ value: '', isValid: true })
const error = ref(null)

const formIsValid = computed(() => email.isValid && message.isValid)

const validateForm = () => {
     if (email.value === '') email.isValid = false;
     if (message.value === '') message.isValid = false;
}
const clearInvalidPrompt = input => [input].isValid = true
const  submitForm = async() => {
     validateForm();
     if (!formIsValid.value) return;
     try {
          await applications.contactTeacher({
               email: email.value,
               message: message.value,
               teacherId: route.params.id
          });
          router.replace('/teachers');
     } catch (err) {
          error.value = err.message;
     }
}
const handleError = () => {
     error.value = null;
     router.replace('/teachers');
}

</script>

<template>
     <div>
          <BaseDialog :show="!!error" @close="handleError" title="Error sending application!!!">
               <p>{{ error }}</p>
          </BaseDialog>
          <form @submit.prevent="submitForm">
               <div class="form-control" :class="{ invalid: !email.isValid }">
                    <label for="email">Your E-Mail</label>
                    <input
                      v-model.trim="email.value"
                      type="email"
                      id="email"
                      @input="clearInvalidPrompt('email')"
                    />
                    <p v-if="!email.isValid">Must provide a valid e-mail!</p>
               </div>
               <div class="form-control" :class="{ invalid: !message.isValid }">
                    <label for="message">Message</label>
                    <textarea
                      v-model.trim="message.value"
                      id="message"
                      rows="5"
                      @input="clearInvalidPrompt('message')"
                    ></textarea>
                    <p v-if="!message.isValid">Enter some message to send to the teacher!</p>
               </div>
               <div class="actions">
                    <BaseButton>Send</BaseButton>
                    <h4 v-if="!formIsValid">Please provide valid data
                         in the fields marked with red!</h4>
               </div>
          </form>
     </div>
</template>


<style scoped>
form {
     margin: 1rem;
     border: 1px solid #ccc;
     border-radius: 12px;
     padding: 1rem;
}

.form-control {
     margin: 0.5rem 0;
}

label {
     font-weight: bold;
     margin-bottom: 0.5rem;
     display: block;
}

input,
textarea {
     display: block;
     width: 100%;
     font: inherit;
     border: 1px solid #ccc;
     padding: 0.15rem;
}

input:focus,
textarea:focus {
     border-color: #3d008d;
     background-color: #faf6ff;
     outline: none;
}

.invalid label {
     color: red;
}

.invalid input,
.invalid textarea {
     border: 1px solid red;
}

.actions {
     text-align: center;
}

p {
     margin-top: 2px;
     font-size: small;
     font-weight: 100;
}

base-button {
     margin: 5px;
}
</style>