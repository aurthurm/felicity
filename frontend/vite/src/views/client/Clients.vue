<template>
  <div class="">
    <div class="flex items-center">
      <h1 class="h1 my-4 font-bold text-dark-700">Clients</h1>
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'client')"
        >
          Add client
        </button>
        <input
          class="w-64 h-10 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
          type="text" placeholder="Search ..." aria-label="Search"
          @keyup="searchClients($event)"
          @focus="resetClient()"
        />
    </div>
    <hr />

    <!-- Client Table View -->
    <div class="overflow-x-auto my-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client ID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">District</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Province</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Mobile Number</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Email Adress</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
              <tr 
                v-for="client in clients"
                :key="client.uid">
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <router-link :to="{ name: 'client-detail', query: { clientUid: client?.uid } }" 
                      class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">{{ client?.name }}</router-link>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="flex items-center">
                      <div class="text-sm leading-5 text-gray-800">{{ client?.code }}</div>
                  </div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ client?.province?.name }} yrs</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ client?.district?.name }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ client?.mobile }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ client?.email }}</div>
                  </td>
                  <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button>
                  </td>
              </tr>
            </tbody>
        </table>
        </div>
    </div>



  </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showClientModal" @close="showClientModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="client.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="client.code"
              placeholder="Code ..."
            />
          </label>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Country</span>
            <select class="form-select block w-full mt-1" v-model="countryUid" @change="getProvinces($event)">
              <option></option>
              <option v-for="country in countries" :key="country.uid" :value="country.uid"> {{ country.name }} {{ country.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Province</span>
            <select class="form-select block w-full mt-1" v-model="provinceUid" @change="getDistricts($event)">
               <option></option>
              <option v-for="province in provinces" :key="province.uid" :value="province.uid"> {{ province.name }} {{ province.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">District</span>
            <select class="form-select block w-full mt-1" v-model="client.districtUid">
               <option></option>
              <option v-for="district in districts" :key="district.uid" :value="district.uid"> {{ district.name }} {{ district.uid }}</option>
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
import { useMutation, useQuery } from '@urql/vue';
import { mapGetters, useStore } from 'vuex';
import { defineComponent, ref, reactive, computed } from 'vue';

import modal from '../_components/SimpleModal.vue';
import { Client } from '../../store/modules/clients';
import {  GET_ALL_CLIENTS, GET_CLIENT_CONTACTS_BY_CLIENT_UID } from '../../graphql/clients.queries';
import { ADD_CLIENT, EDIT_CLIENT } from '../../graphql/clients.mutations';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';

export const IClient = typeof Client;
import { ActionTypes } from '../../store/modules/clients';
import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';

export default defineComponent({
  name: 'clients-conf',
  components: {
    modal,
  },
  setup() {
    const store = useStore();

    let currentTab = ref('samples');
    const tabs = ['samples', 'contacts'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let showClientModal = ref(false);
    let createItem = ref(null);
    let targetItem = ref('');

    let provinces = ref([]);
    let districts = ref([]);

    let client = reactive({ ...(new Client()) });
    const resetClient = () => Object.assign(client, { ...(new Client()) })

    let countryUid = ref(null);
    let provinceUid = ref(null);

    let formTitle = ref('');

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);
    store.dispatch(ActionTypes.FETCH_CLIENTS);

    const { executeMutation: createClient } = useMutation(ADD_CLIENT);
    const { executeMutation: updateClient } = useMutation(EDIT_CLIENT);

    const provincesfilter = useQuery({
      query: FILTER_PROVINCES_BY_COUNTRY,
      variables: { uid: countryUid },
      pause: computed(() => countryUid !== null),
      requestPolicy: 'network-only',
    });

    const districtsfilter = useQuery({
      query: FILTER_DISTRICTS_BY_PROVINCE,
      variables: { uid: provinceUid },
      pause: computed(() => provinceUid !== null),
      requestPolicy: 'network-only',
    });

    function addClient() {
      createClient({ name: client.name, code: client.code, districtUid: client.districtUid }).then((result) => {
        Object.assign(client, result.data.createClient.createClient);
      });
    }

    function editClient() {
      updateClient({ uid: client.uid, name: client.name, code: client.code, districtUid: client.districtUid }).then((result) => {
        Object.assign(client, result.data.updateClient.updateClient);
      });
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

    function isClientSelected() {
      return client.uid !== undefined;
    }

    let selectClient = (selected) => {
        currentTab.value = 'samples';
        Object.assign(client, { ...selected });
        store.dispatch(ActionTypes.FETCH_CLIENT_CONTACTS, selected.uid);
    };

    let searchClients = (event) => store.dispatch(ActionTypes.SEARCH_CLIENTS, event.target.value);

    function FormManager(create, target, obj) {
      createItem.value = create;
      targetItem.value = target;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.toUpperCase();
      if(target == "client") showClientModal.value = true;
      if (create) {
        if(target == "client") Object.assign(client, { ...(new Client()) });
      } else {
        if(target == "client") Object.assign(client, { ...obj });
      }
    }

    function saveForm() {
      if (createItem.value) addClient();
      if (!createItem.value) editClient();
      showClientModal.value = false;
    }

    return {
      showClientModal,
      tabs,
      currentTab,
      currentTabComponent,
      FormManager,
      saveForm,
      formTitle,
      isClientSelected,
      client,
      clients: computed(() => store.getters.getClients),
      selectClient,
      resetClient,
      countries: computed(() => store.getters.getCountries),
      countryUid,
      provinceUid,
      getProvinces,
      provinces,
      getDistricts,
      districts,
      searchClients
    };
  },
});
</script>
