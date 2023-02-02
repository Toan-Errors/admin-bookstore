import axios from '../../utils/axios';
import { dispatch } from '../store';

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoading: false,
  error: null,
  books: [],
  book: null,
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
  name: 'book',
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

    // GET BOOKS
    getBooksSuccess(state, action) {
      state.isLoading = false;
      state.books = action.payload;
    },
  }
})

export const { getAuctionsSuccess } = slice.actions;
export default slice.reducer;

export function getBooks() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/books');
      dispatch(slice.actions.getBooksSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}