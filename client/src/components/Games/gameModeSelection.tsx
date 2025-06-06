import React, { useState } from 'react'

function GameModeSelection(gameMode:any,setGameMode:any) {
    const [placeNextComponetNow, setplaceNextComponetNow] = useState<boolean>(false);

    const onSelect = (mode:string)=>{
        setGameMode(mode);
        setplaceNextComponetNow(true);
    }

    

  return (
    <>
      <div>gameModeSelection</div>
      <button onClick={() => onSelect("SINGLE")}>Single</button>
      <button onClick={() => onSelect("FRIEND")}>Invite A Friend</button>
      <button onClick={() => onSelect("RANDOM")}>Random</button>
    </>
  

  )
}

export default GameModeSelection