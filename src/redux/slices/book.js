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

    // delete book
    deleteBookSuccess(state, action) {
      state.isLoading = false;
      state.books = state.books.filter((book) => book._id !== action.payload);
    },

    // delete books
    deleteBooksSuccess(state, action) {
      state.isLoading = false;
      state.books = state.books.filter((book) => !action.payload.includes(book._id));
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

export function deleteBook(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/books/${id}`);
      dispatch(slice.actions.deleteBookSuccess(id));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteBooks(ids) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/books/multiple`, { data: { ids } });
      dispatch(slice.actions.deleteBooksSuccess(ids));
    } catch (error) {
      console.log(error);
    }
  };
}