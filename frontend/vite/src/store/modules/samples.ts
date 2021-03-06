import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { parseEdgeNodeToList, parseDate } from '../../utils'
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_SAMPLE_TYPES, 
  GET_ALL_SAMPLES,
  GET_ANALYSIS_REQUESTS_BY_PATIENT_UID,
  GET_ANALYSIS_REQUESTS_BY_CLIENT_UID,
  GET_ANALYSIS_RESULTS_BY_SAMPLE_UID,
  GET_ALL_QC_SETS, GET_QC_SET_BY_UID
} from '../../graphql/analyses.queries';
import { IAnalysisProfile, IAnalysisRequest, IAnalysisService, ISample } from './analyses';

export interface ISampleType {
  uid?: string;
  name?: string;
  abbr?: string;
  description?: string;
  active?: boolean;
}

export class SampleType implements ISampleType{
  constructor(
    public uid: string,
    public name: string,
    public abbr: string,
    public description: string,
    public active: boolean,
  ) {
    this.active = true;
  }
}

export interface ISampleRequest extends ISample {
  uid?: string;
  sampleId?: string;
  priority?: string;
  status?: string;
  analysisRequest?: IAnalysisRequest;
}

export class SampleRequest implements ISampleRequest {
  constructor(
    public uid: string, 
    public sampleId: string, 
    public priority: string,
    public status: string,
    public analysisRequest: IAnalysisRequest,
    public sampleType: ISampleType,
    public profiles: IAnalysisProfile[],
    public analyses: IAnalysisService[],
     ){}
}

export interface IAnalysisResult {
  uid?: string;
  analysisUid?: string;
  analysis?: IAnalysisService;
  worksheetPosition?: number;
  sampleUid?: string;
  sample?: ISampleRequest;
  status?: string;
  result?: string;
  editResult?: string;
  createdAt?: string;
}

export class AnalysisResult implements IAnalysisResult {
  constructor(
    public uid: string,
    public analysisUid: string,
    public analysis: IAnalysisService,
    public worksheetPosition: number,
    public sampleUId: string,
    public sample: ISampleRequest,
    public status: string,
    public result: string,
  ) {
    this.result = "";
  }
}


export interface IQCSet {
  uid?: string;
  name?: string;
  note?: string;
  createdAt?: string;
  samples?: ISample[];
}

// state contract
export interface IState {
  sampleTypes: ISampleType[];
  samples: ISampleRequest[];
  sampleCount: number;
  pageInfo: any;
  sample: ISampleRequest | null;
  analysisRequests: IAnalysisRequest[];
  analysisResults: IAnalysisResult[];
  qcSets: IQCSet[];
  qcSet: IQCSet | null;
}

