<script setup>
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: false
  },
  fixed: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['close'])

const  tryClose = () => {
  if (props.fixed) return;
  emit('close');
}
</script>


<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="show" @click="tryClose" class="backdrop"></div>
    </transition>
    <transition name="dialog">
      <dialog open v-if="show">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu v-if="!fixed">
          <slot name="actions">
            <BaseButton @click="tryClose">Close</BaseButton>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>


<style scoped>
.backdrop {
     position: fixed;
     top: 0;
     left: 0;
     height: 100vh;
     width: 100%;
     background-color: rgba(0, 0, 0, 0.75);
     z-index: 10;
}

dialog {
     position: fixed;
     top: 20vh;
     left: 10%;
     width: 80%;
     z-index: 100;
     border-radius: 12px;
     border: none;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
     padding: 0;
     margin: 0;
     overflow: hidden;
     background-color: white;
}

header {
     background-color: #3a0061;
     color: white;
     width: 100%;
     padding: 1rem;
}

header h2 {
     margin: 0;
}

section {
     padding: 1rem;
}

menu {
     padding: 1rem;
     display: flex;
     justify-content: flex-end;
     margin: 0;
}

.backdrop-enter-from,
.backdrop-leave-to  {
     background-color: rgba(0, 0, 0, 0);
}

.backdrop-enter-to,
.backdrop-leave-from  {
     background-color: rgba(0, 0, 0, 0.7);
}

.backdrop-enter-active {
     transition:  all  0.4s ease-out;
}

.backdrop-leave-active {
     transition:  all  0.4s ease-in;
}

.dialog-enter-from,
.dialog-leave-to {
     transform: scale(0.7);
     opacity: 0;
}

.dialog-enter-to,
.dialog-leave-from{
     transform: scale(1);
     opacity: 1;
}

.dialog-enter-active {
     transition:  all  0.4s ease-out;
}

.dialog-leave-active {
     transition:  all  0.4s ease-in;
}

@media (min-width: 768px) {
     dialog {
          left: calc(50% - 20rem);
          width: 40rem;
     }
}
</style>