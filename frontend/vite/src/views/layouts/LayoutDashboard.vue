<template>
  <div class="h-screen bg-gray-200 font-roboto antialiased">
    <div class="flex flex-row">
      <div class="min-h-screen bg-gray-700">
        <side-bar />
      </div>
      <div class="flex-1">
        <header-main />
        <main class="bg-gray-100 p-8 overflow-y-scroll overscroll-contain">
          <slot />
        </main>
      </div>
    </div>
  </div>
  <!-- <footer-main><slot /></footer-main> -->
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import SideBar from '../_components/nav/NavigationAside.vue';
import HeaderMain from '../_components/nav/NavigationMain.vue';
import FooterMain from '../_components/FooterMain.vue';
export default defineComponent({
  components: {
    HeaderMain,
    SideBar,
    FooterMain,
  },
});
</script>