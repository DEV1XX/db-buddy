import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byId: {},                 // key-value storage
  allIds: [],               // ordered list of connectionIds
  activeConnectionId: null  // currently selected DB
};

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {

    // 🔹 Called after backend returns connectionId
    addConnection: (state, action) => {
      const { connectionId } = action.payload;

      // Store as key-value
      state.byId[connectionId] = {
        connectionId
      };

      // Track order
      state.allIds.push(connectionId);

      // Auto-set active DB if none exists
      if (!state.activeConnectionId) {
        state.activeConnectionId = connectionId;
        localStorage.setItem("activeConnectionId", connectionId);
      }
    },

    // 🔹 When user switches DB
    setActiveConnection: (state, action) => {
      const connectionId = action.payload;

      if (state.byId[connectionId]) {
        state.activeConnectionId = connectionId;
        localStorage.setItem("activeConnectionId", connectionId);
      }
    },

    // 🔹 Used when fetching all connections from backend
    setAllConnections: (state, action) => {
      const connections = action.payload; // array of { connectionId }

      connections.forEach((conn) => {
        state.byId[conn.connectionId] = conn;
        if (!state.allIds.includes(conn.connectionId)) {
          state.allIds.push(conn.connectionId);
        }
      });

      // Restore last active connection
      const saved = localStorage.getItem("activeConnectionId");
      if (saved && state.byId[saved]) {
        state.activeConnectionId = saved;
      }
    },

    // 🔹 When deleting a DB
    removeConnection: (state, action) => {
      const connectionId = action.payload;

      delete state.byId[connectionId];
      state.allIds = state.allIds.filter((id) => id !== connectionId);

      // Handle active DB deletion
      if (state.activeConnectionId === connectionId) {
        state.activeConnectionId = state.allIds[0] || null;
        localStorage.setItem(
          "activeConnectionId",
          state.activeConnectionId
        );
      }
    },

    // 🔹 On logout
    resetConnections: () => initialState
  }
});

export const {
  addConnection,
  setActiveConnection,
  setAllConnections,
  removeConnection,
  resetConnections
} = connectionSlice.actions;

export default connectionSlice.reducer;
