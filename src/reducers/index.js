import {
  FILTER_SIZE_RESOLVED,
  FILTER_COLOR_RESOLVED,
  FILTER_SEARCH_RESOLVED
} from "../actions/types/app";

export default function appReducer(state = {}, action) {
  switch (action.type) {
    case FILTER_SIZE_RESOLVED:
      return handleFilterSize(state, action);
    case FILTER_COLOR_RESOLVED:
      return handleFilterColor(state, action);
    case FILTER_SEARCH_RESOLVED:
      return handleFilterSearch(state, action);
    default:
      return state;
  }
}

const handleFilterSize = (state, action) => {
  return {
    ...state,
    size: action.size
  };
};

const handleFilterColor = (state, action) => {
  return {
    ...state,
    color: action.color
  };
};

const handleFilterSearch = (state, action) => {
  return {
    ...state,
    query: action.query
  };
};
