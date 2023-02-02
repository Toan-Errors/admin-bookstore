import axiosInstance from "src/utils/axios";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoading: false,
  error: null,
  order: null,
  orders: [],
};

const ordersSlice = createSlice({
  name: 'order',
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

    // GET ORDERS
    getOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload;
    },
  },
});

export default ordersSlice.reducer;
export const { startLoading, hasError } = ordersSlice.actions;

export function getOrders() {
  return async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axiosInstance.get('/order/history');
      dispatch(ordersSlice.actions.getOrdersSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}