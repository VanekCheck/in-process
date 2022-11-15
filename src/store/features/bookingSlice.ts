import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from 'models';
import { EventProps } from 'pages/Dashboard/Calendar/constants';
import type { RootState } from 'store';
import { bookings } from 'utils';

interface BookingState {
  isLoading: boolean;
  isSideBarOpen: boolean;
  isPopoverOpen: boolean;

  bookings: Array<Booking>;
  currentBooking: EventProps | null;
}

const initialState: BookingState = {
  isLoading: false,
  isSideBarOpen: true,
  isPopoverOpen: false,

  bookings: bookings,
  currentBooking: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    removeBooking: (state, { payload }: PayloadAction<number>) => {
      state.bookings = state.bookings.filter((booking) => booking.id !== payload);
    },
    togglePopover: (state) => {
      state.isPopoverOpen = !state.isPopoverOpen;
    },
    setCurrentBooking: (state, { payload }: PayloadAction<EventProps>) => {
      state.currentBooking = payload;
    },
  },
});

export const { toggleSideBar, removeBooking, togglePopover, setCurrentBooking } =
  bookingSlice.actions;

export const selectBooking = (state: RootState) => state.bookings;

export { initialState };
export type { BookingState };

export default bookingSlice.reducer;
