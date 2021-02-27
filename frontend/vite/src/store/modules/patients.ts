import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { IClient, IDistrict, IProvince } from '../common'

import { GET_ALL_PATIENTS, SEARCH_PATIENTS } from '../../graphql/patient/queries';

export interface IPatient {
  uid?: number,
  clientPatientId?: string;
  patientId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  client?: IClient;
  clientUid?: String;
  gender?: string;
  age?: number;
  dateOfBirth?: Date;
  ageDobEstimated?: Boolean;
  phoneHome?: string;
  phoneMobile?: string;
  consentSms?: string;
  district?: IDistrict;
  districtUid?: string;
  province?: IProvince;
  provinceUid?: string;
}

export class Patient implements IPatient {
  constructor(
    public uid?: number,
    public patientId?: string,
    public clientPatientId?: string,
    public firstName?: string,
    public lastName?: string,
    public gender?: string,
    public age?: number,
    public dateOfBirth?: Date,
    public ageDobEstimated?: Boolean,
    public client?: IClient,
    public clientUid?: string,
    public phoneMobile?: string,
    public consentSms?: string,
    public district?: IDistrict,
    public districtUid?: string,
    public province?: IProvince,
    public provinceUid?: string
  ) {}
}

// state contract
export interface IState {
  patients?: IPatient[];
}

export const initialState = () => {
  return <IState>{
    patients: [],
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',
  CLEAR_PATIENT = 'CLEAR_PATIENT',
  SET_PATIENTS = 'SET_PATIENTS',
  DIRECT_SET_PATIENTS = 'DIRECT_SET_PATIENTS',
  ADD_PATIENT = 'ADD_PATIENT',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  CLEAR_PATIENT = 'CLEAR_PATIENT',
  FETCH_PATIENTS= 'FETCH_PATIENTS',
  SEARCH_PATIENTS= 'SEARCH_PATIENTS',
  ADD_PATIENT = 'ADD_PATIENT',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getPatients: (state) => state.patients,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.SET_PATIENTS](state: IState, payload: any[]): void {
    payload?.forEach(obj => state.patients?.push(obj?.node));
  },

  [MutationTypes.DIRECT_SET_PATIENTS](state: IState, patients: IPatient[]): void {
    state.patients = [];
    state.patients = patients;
  },

  [MutationTypes.ADD_PATIENT](state: IState, payload: IPatient): void {
    state.patients?.push(payload);
  },
};

// Actions
export const actions = <ActionTree<IState, RootState>>{

  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.ADD_PATIENT]({ commit }, payload: any){
    commit(MutationTypes.ADD_PATIENT, payload.data.createPatient.patient);
  },

  async [ActionTypes.FETCH_PATIENTS]({ commit }){
    await useQuery({ query: GET_ALL_PATIENTS })
          .then(payload => commit(MutationTypes.SET_PATIENTS, payload.data.value.patientAll.edges));
  },

  async [ActionTypes.SEARCH_PATIENTS]({ commit }, query: string){
    await urqlClient
      .query(SEARCH_PATIENTS, { queryString: query })
      .toPromise()
      .then(result => commit(MutationTypes.DIRECT_SET_PATIENTS, result.data.patientSearch))
  }
 
};

// namespaced: true,
export const patients = {
  state,
  mutations,
  actions,
  getters,
};
