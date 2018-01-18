import * as types from './types/app';

export const filterSearch = query => {
  return {
    type: types.FILTER_SEARCH_RESOLVED,
    query
  };
};

export const filterColor = color => {
  return {
    type: types.FILTER_COLOR_RESOLVED,
    color
  };
};

export const filterSize = size => {
  return {
    type: types.FILTER_SIZE_RESOLVED,
    size
  };
};
