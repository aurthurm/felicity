<template>
  <div class="">
      <section class="col-span-12" >

        <!-- Sample and Case Data -->
        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
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

        <div>
          <tab-samples v-if="currentTab === 'samples'" target="patient-samples" :targetUid="patient?.uid"/>
          <tab-cases v-if="currentTab === 'cases'" />
          <tab-logs v-if="currentTab === 'logs'"/>
        </div>

      </section>

  </div>

</template>

<style lang="postcss" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}
</style>

<script lang="ts">
import tabSamples from '../../_components/AnalyisRequestListing.vue';
import tabCases from '../comps/CaseTable.vue';
import tabLogs from '../../_components/AuditLog.vue';

import { defineComponent, ref, toRefs, computed, PropType } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'patient-detail',
  components: {
    tabSamples,
    tabCases,
    tabLogs,
  },
  setup() {
    let store = useStore();

    let currentTab = ref('samples');
    const tabs = ['samples', 'cases', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    return {
      tabs,
      currentTab,
      currentTabComponent,
      patient: computed(() => store.getters.getPatient),
    };
  },
});
</script>
