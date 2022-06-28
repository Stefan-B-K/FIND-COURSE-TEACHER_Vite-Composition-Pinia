<script setup>
import { computed, reactive } from "vue";
import BaseButton from "../ui/BaseButton.vue";

defineProps({ allAreas: Array })

const emit = defineEmits(['save-data'])

const data = reactive({
     firstName: { value: '', isValid: true },
     lastName: { value: '', isValid: true },
     description: { value: '', isValid: true },
     rate: { value: null, isValid: true },
     areas: { value: [], isValid: true },
     newArea: { value: '', isValid: true }
})

const formIsValid = computed(() => {
     for (let prop in data) {
          if (!data[prop].isValid) return false;
     }
     return true;
})

const validateForm = () => {
     if (data.firstName.value === '') data.firstName.isValid = false;
     if (data.lastName.value === '') data.lastName.isValid = false;
     if (data.description.value === '') data.description.isValid = false;
     if (data.rate.value === null || data.rate.value < 0) data.rate.isValid = false;
     if (data.areas.value.length === 0) data.areas.isValid = false;
}

const  submitForm = () => {
     if (data.newArea.value.length > 0) {
          data.areas.value.push(data.newArea.value)
     }
     validateForm()
     if (!formIsValid.value) return
     const formData = {
          firstName: data.firstName.value,
          lastName: data.lastName.value,
          description: data.description.value,
          hourlyRate: data.rate.value,
          areas: data.areas.value,
          available: true
     };
     emit('save-data', formData);
}

const clearInvalidPrompt = (input) => data[input].isValid = true

</script>


<template>
     <form @submit.prevent="submitForm">
          <div class="form-control" :class="{ invalid: !data.firstName.isValid }">
               <label for="first-name">First name</label>
               <input
                 v-model.trim="data.firstName.value"
                 type="text"
                 id="first-name"
                 @input="clearInvalidPrompt('firstName')"
               />
               <p v-if="!data.firstName.isValid">The field must not be empty!</p>
          </div>
          <div class="form-control" :class="{ invalid: !data.lastName.isValid }">
               <label for="last-name">Last name</label>
               <input
                 v-model.trim="data.lastName.value"
                 type="text"
                 id="last-name"
                 @input="clearInvalidPrompt('lastName')"
               />
               <p v-if="!data.lastName.isValid">The field must not be empty!</p>
          </div>
          <div class="form-control" :class="{ invalid: !data.description.isValid }">
               <label for="description">Description</label>
               <textarea
                 v-model.trim="data.description.value"
                 id="description"
                 rows="5"
                 @input="clearInvalidPrompt('description')"
               ></textarea>
               <p v-if="!data.description.isValid">The field must not be empty!</p>
          </div>
          <div class="form-control" :class="{ invalid: !data.rate.isValid }">
               <label for="rate">Hourly rate</label>
               <input
                 v-model.number="data.rate.value"
                 type="number"
                 id="rate"
                 @input="clearInvalidPrompt('rate')"
               />
               <p v-if="!data.rate.isValid">The field must not be empty or negative number!</p>
          </div>
          <h3 :class="{ invalid: !data.areas.isValid }">Areas of Specialization</h3>
          <div class="form-control mixed-inputs" :class="{ invalid: !data.areas.isValid }">
               <span v-for="area in allAreas" :key="area">
                    <input
                      v-model="data.areas.value"
                      type="checkbox"
                      :id="area"
                      :value="area"
                      @change="clearInvalidPrompt('areas')"
                    />
                    <label :for="area">{{ area }}</label>
               </span>
               <input
                 v-model.trim="data.newArea.value"
                 type="text"
                 id="new-area"
                 class="new-area"
                 @input="clearInvalidPrompt('areas')"
               />
               <label for="new-area" class="new-area">other</label>
          </div>
          <span v-if="!data.areas.isValid">At least one specialization must be checked
               or new/custom one filled in!</span>
          <div class="form-control mixed-inputs" >
               <BaseButton>Register</BaseButton>
               <h4 v-if="!formIsValid">Please fill the missing input data
                    in the fields marked with red!</h4>
          </div>
     </form>
</template>


<style scoped>
.form-control {
     margin: 1rem 0 0 0;
}

label, h3 {
     font-weight: bold;
     font-size: 1rem;
     display: block;
     margin: 1rem 0 0.5rem 0;
}

input[type='checkbox'] + label,
label.new-area {
     font-weight: normal;
     display: inline;
     margin: 0 0.5rem 0 0.2rem;
}

input,
textarea {
     display: block;
     width: 100%;
     border: 1px solid #ccc;
     font: inherit;
}

input:focus,
textarea:focus {
     background-color: #f0e6fd;
     outline: none;
     border-color: #3d008d;
}

input[type='checkbox'] {
     display: inline;
     width: auto;
     border: none;
     vertical-align: bottom;
}

.invalid label, h3.invalid {
     color: red;
}

.invalid input,
.invalid textarea {
     border: 1px solid red;
}

input.new-area {
     width: 150px;
     height: 20px;
     border: 1px solid #ccc;
     font: inherit;
     margin: 0 0.2rem 0 0.5rem;
}

.mixed-inputs {
     display: flex;
}

p, span {
     margin-top: 2px;
     font-size: small;
     font-weight: 100;
}

base-button {
     margin: 5px;
}

h4 {
     margin-top: 1rem;
}

</style>