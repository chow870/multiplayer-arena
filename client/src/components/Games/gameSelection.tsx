import React from 'react'

function GameSelection() {
    // This component will handle the selection of a game
    // It will display a list of available games
    const games = [
        { id: 1, name: 'Chess' },
        { id: 2, name: 'Checkers' },
        { id: 3, name: 'Tic_Tac_Toe' },
        { id: 4, name: 'Sudoku' },
        {id : 5, name: 'Snake_and_ladders' }
    ]; 
    const [selectedGame, setSelectedGame] = React.useState<number | null>(null); 

    const handleGameSelect = (gameId: number) => {
        // Logic to handle game selection
    }

  return (
    <div>
      <h2>Game Selection</h2>
      <ul>
        {games.map(game => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default GameSelection