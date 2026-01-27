// liabilityReducer.js
import {
  FETCH_LIABILITIES_REQUEST,
  FETCH_LIABILITIES_SUCCESS,
  FETCH_LIABILITIES_FAILURE
} from "../Actions/liabilityActions";

const initialState = {
  loading: false,
  data: [], // array of EmployeeLiabilityFullDto objects
  error: null
};

export default function liabilityReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LIABILITIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_LIABILITIES_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_LIABILITIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
