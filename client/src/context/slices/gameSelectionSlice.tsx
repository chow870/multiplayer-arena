// store/slices/selectedGameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';

interface SelectedGameState {
  selectedGameId: string;
  gameMode: string;
  invitedPlayerId?: string;
  betAmount?: number;
}

const initialState: SelectedGameState = {
  selectedGameId: '',
  gameMode: '',
  invitedPlayerId: undefined,
  betAmount: 0, // Optional bet amount, can be set later
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
    setBetAmountContext(state, action: PayloadAction<number>) {
      state.betAmount = action.payload;
    },
    // Reset all fields to initial state
    resetAll(state) {
      state.selectedGameId = '';
      state.gameMode = '';
      state.invitedPlayerId = undefined;
      state.betAmount = 0; // Reset bet amount as well
    },
  },
});

export const {
  setSelectedGame,
  setGameMode,
  setInvitedPlayerId,
  setBetAmountContext,
  resetAll,
} = selectedGameSlice.actions;

export default selectedGameSlice.reducer;
