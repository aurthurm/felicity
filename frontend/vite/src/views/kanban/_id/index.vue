<template>

  <div class="flex justify-start">
    <div class="flex-1">
      <h2 class="h2 font-bold">BOARD: {{ board?.title || 'No title'}}</h2>
      <hr class="my-2">
      <p class="leading tracking-wide italic grey-300">{{ board?.description || "No description"}}</p>
      <hr class="mt-2">
    </div>
    <div class="ml-4">
        <button 
        class="mt-6 border border-gray-900 border-dashed rounded py-2 px-2 text-gray-500"
        @click.prevent="FormManager()">
          <i class="fa fa-plus-circle" aria-hidden="true"></i> Listing
        </button>
    </div>
  </div>
    
  <router-view />

  <!-- Add Listing Modal -->
  <modal v-if="showModal" @close="showModal = false"  :contentWidth="'w-1/3'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Title</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.title"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
              placeholder="Description ..."
            />
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
import modal from '../../_components/SimpleModal.vue';
import { defineComponent, reactive, computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';
import { ActionTypes, Listing, IListing } from '../../../store/modules/kanban';
import { ADD_BOARD_LISTING } from '../../../graphql/kanban.mutations';

export default defineComponent({
  name: "kanaban-single",
  components: {
    modal,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    // Modal Vars
    let showModal = ref(false);
    let formTitle = ref("")
    let form = reactive({ ...new Listing() });

    store.dispatch(ActionTypes.FETCH_BOARD_BY_UID, route.params.boardUid)
    const board = computed(() => store.getters.getBoard )

    const { executeMutation: createBoardListing } = useMutation(ADD_BOARD_LISTING);

    function addBoardListing(): void {
      createBoardListing({ title: form.title, description: form.description, boardUid: board.value.uid }).then((result) => {
       store.dispatch(ActionTypes.ADD_BOARD_LISTING, result);
      });
    }

    function FormManager(): void {
      showModal.value = true;
      formTitle.value = "ADD BOARD LISTING";
      Object.assign(form, { ...new Listing });
    }

    function saveForm():void {
      addBoardListing();
      showModal.value = false;
    }

    return { 
      board,
      showModal,
      FormManager,
      saveForm,
      form,
      formTitle,
    }
  },
});
</script>