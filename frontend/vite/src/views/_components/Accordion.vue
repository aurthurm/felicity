<template>
  <transition name="accordion">
    <div class="rounded-sm my-1">
      <div class="border border-b-1 bg-gray-100 px-4 p-2">
        <button @click="show=!show" class="w-full flex justify-between text-gray-800 font-bold hover:underline focus:outline-none" type="button">
         <span>
           <slot name="title">Accordion Title</slot>
         </span>
         <span class="ml-2">
           <i class="fa fa-chevron-down"></i>
          </span>
        </button>
      </div>
      <div v-show="show" class="border border-b-0 px-4 py-2">
        <slot name="body">Accordion Body</slot>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss">
</style>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: "accordion",
  setup() {
    let show = ref(false);
    return { show };
  },
});
</script>