export const initialState = () => {
  return <IState>{
    sampleTypes: [],
    samples: [],
    sampleCount: 0,
    pageInfo: null,
    sample: null,
    analysisRequests: [], // for patient detail
    analysisResults: [],
    qcSets: [],
    qcSet: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_SAMPLE_TYPES = 'SET_SAMPLE_TYPES',
  ADD_SAMPLE_TYPE = 'ADD_SAMPLE_TYPE',
  UPDATE_SAMPLE_TYPE = 'UPDATE_SAMPLE_TYPE',

  RESET_SAMPLES = "RESET_SAMPLES",
  SET_SAMPLES = 'SET_SAMPLES',
  SET_SAMPLE = 'SET_SAMPLE',

  SET_ANALYSES_REQUESTS = 'SET_ANALYSES_REQUESTS',

  SET_ANALYSES_RESULTS = 'SET_ANALYSES_RESULTS',
  UPDATE_ANALYSIS_RESULTS = 'UPDATE_ANALYSIS_RESULTS',

  SET_QC_SETS = 'FETCH_QC_SETS',
  SET_QC_SET = 'FETCH_QC_SET',
  RESET_QC_SET = 'RESET_QC_SET',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_SAMPLE_TYPES = 'FETCH_SAMPLE_TYPES',
  ADD_SAMPLE_TYPE = 'ADD_SAMPLE_TYPE',
  UPDATE_SAMPLE_TYPE = 'UPDATE_SAMPLE_TYPE',

  RESET_SAMPLES = "RESET_SAMPLES",
  FETCH_SAMPLES = 'FETCH_SAMPLES',
  ADD_SAMPLES = 'ADD_SAMPLES',

  FETCH_ANALYSIS_REQUESTS_FOR_PATIENT = 'FETCH_ANALYSIS_REQUESTS_FOR_PATIENT',
  FETCH_ANALYSIS_REQUESTS_FOR_CLIENT = 'FETCH_ANALYSIS_REQUESTS_FOR_CLIENT',

  FETCH_ANALYSIS_RESULTS_FOR_SAMPLE = 'FETCH_ANALYSIS_RESULTS_FOR_SAMPLE',
  UPDATE_ANALYSIS_RESULTS = 'UPDATE_ANALYSIS_RESULTS',

  FETCH_QC_SETS = 'FETCH_QC_SETS',
  FETCH_QC_SET_BY_UID = 'FETCH_QC_SET_BY_UID',
  ADD_QC_SETS = 'ADD_QC_SETS',
  RESET_QC_SET = 'RESET_QC_SET',
  
}

function sortAnalysisRequests(ars: IAnalysisRequest[]): IAnalysisRequest[] {
  ars = ars?.sort((a: IAnalysisRequest, b: IAnalysisRequest) => (a?.createdAt || 0) < (b?.createdAt || 1) ? 1 : -1);
  return ars;
}

function sortResults(results: IAnalysisResult[]): IAnalysisResult[] {
  console.log(results)
  results = results?.sort((a: IAnalysisResult, b: IAnalysisResult) => {
    if(a?.analysisUid === b?.analysisUid) {
      return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
    }
    return (a?.analysis?.sortKey || 0) > (b?.analysis?.sortKey || 1) ? 1 : -1;
  });
  return results;
}


// Getters
export const getters = <GetterTree<IState, RootState>>{
  getSampleTypes: (state) => state.sampleTypes,
  getSampleTypeByName: (state) => (name: string) => state.sampleTypes?.find(st => st.name?.toString().toLowerCase().trim() === name.toString().toLowerCase().trim()),
  getSamples: (state) => state.samples,
  getSampleCount: (state) => state.sampleCount,
  getPageInfo: (state) => state.pageInfo,
  getSample: (state) => state.sample,
  getAnalysisRequests: (state) => state.analysisRequests,
  getAnalysisResults: (state) => state.analysisResults,
  getQCSets: (state) => state.qcSets,
  getQCSet: (state) => state.qcSet,
};


// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  // SAMPLE TYPES
  [MutationTypes.SET_SAMPLE_TYPES](state: IState, payload: any[]): void {
    state.sampleTypes = [];
    state.sampleTypes = parseEdgeNodeToList(payload)
  },

  [MutationTypes.UPDATE_SAMPLE_TYPE](state: IState, payload: ISampleType): void {
    const index = state.sampleTypes.findIndex(x => x.uid === payload.uid);
    state!.sampleTypes[index] = payload;
  },

  [MutationTypes.ADD_SAMPLE_TYPE](state: IState, payload: ISampleType): void {
    state.sampleTypes.push(payload);
  },

  // SAMPLES
  [MutationTypes.RESET_SAMPLES](state: IState): void {
    state.samples = [];
  },
  [MutationTypes.SET_SAMPLES](state: IState, payload: any): void {
    let samples = parseEdgeNodeToList(payload?.samples);
    samples?.forEach((sample: ISampleRequest) => {
      sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
      sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
    });

    if(payload.fromFilter){
      state.samples = [];
      state.samples = samples;
    } else {
      let data = state.samples
      state.samples = data.concat(samples);
    }
    
    state.sampleCount = payload?.count;
    state.pageInfo = payload?.samples?.pageInfo;
  },

  [MutationTypes.SET_SAMPLE](state: IState, payload: any): void {
    let sample = payload;
    sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
    sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
    state.sample = sample;
  },


  [MutationTypes.SET_ANALYSES_REQUESTS](state: IState, payload: IAnalysisRequest[]): void {
    state.analysisRequests = [];
    let requests = payload;
    requests?.forEach(ar => {
      ar.samples = parseEdgeNodeToList(ar?.samples) || [];
      ar.samples?.forEach((sample: ISampleRequest) => {
        sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
        sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
      })
    });
    state.analysisRequests = sortAnalysisRequests(requests);
  },

  [MutationTypes.SET_ANALYSES_RESULTS](state: IState, payload: IAnalysisResult[]): void {
    state.analysisResults = [];
    let results = payload;
    results?.forEach((result: any) => {
      result.analysis.resultoptions = parseEdgeNodeToList(result?.analysis?.resultoptions) || [];
    })
    state.analysisResults = sortResults(results);
  },

  [MutationTypes.UPDATE_ANALYSIS_RESULTS](state: IState, payload: IAnalysisResult[]): void {
    payload?.forEach(result => {
      const index = state.analysisResults.findIndex(x => x.uid === result.uid);
      state!.analysisResults[index] = result;
    })
  },

  // QC SETS
  [MutationTypes.RESET_QC_SET](state: IState): void {
    state.qcSet = null;
  },

  [MutationTypes.SET_QC_SETS](state: IState, payload: any[]): void {
    let qcSets = parseEdgeNodeToList(payload)
    qcSets?.forEach((item: any) => {
      item.createdAt = parseDate(item?.createdAt);
      item.samples = parseEdgeNodeToList(item?.samples) || [];
      item.samples?.forEach((sample: any) => {
        sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
        sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
      });
      if(!state.qcSets?.some(s => s.uid === item.uid)) {
        state.qcSets.push(item);
      }
    })
  },

  [MutationTypes.SET_QC_SET](state: IState, payload: any): void {
    let qcSet = payload;
    qcSet.samples = parseEdgeNodeToList(qcSet?.samples) || [];
    qcSet.samples?.forEach((sample: any) => {
      sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
      sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
      sample.analyses.resultoptions = parseEdgeNodeToList(sample?.analyses?.resultoptions) || [];
      sample.analysisResults = parseEdgeNodeToList(sample?.analysisResults) || [];
      sample.analysisResults?.forEach(((result: any) => {
        result.analysis.resultoptions = parseEdgeNodeToList(result.analysis.resultoptions) || [];
      }));
    })
    state.qcSet = qcSet;
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  // SAMPLE TYPES
  async [ActionTypes.FETCH_SAMPLE_TYPES]({ commit }){
    await useQuery({ query: GET_ALL_SAMPLE_TYPES })
          .then(payload => commit(MutationTypes.SET_SAMPLE_TYPES, payload.data.value.sampleTypeAll));
  },

  async [ActionTypes.UPDATE_SAMPLE_TYPE]({ commit }, payload ){
    commit(MutationTypes.UPDATE_SAMPLE_TYPE, payload.data.updateSampleType.sampleType);
  },

  async [ActionTypes.ADD_SAMPLE_TYPE]({ commit }, payload ){
    commit(MutationTypes.ADD_SAMPLE_TYPE, payload.data.createSampleType.sampleType);
  },

  // SAMPLES
  async [ActionTypes.RESET_SAMPLES]({ commit }) {
    commit(MutationTypes.RESET_SAMPLES);
  },
  async [ActionTypes.FETCH_SAMPLES]({ commit }, params){
    await urqlClient
    .query( GET_ALL_SAMPLES, { first: params.first, after: params.after, status: params.status, text: params.text, clientUid: params.clientUid})
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_SAMPLES, {
        samples: result.data.sampleAll,
        count: result.data.sampleCount,
        fromFilter: params.filterAction,
      });
    })
  },


  async [ActionTypes.ADD_SAMPLES]({ commit }, payload){
    commit(MutationTypes.SET_SAMPLES, payload.data.createAnalysisRequest.analysisrequest.samples);
  },

  async [ActionTypes.FETCH_ANALYSIS_REQUESTS_FOR_PATIENT]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_REQUESTS_BY_PATIENT_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_ANALYSES_REQUESTS, result.data.analysisRequestsByPatientUid))
  },

  async [ActionTypes.FETCH_ANALYSIS_REQUESTS_FOR_CLIENT]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_REQUESTS_BY_CLIENT_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_ANALYSES_REQUESTS, result.data.analysisRequestsByClientUid))
  },

  async [ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_RESULTS_BY_SAMPLE_UID, { uid })
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_ANALYSES_RESULTS, result.data.analysisResultBySampleUid);
      commit(MutationTypes.SET_SAMPLE, result.data.sampleByUid);
    })
  },

  async [ActionTypes.UPDATE_ANALYSIS_RESULTS]({ commit }, payload){
    commit(MutationTypes.UPDATE_ANALYSIS_RESULTS, payload.data.submitAnalysisResults.analysisResults);
  },

  // QC SETS
  async [ActionTypes.RESET_QC_SET]({ commit }){
    commit(MutationTypes.RESET_QC_SET);
  },

  async [ActionTypes.FETCH_QC_SETS]({ commit }){
    await useQuery({ query: GET_ALL_QC_SETS })
          .then(payload => commit(MutationTypes.SET_QC_SETS, payload.data.value.qcSetAll));
  },  
  
  async [ActionTypes.FETCH_QC_SET_BY_UID]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_QC_SET_BY_UID, { uid })
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_QC_SET, result.data.qcSetByUid);
    })
  },

  async [ActionTypes.ADD_QC_SETS]({ commit }, payload){
    commit(MutationTypes.SET_QC_SETS, payload.data.createQcSet.qcSets);
  },

};

// namespaced: true,
export const samples = {
  state,
  mutations,
  actions,
  getters,
};