<template>
  <div class="">
    <div class="flex justify-between items-center">
        <div class="my-4 flex sm:flex-row flex-col">
          <div class="flex flex-row mb-1 sm:mb-0">
              <div class="relative">
                  <select class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option>5</option>
                      <option>10</option>
                      <option>20</option>
                  </select>
                  <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                  </div>
              </div>
              <div class="relative">
                  <select
                      class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                      <option>All</option>
                      <option>To be Verified</option>
                      <option>Verified</option>
                      <option>Published</option>
                  </select>
                  <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                  </div>
              </div>
          </div>
          <div class="block relative">
              <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                      <path
                          d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                      </path>
                  </svg>
              </span>
              <input placeholder="Search by Profile ..."
                  class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
          </div>
      </div>
      <button
      @click.prevent="FormManager(true)"
       class="p-2 h-10 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add WorkSheet</button>
    </div>

   
    <!-- Sampe Table View -->
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">WorkSheet ID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Analysis/Test</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Samples</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Instrument</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Analyst</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr
                v-for="worksheet in woksheets" :key="worksheet.uid"
            >
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <!-- <span v-if="worksheet.priority > 1"
                    :class="[
                        'font-small',
                        { 'text-red-700': worksheet.priority > 1 },
                    ]">
                        <i class="fa fa-star"></i>
                    </span> -->
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">
                      <router-link :to="{ name: 'worksheet-detail', params: { workSheetUid: worksheet?.uid  }}">{{ worksheet.worksheetId }}</router-link>
                    </div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ analysesText(worksheet.analyses) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ worksheet?.assignedCount }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ worksheet?.instrument?.name || "None" }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ analystName(worksheet?.analyst) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ worksheet.state || "unknown" }}</button>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <!-- <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button> -->
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">

          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Analyst</span>
            <select class="form-select block w-full mt-1" v-model="form.analystUid">
               <option></option>
              <option v-for="analyst in analysts" :key="analyst.uid" :value="analyst.uid">{{ analystName(analyst) }} </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Worksheet Template</span>
            <select class="form-select block w-full mt-1" v-model="form.templateUid">
               <option></option>
              <option v-for="template in workSheetTemplates" :key="template.uid" :value="template.uid">{{ template.name }}</option>
            </select>
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>


</template>

<script lang="ts">
import modal from '../_components/SimpleModal.vue';

import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes, IWorkSheet } from '../../store/modules/worksheets';
import { ActionTypes as BaseActionTypes } from '../../store/actions';
import { ADD_WORKSHEET } from '../../graphql/worksheet.mutations'
export default defineComponent({
  name: "Samples",
  components: {
      modal,
  },
  setup() {    
    const store = useStore();
    
    let showModal = ref(false);
    let formTitle = ref('');
    let form = reactive({ ...Object });
    const formAction = ref(true);

    store.dispatch(ActionTypes.REMOVE_WORKSHEET)
    store.dispatch(ActionTypes.FETCH_WORKSHEETS);
    store.dispatch(ActionTypes.FETCH_WORKSHEET_TEMPLATES);
    store.dispatch(BaseActionTypes.FETCH_USERS);
    // fetch instruments, analysts, methods
    const woksheets = computed(() =>store.getters.getWorkSheets)

    const { executeMutation: createWorkSheet } = useMutation(ADD_WORKSHEET);

    function addWorksheet(): void {
      console.log(form)
      createWorkSheet(form).then((result) => {
       store.dispatch(ActionTypes.ADD_ANALYSES_CATEGORY, result);
      });
    }

    function analysesText(analyses: IAnalysis[]): string {
        let names = [];
        analyses.forEach(a => names.push(a.name));
        return names.join(', ');
    }

    function FormManager(create):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "WORKSHEET";
      if (create) {
        let obj = new Object();
        obj.analystUid = null;
        obj.templateUid = null;
        Object.assign(form, { ...obj });
      } else {
        console.log("This path is not possible !!!!!")
      }
    }

    function saveForm():void {
      if (formAction.value === true) addWorksheet();
      // showModal.value = false;
    }

    return {
      showModal, 
      FormManager,
      form,
      formTitle,
      saveForm,
      woksheets,
      analysesText,
      analysts: computed(() => store.getters.getUsers),
      workSheetTemplates: computed(() => store.getters.getWorkSheetTemplates),
      analystName: (analyst) => {
          if(analyst?.auth?.userName) return analyst?.auth?.userName;
          if(analyst?.firstName) return analyst.firstName + ' ' + analyst.lastName;
          return "----";
      },
    };
  },
});
</script>
