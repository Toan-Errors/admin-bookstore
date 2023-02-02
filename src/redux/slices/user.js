import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  user: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
};

const slice = createSlice({
  name: 'user',
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

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },

    // delete users
    deleteUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },

    deleteUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getUsersSuccess,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/auth/all');
      dispatch(slice.actions.getUsersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// export function getUser(id) {
//   return async () => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/products', {
//         params: { id },
//       });
//       dispatch(slice.actions.getProductSuccess(response.data.product));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }


export function deleteUser(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/auth/delete/${id}`);
      if (response.data?.status === 'success') {
        dispatch(getUsers())
      } else {
        dispatch(slice.actions.hasError(response.message));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteUsers(ids) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/auth`, { data: { ids } });
      dispatch(slice.actions.deleteUsersSuccess(response.data.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}