import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

export interface IAlert {
  ticks?: number;
  type?: string;
  message?: string;
  icon?: string;
  toast?: boolean;
  position?: string;
  showConfirmButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

export class Alert implements IAlert {
  constructor(
    public ticks?: number,
    public type?: string,
    public message?: string,
    public icon?: string,
    public toast?: boolean,
    public position?: string,
    public showConfirmButton?: boolean,
    public timer?: number,
    public timerProgressBar?: boolean   ,
  ){}
}

export interface INotification {
  ticks?: number;
  type?: string;
  message?: string;
  icon?: string;
  toast?: boolean;
  position?: string;
  showConfirmButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

export class Notification implements INotification {
  constructor(
    public ticks?: number,
    public type?: string,
    public message?: string,
    public icon?: string,
    public toast?: boolean,
    public position?: string,
    public showConfirmButton?: boolean,
    public timer?: number,
    public timerProgressBar?: boolean,
  ){}
}

// state contract
export interface IState {
  alert: IAlert;
  notifications: INotification[];
}

export const initialState = () => {
  return <IState>{
    alert: new Alert,
    notifications: [],
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  ALERT_SUCCESS = 'ALERT_SUCCESS',
  ALERT_ERROR = 'ALERT_ERROR',
  ALERT_WARING = 'ALERT_WARING',
  ALERT_INFO = 'ALERT_INFO',
  ALERT_QUESTION = 'ALERT_QUESTION',
}

export enum ActionTypes {
  RESET_STATE = 'ALERT_RESET_STATE',

  ALERT_SUCCESS = 'ALERT_SUCCESS',
  ALERT_ERROR = 'ALERT_ERROR',
  ALERT_WARING = 'ALERT_WARING',
  ALERT_INFO = 'ALERT_INFO',
  ALERT_QUESTION = 'ALERT_QUESTION',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getCurrentToast: (state) => state,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.ALERT_SUCCESS](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "success";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_ERROR](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "error";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_WARING](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "warning";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_INFO](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "info";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_QUESTION](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "question";
    state.alert.ticks = new Date().getTime();
  },
}

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.ALERT_SUCCESS]({ commit }, message ){
    commit(MutationTypes.ALERT_SUCCESS, message);
  },

  async [ActionTypes.ALERT_ERROR]({ commit }, message ){
    commit(MutationTypes.ALERT_ERROR, message);
  },

  async [ActionTypes.ALERT_WARING]({ commit }, message ){
    commit(MutationTypes.ALERT_WARING, message);
  },

  async [ActionTypes.ALERT_INFO]({ commit }, message ){
    commit(MutationTypes.ALERT_INFO, message);
  },

  async [ActionTypes.ALERT_QUESTION]({ commit }, message ){
    commit(MutationTypes.ALERT_QUESTION, message);
  },

};

// namespaced: true,
export const toast = {
  state,
  mutations,
  actions,
  getters,
};