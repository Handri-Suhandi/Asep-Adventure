import React from 'react';

const  area = ({ 
  isInside, currentLocation, backgroundStyle, 
  locationActivitySpots, avatars, avatarIndex, visualAvatarStyle, 
  arenaRef, arenaScale = 1 
}) => {
  return (
    <div className="game-arena" ref={arenaRef} style={backgroundStyle}>
      {!isInside && ['Village', 'Beach', 'Home', 'Warteg', 'Lake', 'Forest'].map(loc => (
        <div 
          key={loc}
          className={`location loc-${loc.toLowerCase()} ${currentLocation === loc ? 'active' : ''}`}
          data-location={loc}
        ></div>
      ))}

      {isInside && currentLocation && locationActivitySpots[currentLocation] && 
        locationActivitySpots[currentLocation].map(spot => {
          const scaledX = Math.round(spot.x * arenaScale);
          const scaledY = Math.round(spot.y * arenaScale);
          return (
            <div 
              key={spot.id}
              className="interaction-zone"
              style={{
                top: `50%`, 
                left: `50%`,
                transform: `translate(calc(-50% + ${scaledX}px), calc(-50% + ${scaledY}px))`
              }}
            >
              {spot.label}
            </div>
          );
        })
      }

      <img 
        src={avatars[avatarIndex]} 
        className="player" 
        alt="player"
        style={visualAvatarStyle} 
      />
    </div>
  );
};

export default area;