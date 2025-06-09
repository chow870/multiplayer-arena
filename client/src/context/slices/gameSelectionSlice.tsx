// store/slices/selectedGameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedGameState {
  selectedGameId: string;
  gameMode: string;
  invitedPlayerId?: string;
}

const initialState: SelectedGameState = {
  selectedGameId: '',
  gameMode: '',
  invitedPlayerId: undefined,
};

const selectedGameSlice = createSlice({
  name: 'selectedGameRecord',
  initialState,
  reducers: {
    setSelectedGame(state, action: PayloadAction<string>) {
      state.selectedGameId = action.payload;
    },
    setGameMode(state, action: PayloadAction<string>) {
      state.gameMode = action.payload;
    },
    setInvitedPlayerId(state, action: PayloadAction<string | undefined>) {
      state.invitedPlayerId = action.payload;
    },
    resetAll(state) {
      state.selectedGameId = '';
      state.gameMode = '';
      state.invitedPlayerId = undefined;
    },
  },
});

export const {
  setSelectedGame,
  setGameMode,
  setInvitedPlayerId,
  resetAll,
} = selectedGameSlice.actions;

export default selectedGameSlice.reducer;
