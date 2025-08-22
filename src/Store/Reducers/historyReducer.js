import {
  SAVE_HISTORY_REQUEST,
  SAVE_HISTORY_SUCCESS,
  SAVE_HISTORY_FAILURE,
  FETCH_HISTORY_LIST_REQUEST,
  FETCH_HISTORY_LIST_SUCCESS,
  FETCH_HISTORY_LIST_FAILURE,
  FETCH_HISTORY_DETAIL_REQUEST,
  FETCH_HISTORY_DETAIL_SUCCESS,
  FETCH_HISTORY_DETAIL_FAILURE,
} from "../Actions/historyActions";

const initialState = {
  saving: false,
  savedData: null,
  error: null,
  loadingList: false,
  historyList: [],
  loadingDetail: false,
  historyDetail: null,
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    // Save
    case SAVE_HISTORY_REQUEST:
      return { ...state, saving: true, error: null };
    case SAVE_HISTORY_SUCCESS:
      return { ...state, saving: false, savedData: action.payload };
    case SAVE_HISTORY_FAILURE:
      return { ...state, saving: false, error: action.payload };

    // Fetch List
    case FETCH_HISTORY_LIST_REQUEST:
      return { ...state, loadingList: true, error: null };
    case FETCH_HISTORY_LIST_SUCCESS:
      return { ...state, loadingList: false, historyList: action.payload };
    case FETCH_HISTORY_LIST_FAILURE:
      return { ...state, loadingList: false, error: action.payload };

    // Fetch Detail
    case FETCH_HISTORY_DETAIL_REQUEST:
      return { ...state, loadingDetail: true, error: null };
    case FETCH_HISTORY_DETAIL_SUCCESS:
      return { ...state, loadingDetail: false, historyDetail: action.payload };
    case FETCH_HISTORY_DETAIL_FAILURE:
      return { ...state, loadingDetail: false, error: action.payload };

    default:
      return state;
  }
};

export default historyReducer;
