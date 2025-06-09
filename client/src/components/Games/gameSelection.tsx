import { setSelectedGame } from '../../context/slices/gameSelectionSlice';
import React from 'react'
import { useDispatch } from 'react-redux';
import GameModeSelection from './gameModeSelection';
// import GameModeSelection from './gameModeSelection';

function GameSelection() {
    // This component will handle the selection of a game
    // It will display a list of available games]
    const dispatch = useDispatch();
    const [gameSelectionflag, setGameSelectionFlag] = React.useState<boolean>(true);
    const [gameModeSelectionFlag, setGameModeSelectionFlag] = React.useState<boolean>(false);
    const games = [
        { id: 1, name: 'Chess' },
        { id: 2, name: 'Checkers' },
        { id: 3, name: 'Tic_Tac_Toe' },
        { id: 4, name: 'Sudoku' },
        {id : 5, name: 'snakes_ladders' }
    ]; 
    // const [selectedGame, setSelectedGame] = React.useState<number | null>(null); 

    const handleGameSelect = (gameName : string) => {
        // Logic to handle game selection
        dispatch(setSelectedGame(gameName));
        setGameSelectionFlag(false);
        setGameModeSelectionFlag(true);
    }

  return (
    <div>
        {gameSelectionflag &&<>
        <h2>Game Selection</h2>
        <ul>
          {games.map(game => (
            <li key={game.id}
            onClick={()=>handleGameSelect(game.name)}
            >{game.name}</li>
          ))}
        </ul>
        </>}
        {gameModeSelectionFlag && !gameSelectionflag? <GameModeSelection/> : null}
    </div>
  )
}

export default GameSelection