import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./slices/connectionSlice";

export const store = configureStore({
  reducer: {
    connections: connectionReducer
  }
});
