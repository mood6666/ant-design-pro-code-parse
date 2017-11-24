import { queryNotices } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });

      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {  // 应该是redux中的订阅，每次dispatch出发，默认带dispatch和history
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      console.log('global subscriptions')
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
