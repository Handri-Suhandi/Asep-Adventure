import React from 'react';

const panel = ({ 
  isInside, currentLocation, activeSpot, shopMenu, 
  message, inventory, itemEffects,
  exitArea, enterArea, doActivity, handleInteraction, useItem, setShopMenu,
  movePlayer 
}) => {
  const handleMoveStart = (dx, dy) => {
    movePlayer(dx, dy);
    const interval = setInterval(() => {
      movePlayer(dx, dy);
    }, 60);
    const stop = () => {
      clearInterval(interval);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    };
    window.addEventListener('mouseup', stop, { once: true });
    window.addEventListener('touchend', stop, { once: true });
    window.addEventListener('touchcancel', stop, { once: true });
  };

  return (
    <div className="side-panel">
      <div className="panel-info">
        <h3 style={{marginBottom: '10px', color: '#00ffff'}}>
          {isInside ? `Inside: ${currentLocation}` : (currentLocation ? `Near: ${currentLocation}` : 'Exploring...')}
        </h3>
        
        <div className="activity-buttons">
          {isInside && (
            <button 
              onClick={exitArea}
              style={{
                width: '100%', background: '#e74c3c', color: '#fff',
                padding: '10px', cursor: 'pointer', fontWeight: 'bold',
                marginBottom: '10px', border: '1px solid white'
              }}
            >
              EXIT {currentLocation}
            </button>
          )}

          {!isInside && currentLocation && (
            <button 
              onClick={enterArea}
              style={{
                width: '100%', background: '#00ff00', color: '#000',
                padding: '10px', cursor: 'pointer', fontWeight: 'bold',
                marginBottom: '10px', border: '1px solid white'
              }}
            >
              ENTER {currentLocation}
            </button>
          )}

          {isInside ? (
            activeSpot ? (
              shopMenu ? (
                <div style={{background:'#222', padding:'10px', borderRadius:'5px'}}>
                    <button onClick={() => setShopMenu(null)} style={{background:'#555', marginBottom:'10px', width:'100%'}}>
                        &lt; Back
                    </button>
                    {shopMenu.map((item, idx) => (
                        <button 
                            key={idx}
                            onClick={() => doActivity(item.action)}
                            style={{width: '100%', marginBottom:'5px', textAlign:'left'}}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
              ) : (
                <button 
                  onClick={() => handleInteraction(activeSpot)}
                  style={{
                    width: '100%', background: '#00bfff', color: '#000',
                    padding: '10px', cursor: 'pointer', fontWeight: 'bold'
                  }}
                >
                  <span>{activeSpot.label}</span>
                  <small style={{display:'block', fontSize: '10px', marginTop:'2px'}}>(Click to Interact)</small>
                </button>
              )
            ) : (
              <div style={{color:'gray', fontSize: '14px', fontStyle: 'italic', textAlign:'center', marginTop:'10px'}}>
                Walk closer to an object...
              </div>
            )
          ) : (
            !currentLocation && (
              <div style={{color:'gray', fontSize: '14px', fontStyle: 'italic'}}>
                Walk to a location...
              </div>
            )
          )}
        </div>

        {message && <div className="activity-message">{message}</div>}
        <div className="inventory-section">
            <h4>Inventory</h4>
            {inventory.length > 0 ? (
              <div className="inventory-grid">
                {inventory.map((item, index) => (
                  <div key={index} className="inv-item">
                    <span style={{fontWeight:'bold', color: '#ffd700'}}>{item.name}</span>
                    <span className="inv-count">x{item.count}</span>
                    {itemEffects[item.name] && (
                        <button 
                            onClick={() => useItem(item.name)}
                            style={{
                                marginTop:'5px', padding:'2px 5px', fontSize:'10px', 
                                background:'#00ff00', color:'black', border: 'none',
                                cursor: 'pointer', borderRadius: '3px'
                            }}
                        >
                            Use
                        </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-inv">Bag is empty</div>
            )}
        </div>
      </div>

      <div className="controls">
         <button 
           className="ctrl-btn btn-up" 
           onMouseDown={() => handleMoveStart(0, -20)}
           onTouchStart={(e) => { e.preventDefault(); handleMoveStart(0, -20); }}
         ></button>
         <div className="mid-controls">
           <button 
             className="ctrl-btn btn-left" 
             onMouseDown={() => handleMoveStart(-20, 0)}
             onTouchStart={(e) => { e.preventDefault(); handleMoveStart(-20, 0); }}
           ></button>
           <button 
             className="ctrl-btn btn-right" 
             onMouseDown={() => handleMoveStart(20, 0)}
             onTouchStart={(e) => { e.preventDefault(); handleMoveStart(20, 0); }}
           ></button>
         </div>
         <button 
           className="ctrl-btn btn-down" 
           onMouseDown={() => handleMoveStart(0, 20)}
           onTouchStart={(e) => { e.preventDefault(); handleMoveStart(0, 20); }}
         ></button>
      </div>
    </div>
  );
};

export default panel;