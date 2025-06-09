
import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux'

function SinglePlayer() {
     const selectedGame = useSelector((state: any) => state.selectedGameRecord.selectedGameId);
        const gameMode = useSelector((state: any) => state.selectedGameRecord.gameMode); 
        const invitedPlayerId = useSelector((state : any)=> state.selectedGameRecord.invitedPlayerId);

    async function GameBegin() {
        try {
        const res = await axios.post('/api/games/create',{
        gameType : selectedGame,
        gameMode : gameMode,
        invitedUserIds : "", // If no invited player, send empty array
    },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

    const id = res.data.lobbyId;
    console.log('Game record created with ID:', id);
    // on navigation i will have to pass the id of the game record created
    // and also update the latest gameplay as id
    // here i wil navigate to the gameplay with id and and also update the latest gameplay as id
    } 
    catch (err) {
        console.error('Failed to create game record:', err);    
    }
}

  return (
    <>
        <button onClick={()=> GameBegin }>Play now !!</button>
    </>
  )
}


export default SinglePlayer