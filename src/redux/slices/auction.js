import axios from '../../utils/axios';
import { dispatch } from '../store';

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoading: false,
  error: null,
  auctions: [],
  auction: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
}

const slice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getAuctionsSuccess(state, action) {
      state.isLoading = false;
      state.auctions = action.payload;
    },
  }
})

export const { getAuctionsSuccess } = slice.actions;
export default slice.reducer;

export function getAuctions() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/auction');
      dispatch(slice.actions.getAuctionsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}