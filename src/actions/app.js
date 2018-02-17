import * as types from "./types/app";

export const filterSearch = query => ({
  type: types.FILTER_SEARCH_RESOLVED,
  query
});

export const filterColor = color => ({
  type: types.FILTER_COLOR_RESOLVED,
  color
});

export const filterSize = size => ({
  type: types.FILTER_SIZE_RESOLVED,
  size
});
