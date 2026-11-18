import React from 'react';

const StartScreen = ({ avatars, avatarIndex, setAvatarIndex, playerName, setPlayerName, onStart }) => {
  return (
    <div className="start-screen-wrapper">
      
      <div className="start-card">
        <h1>Asep Adventure</h1>
        
        <div className="avatar-selector">
          <button onClick={() => setAvatarIndex((i) => (i - 1 + avatars.length) % avatars.length)}>&#9664;</button>
          <img src={avatars[avatarIndex]} alt="Avatar" />
          <button onClick={() => setAvatarIndex((i) => (i + 1) % avatars.length)}>&#9654;</button>
        </div>
        
        <input 
          type="text" 
          className="start-input"
          placeholder="Enter your name..." 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        
        <br/>
        
        <button className="btn-start" onClick={onStart}>
          Start Exploring
        </button>
      </div>
      
    </div>
  );
};

export default StartScreen;