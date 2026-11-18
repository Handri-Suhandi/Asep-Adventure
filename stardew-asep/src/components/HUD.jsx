import React from 'react';

const HUD = ({ greeting, playerName, day, timeString, stats }) => {
  return (
    <>
      <div className="top-bar">
        <div>{greeting}, <b>{playerName}</b></div>
        
        <div style={{fontSize: '16px'}}>
          Day {day} | {timeString} | <span style={{color: '#00ff00'}}>$ {stats.money}</span>
        </div>
      </div>

      <div className="status">
        {['Hunger', 'Energy', 'Hygiene', 'Happiness'].map(label => {
          const key = label === 'Happiness' ? 'happy' : label.toLowerCase();
          return (
            <div className="stat" key={key}>
              {label}
              <div className="progress">
                <div className="fill" style={{width: `${stats[key]}%`, backgroundColor: stats[key] < 30 ? 'red' : '#00bfff'}}></div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HUD;