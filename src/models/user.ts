import { Reducer } from 'redux';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  userName?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    // fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    // *fetchCurrent(_, { call, put }) {
    //   // const response = yield call(queryCurrent);
    //   const
    //   if (response.success && response.data) {
    //     yield put({
    //       type: 'saveCurrentUser',
    //       payload: {
    //         ...response.data,
    //       },
    //     });
    //   } else {
    //     message.error(response.message);
    //     yield put({
    //       type: 'login/logout',
    //     });
    //   }
    // },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
