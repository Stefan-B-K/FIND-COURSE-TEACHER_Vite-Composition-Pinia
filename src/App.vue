<script setup>
import { computed, watch } from "vue";
import { useAuth } from "./stores/auth.js";
import { useTeachers } from "./stores/teachers.js";
import { useRouter } from 'vue-router'
import TheHeader from "./components/layout/TheHeader.vue";

const auth = useAuth()
const teachers = useTeachers()

auth.keepLogin()
teachers.fetchTeachers()

const userIsLoggedIn = computed(() => auth.userIsLoggedIn)
const router = useRouter()

watch(userIsLoggedIn, (newValue) => {
  if (!newValue) router.replace('/teachers')
})
</script>


<template>
     <TheHeader />
     <Suspense>
          <RouterView v-slot="slotProps">
               <transition name="route" mode="out-in">
                    <component :is="slotProps.Component"></component>
               </transition>
          </RouterView>
     </Suspense>
</template>


<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
     box-sizing: border-box;
}

html {
     font-family: "Roboto", sans-serif;
}

body {
     margin: 0;
}

.route-enter-active {
     animation: fade-in 0.3s ease-out;
}

.route-leave-active {
     animation: fade-in 0.3s ease-in reverse;
}


@keyframes fade-in {
     from {
          opacity: 0
     }
     to {
          opacity: 1;
     }
}

</style>