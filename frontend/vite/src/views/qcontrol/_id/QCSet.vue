<template>
  some heasdr stuff here

  <hr>

  <section class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Analysis</th>
              <th v-for="level in qcSet?.levels" :key="level.uid"
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"
              >{{ level?.level }}</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr
              v-for="analyte in qcSet?.analytes" :key="analyte.uid"
          >
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">
                       {{analyte?.name}} 
                  </div>
              </td>
              <td 
              v-for="result in analyte?.items" :key="result.uid"
              class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <!-- <div class="text-sm leading-5 text-blue-900"> {{ result?.sample?.qcLevel?.level }}</div> -->
                <div  v-if="!isEditable(result)" class="text-sm leading-5 text-blue-900" >{{ result?.result  }}</div>
                <label v-else-if="result?.analysis?.resultoptions?.length < 1" class="block" >
                  <input class="form-input mt-1 block w-full" v-model="result.result" @keyup="check(result)"/>
                </label>
                <label v-else class="block col-span-2 mb-2" >
                    <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                      <option value=""></option>
                      <option  
                      v-for="(option, index) in result?.analysis?.resultoptions"
                      :key="option.optionKey"
                      :value="option.value" >{{ option.value }}</option>
                  </select>
                </label>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </section>

</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { ActionTypes } from '../../../store/modules/samples';
import { isNullOrWs } from '../../../utils';

export default defineComponent({
  name: 'qcset-detail',
  setup() {
    let store = useStore();
    let route = useRoute();

    store.dispatch(ActionTypes.FETCH_QC_SET_BY_UID, route.params.qcSetUid)

    let qcSet = computed(() => {
      let set = store.getters.getQCSet;
      if(!set) return;
      let final = new Object();
      final.levels = []; // table headers
      final.analytes = []; // table rows
      set?.samples?.forEach(sample => {
        if(!sample.assigned) {
          if(!final.levels.some(l => l.uid == sample?.qcLevel?.uid)){
            final.levels.push(sample?.qcLevel);
          }
          sample?.analysisResults?.forEach(result => {
            if(!final.analytes.some(a => a.uid == result?.analysis?.uid)){
              final.analytes.push(result?.analysis)
            }
            const index = final.analytes.findIndex(a => a.uid == result?.analysis?.uid);
            if(final.analytes[index]["items"]){
              if(!final.analytes[index]["items"]?.some(a => a.sampleUid === result.sampleUid)){
                final.analytes[index]["items"].push({ ...result, sample }) 
              }
            } else {
              final.analytes[index]["items"] = [{ ...result, sample }]
            }
          })
        }
      })

      return { 
        levels: final.levels, 
        analytes: final.analytes,
      };
    });

    function check(result): void {
      result.checked = true;
    }

    function editResult(result: any): void {
      result.editable = true;
    }

    function isEditable(result): Boolean {
      console.log(result)
      if(result?.editable || isNullOrWs(result?.result)) {
        editResult(result)
        return true
      };
      return false;
    }

    return {
      qcSet,
      check,
      isEditable,
    };
  },
});



</script>
