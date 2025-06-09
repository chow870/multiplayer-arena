import { setGameMode } from '../../context/slices/gameSelectionSlice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import SinglePlayer from './GameModes/SinglePlayer';
import FriendMode from './GameModes/FriendMode';

function GameModeSelection() {
    const [placeNextComponetNow2, setplaceNextComponetNow2] = useState<boolean>(false);
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const disptach = useDispatch();

    const onSelect = (mode:string)=>{
        setGameMode(mode);
        setSelectedMode(mode);
        setplaceNextComponetNow2(true);
        disptach(setGameMode(mode));
    }

    

    return (
      placeNextComponetNow2 === true ?
        selectedMode === "SINGLE" ? 
          <div><SinglePlayer/></div> : selectedMode === "FRIEND" ?
          <div><FriendMode/></div> : selectedMode === "RANDOM" ?
          <div>Will be placed later on </div> : <>
            <div>gameModeSelection</div>
            <button onClick={() => onSelect("SINGLE")}>Single</button>
            <button onClick={() => onSelect("FRIEND")}>Invite A Friend</button>
            <button onClick={() => onSelect("RANDOM")}>Random</button>
          </>
      : (
        <>
          <div>gameModeSelection</div>
          <button onClick={() => onSelect("SINGLE")}>Single</button>
          <button onClick={() => onSelect("FRIEND")}>Invite A Friend</button>
          <button onClick={() => onSelect("RANDOM")}>Random</button>
        </>
      )
    );

}

export default GameModeSelection