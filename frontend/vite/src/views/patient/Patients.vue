<template>

    <div>
      <input
        class="w-1/4 pl-4 h-10 pr-2 py-1 my-4 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Patient Search ..." aria-label="Search"
        v-model="patientSearch"
        @keyup="searchPatients($event)"
        @focus="setPatientToNull()"
      />
    </div>
    <hr />

    <!-- Patients Table View -->
    <div class="overflow-x-auto my-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">PatientID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Full Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Age</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Gender</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client Patient Id</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Province</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">District</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
              <tr 
              v-for="pt in patients"
              :key="pt.patientId">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="flex items-center">
                      <div class="text-sm leading-5 text-gray-800">{{ pt.patientId }}</div>
                  </div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'patient-detail', params: { patientUid: pt?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">{{ getPatientFullName(pt) }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt.age }} yrs</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ getGender(pt.gender) }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt.clientPatientId }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.district?.province?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.district?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ pt?.client?.name }}</div>
                  </td>
    
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                      <a 
                      @click.prevent="addSample(pt)"
                      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Analysis Request</a >
                  </td>
              </tr>
            </tbody>
        </table>
        </div>
    </div>

    <hr class="my-2">
    <div class="flex content-start items-center">
      <span class="text-blue-500"><i class="fas fa-info-circle"></i></span>
      <p class="ml-2 italic text-red-500">Click register when you dont find your patient during search*</p>
    </div>
    <hr class="my-2">

    <router-link
      :to="{ name: 'patients-register', query: { cpid: patientSearch } }"
      class="px-4 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded focus:outline-none hover:bg-blue-500 hover:text-gray-100">
      Register New Patiet
    </router-link>

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
import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { useRouter  } from 'vue-router';
import { useQuery } from '@urql/vue';
import { IPatient, Patient } from '../../store/modules/patients';
import { GET_ALL_PATIENTS, SEARCH_PATIENTS } from '../../graphql/patient.queries';
import {  GET_ALL_CLIENTS } from '../../graphql/clients.queries';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';
import { ADD_PATIENT } from '../../graphql/patient.mutations';

export const IPatient = typeof Patient;

import { ActionTypes } from '../../store/modules/patients';
import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';

export default defineComponent({
  name: 'patients',

  setup(context) {
    let store = useStore();
    let router = useRouter();


    const nullPatient = new Patient();
    let createAction = ref(true);
    let showModal = ref(false);

    let currentTab = ref('samples');
    const tabs = ['samples', 'cases', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let patientForm = reactive({ ...nullPatient });
    let patientSearch = ref('');

    let provinces = ref([]);
    let districts = ref([]);

    let countryUid = ref(null);
    let provinceUid = ref(null);

    const genders = ["Male", "Female", "Missing", "Trans Gender"]

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);    
    store.dispatch(ActionTypes.FETCH_PATIENTS);

    const { data: clients, fetching: CFetching, error: CError } = useQuery({
      query: GET_ALL_CLIENTS,
    });

    const { executeMutation: createPatient } = useMutation(ADD_PATIENT);

    const provincesfilter = useQuery({
      query: FILTER_PROVINCES_BY_COUNTRY,
      variables: { uid: countryUid },
      pause: computed(() => countryUid !== null), // not working
      requestPolicy: 'network-only',
    });

    const districtsfilter = useQuery({
      query: FILTER_DISTRICTS_BY_PROVINCE,
      variables: { uid: provinceUid },
      pause: computed(() => provinceUid !== null), // not working
      requestPolicy: 'network-only',
    });

    function addPatient() {
      createPatient({ clientPatientId: patientForm.clientPatientId, firstName: patientForm.firstName,
        middleName: patientForm.middleName, lastName: patientForm.lastName, age: patientForm.age,
        gender: patientForm.gender, dateOfBirth: patientForm.dateOfBirth, ageDobEstimated: patientForm.ageDobEstimated,
        clientUid: patientForm.clientUid, phoneMobile: patientForm.phoneMobile, consentSms: patientForm.consentSms, 
      }).then(result => store.dispatch(ActionTypes.ADD_PATIENT, result));
    }

    function getProvinces(event) {
      provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        provinces.value = result.data.value?.provincesByCountryUid;
      });
    }

    function getDistricts(event) {
      districtsfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        districts.value = result.data.value?.districtsByProvinceUid;
      });
    }

    function searchPatients(event) {
      store.dispatch(ActionTypes.SEARCH_PATIENTS, event.target.value);
    }

    function isPatientSelected() {
      return patientForm.patientId !== undefined;
    }

    let getPatientFullName = (pt) => {
      return pt.firstName + ' ' + pt.lastName;
    };

    let getGender = pos => genders[pos];

    let selectPatient = (pt) => {
      Object.assign(patientForm, { ...pt });
    };

    let setPatientToNull = () => {
      Object.assign(patientForm, { ...nullPatient });
    };

    function patientFormManager(create) {
      showModal.value = true;
      createAction.value = create;
      if (create) setPatientToNull();
    }

    function savePatientForm() {
       if (createAction.value) addPatient();
       showModal.value = false;
    }

    function addSample(patient: IPatient): void {
      router?.push({
          name: 'samples-add',
          params: {
              patientUid: patient.uid
          }
      })
    }

    return {
      addSample,
      patientForm,
      getPatientFullName,
      patients: computed(() => store.getters.getPatients),
      patientSearch,
      isPatientSelected,
      selectPatient,
      setPatientToNull,
      patientFormManager,
      savePatientForm,
      countries: computed(() => store.getters.getCountries),
      clients,
      countryUid,
      provinces,
      provinceUid,
      districts,
      getProvinces,
      getDistricts,
      genders,
      getGender,
      searchPatients
    };
  },
});
</script>
