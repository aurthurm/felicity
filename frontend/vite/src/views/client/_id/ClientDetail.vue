<template>

  <nav class="bg-white pt-2 shadow-md mt-2">
    <div class="-mb-px flex justify-start">
      <a
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
          { 'tab-active': currentTab === tab },
        ]"
        @click="currentTab = tab"
        href="#"
      >
        {{ tab }}
      </a>
    </div>
  </nav>

  <tab-samples v-if="currentTab === 'samples'" />
  <tab-contacts v-if="currentTab === 'contacts'" :clientUid="client?.uid" />

</template>

<style lang="postcss">
.scroll-section {
  height: 400px;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}

.c-active {
  background-color: lightblue;
}
</style>

<script scope="ts">
import { useStore } from 'vuex';
import { defineComponent, ref, reactive, computed } from 'vue';


import tabSamples from '../../_components/SampleListing.vue';
import tabContacts from '../comps/ContactTable.vue';

import { ActionTypes } from '../../../store/modules/clients';
import { ActionTypes as AdminActionTypes } from '../../../store/modules/admin';

export default defineComponent({
  name: 'clients-detail',
  components: {
    tabSamples,
    tabContacts,
  },
  setup() {
    const store = useStore();

    let currentTab = ref('samples');
    const tabs = ['samples', 'contacts'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let client = computed(() => store.getters.getClient)

    return {
      tabs,
      currentTab,
      currentTabComponent,
      client,
    };
  },
});
</script>
