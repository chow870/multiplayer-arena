import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LastSelectedGameState {
  activeGameId: string | null;
}

const initialState:LastSelectedGameState = {
  activeGameId: null,
};

const LastSelectedGameSlice = createSlice({
  name: "lastSelectedGame",
  initialState,
  reducers: {
    setGameRoom(state, action: PayloadAction<string>) {
      console.log("[slice] Setting active game ID:", action.payload);
      state.activeGameId = action.payload;
    },
    clearGameRoom(state) {
      state.activeGameId = null;
    },
  },
});

export const { setGameRoom, clearGameRoom } = LastSelectedGameSlice.actions;
export default LastSelectedGameSlice.reducer;
