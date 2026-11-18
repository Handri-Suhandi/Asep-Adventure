import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  avatars, locationBackgrounds, locationSpawnPoints, locationAvatarSizes, 
  locationActivitySpots, activityEffects, itemEffects 
} from './data/data';
import StartScreen from './components/start';
import HUD from './components/HUD';
import GameArena from './components/area';
import SidePanel from './components/panels';

const RANDOM_EVENTS = [
  { title: "Found Money!", text: "You found $50 on the street. Lucky!", stat: "money", val: 50 },
  { title: "Hole in Pocket", text: "Oh no! You dropped $30 while walking.", stat: "money", val: -30 },
  { title: "Fresh Breeze", text: "The air feels great today. Happy +10.", stat: "happy", val: 10 },
  { title: "Chased by a Duck", text: "Oof! You ran for your life! Energy -15.", stat: "energy", val: -15 },
  { title: "Wild Bird", text: "A bird pooped on your head. Hygiene -20.", stat: "hygiene", val: -20 },
  { title: "Free Snack", text: "A neighbor gave you some leftovers. Hunger +15.", stat: "hunger", val: 15 },
];

function App() {
  const [screen, setScreen] = useState('start'); 
  const [playerName, setPlayerName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  
  const [stats, setStats] = useState({ hunger: 50, energy: 50, hygiene: 50, happy: 50, money: 500 });
  const [inventory, setInventory] = useState([]);
  
  const [gameMinutes, setGameMinutes] = useState(6 * 60); 
  const [day, setDay] = useState(1);
  const [weather, setWeather] = useState('sunny'); 
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastMapPos, setLastMapPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  
  const [activeSpot, setActiveSpot] = useState(null);
  const [shopMenu, setShopMenu] = useState(null);
  const [message, setMessage] = useState('');
  const [gameOverReason, setGameOverReason] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null); 
 
  const [isBusy, setIsBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingAction, setPendingAction] = useState(null);

  const [visitedLocs, setVisitedLocs] = useState(new Set());
  const [activitiesDone, setActivitiesDone] = useState(new Set());
  const [lifetimeItems, setLifetimeItems] = useState(0);
  const [itemsUsedCount, setItemsUsedCount] = useState(0);

  const arenaRef = useRef(null);
  const keysPressed = useRef({});

  const adjustStat = (stat, value) => {
    setStats(prev => {
      let newVal;
      if (stat === 'money') newVal = Math.max(0, prev.money + value);
      else newVal = Math.max(0, Math.min(100, prev[stat] + value));
      return { ...prev, [stat]: newVal };
    });
  };

  const addToInventory = (itemName, quantity) => {
    setLifetimeItems(prev => prev + quantity);
    setInventory(prev => {
      const existingItem = prev.find(item => item.name === itemName);
      if (existingItem) {
        return prev.map(item => item.name === itemName ? { ...item, count: item.count + quantity } : item);
      } else return [...prev, { name: itemName, count: quantity }];
    });
  };

  const removeFromInventory = (itemName, quantity) => {
      setInventory(prev => {
          return prev.map(item => {
              if (item.name === itemName) return { ...item, count: item.count - quantity };
              return item;
          }).filter(item => item.count > 0);
      });
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const getCurrentAvatarSize = () => {
    if (!isInside) return locationAvatarSizes["Map"];
    return locationAvatarSizes[currentLocation] || 100;
  };

  const completeActivity = () => {
    const actName = pendingAction;
    const effects = activityEffects[actName];

    if (!effects) { setIsBusy(false); return; }

    setActivitiesDone(prev => new Set(prev).add(actName));

    if (effects.win) {
        setIsBusy(false); setProgress(0); setPendingAction(null);
        adjustStat('money', effects.money); setGameWon(true);
        setGameOverReason("Congratulations! You have bought the entire village!");
        setScreen('gameover'); return;
    }

    if (effects.consume) removeFromInventory(effects.consume.name, effects.consume.qty);
    if (effects.sell) removeFromInventory(effects.sell.name, effects.sell.qty);

    const isHungryOrSleepy = stats.hunger < 25 || stats.energy < 25;
    let happinessBlocked = false;

    Object.keys(effects).forEach(key => {
      if (['receive', 'requires', 'sell', 'consume', 'time', 'win'].includes(key)) return;
      if (key === 'happy' && effects[key] > 0 && isHungryOrSleepy) happinessBlocked = true;
      else adjustStat(key, effects[key]);
    });

    const timeSkipped = effects.time || 15; 
    setGameMinutes(prev => {
        const totalMinutes = prev + timeSkipped;
        const minutesInDay = 24 * 60;
        if (totalMinutes >= minutesInDay) {
            const daysPassed = Math.floor(totalMinutes / minutesInDay);
            setDay(d => d + daysPassed);
            const isRainy = Math.random() > 0.65;
            setWeather(isRainy ? 'rainy' : 'sunny');
            
            if(isRainy) showMessage("A new day begins... Heavy rain is falling!");
            else showMessage("A new day begins... The weather is clear!");
            
            return totalMinutes % minutesInDay; 
        }
        return totalMinutes;
    });

    let itemMsg = "";
    if (effects.receive) {
        addToInventory(effects.receive.name, effects.receive.qty);
        itemMsg = ` & Got ${effects.receive.qty} ${effects.receive.name}`;
    } else if (effects.sell) {
        itemMsg = ` & Sold ${effects.sell.name}`;
    }

    const hoursPassed = Math.floor(timeSkipped / 60);
    const minsPassed = timeSkipped % 60;
    const timeMsg = hoursPassed > 0 ? ` (+${hoursPassed}h ${minsPassed}m)` : ` (+${minsPassed}m)`;

    let msg = `Done: ${actName}${itemMsg}${timeMsg}`;
    if (happinessBlocked) msg += " (Too tired/hungry to feel happy)";
    showMessage(msg);

    setIsBusy(false); setProgress(0); setPendingAction(null);
  };

  useEffect(() => {
    let interval;
    if (isBusy && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
           if (prev >= 100) return 100;
           return prev + 2; 
        });
      }, 50);
    } else if (isBusy && progress >= 100) {
      completeActivity(); 
    }
    return () => clearInterval(interval);
  }, [isBusy, progress]);

  const skipProgress = () => {
    setProgress(100);
  };

  const doActivity = (actName) => {
    if (isBusy) return;

    const effects = activityEffects[actName];
    if (!effects) return;

    if (effects.money && effects.money < 0 && stats.money < Math.abs(effects.money)) {
      showMessage("Not enough money!");
      return;
    }
    if (effects.requires) {
        const hasItem = inventory.find(i => i.name === effects.requires);
        if (!hasItem) {
            showMessage(`You need a ${effects.requires}!`);
            return;
        }
    }
    if (effects.consume) {
        const item = inventory.find(i => i.name === effects.consume.name);
        if (!item || item.count < effects.consume.qty) {
            showMessage(`Need ${effects.consume.qty} ${effects.consume.name}!`);
            return;
        }
    }
    if (effects.sell) {
        const item = inventory.find(i => i.name === effects.sell.name);
        if (!item || item.count < effects.sell.qty) {
            showMessage(`Nothing to sell!`);
            return;
        }
    }

    setShopMenu(null); 
    setPendingAction(actName);
    setProgress(0);
    setIsBusy(true);
  };

  const useItem = (itemName) => {
      if (isBusy) return;
      const effects = itemEffects[itemName];
      if (!effects) { showMessage(`Cannot use ${itemName} directly!`); return; }
      setItemsUsedCount(prev => prev + 1);
      Object.keys(effects).forEach(key => adjustStat(key, effects[key]));
      removeFromInventory(itemName, 1);
      showMessage(`Used ${itemName}`);
  };

  const triggerRandomEvent = () => {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setCurrentEvent(event);
      setIsBusy(true); 
  };

  const closeEvent = () => {
      if (currentEvent) {
          adjustStat(currentEvent.stat, currentEvent.val);
          showMessage(`${currentEvent.stat.toUpperCase()} ${currentEvent.val > 0 ? '+' : ''}${currentEvent.val}`);
      }
      setCurrentEvent(null);
      setIsBusy(false);
  };

  const enterArea = () => {
    if (currentLocation && !isInside) {
      setLastMapPos(playerPos); 
      setIsInside(true);
      const spawnPoint = locationSpawnPoints[currentLocation] || { x: 0, y: 200 };
      setPlayerPos(spawnPoint); 
    }
  };

  const exitArea = () => {
    if (isInside) {
      setIsInside(false);
      setPlayerPos(lastMapPos); 
      setShopMenu(null);
    }
  };

  const handleInteraction = (spot) => {
      if (spot.menuItems) setShopMenu(spot.menuItems);
      else doActivity(spot.action);
  };

  const movePlayer = (dx, dy) => {
    if (screen !== 'game' || isBusy) return; 
    const arenaEl = arenaRef.current;
    if (!arenaEl) return;

    const { clientWidth, clientHeight } = arenaEl;
    const playerSize = getCurrentAvatarSize(); 
    const halfPlayer = playerSize / 2;
    const maxX = (clientWidth / 2) - halfPlayer;
    const maxY = (clientHeight / 2) - halfPlayer;

    setPlayerPos(prev => {
      let nextX = prev.x + dx;
      let nextY = prev.y + dy;
      if (nextX < -maxX) nextX = -maxX;
      if (nextX > maxX) nextX = maxX;
      if (nextY < -maxY) nextY = -maxY;
      if (nextY > maxY) nextY = maxY;
      return { x: nextX, y: nextY };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e) => { keysPressed.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (screen !== 'game' || isBusy) return;
    const moveLoop = setInterval(() => {
        let dx = 0; let dy = 0; const step = 10; 
        if (keysPressed.current["ArrowUp"] || keysPressed.current["w"] || keysPressed.current["W"]) dy -= step;
        if (keysPressed.current["ArrowDown"] || keysPressed.current["s"] || keysPressed.current["S"]) dy += step;
        if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"] || keysPressed.current["A"]) dx -= step;
        if (keysPressed.current["ArrowRight"] || keysPressed.current["d"] || keysPressed.current["D"]) dx += step;
        if (dx !== 0 || dy !== 0) movePlayer(dx, dy);
    }, 30); 
    return () => clearInterval(moveLoop);
  }, [screen, isBusy, isInside, currentLocation]);

  useEffect(() => {
    if (isInside && currentLocation) setVisitedLocs(prev => new Set(prev).add(currentLocation));
  }, [isInside, currentLocation]);

  useEffect(() => { 
    if (screen !== 'game') return;
    let reason = null;
    if (stats.hunger <= 0) reason = "You collapsed from starvation.";
    if (stats.energy <= 0) reason = "You passed out from extreme exhaustion.";
    if (stats.hygiene <= 0) reason = "You fell gravely ill due to poor hygiene.";
    if (stats.happy <= 0) reason = "You lost all hope and gave up.";
    
    if (reason) { 
        setGameWon(false); setGameOverReason(reason); setScreen('gameover'); 
    }
  }, [stats, screen]);

  useEffect(() => { 
    if (screen !== 'game') return;
    
    const timer = setInterval(() => {
      if (isBusy) return;
      
      setGameMinutes(prev => {
        const next = prev + 1;
        if (next >= 24 * 60) { 
            setDay(d => d + 1); 
            const isRainy = Math.random() > 0.65;
            setWeather(isRainy ? 'rainy' : 'sunny');
            if(isRainy) showMessage("A new day begins... Heavy rain is falling!");
            else showMessage("A new day begins... The weather is clear!");

            return 0;
        }
        return next;
      });
    }, 1000); 
    
    return () => clearInterval(timer);
  }, [screen, isBusy]);
  useEffect(() => {
    if (screen !== 'game') return;
    
    if (gameMinutes > 0) {
        
        if (gameMinutes % 20 === 0) adjustStat("hunger", -3); 
        if (gameMinutes % 30 === 0) adjustStat("energy", -3);
        
        let hygieneDecay = -2;
        let happyDecay = -3;
        
        if (weather === 'rainy' && !isInside) {
            hygieneDecay = -5; 
            happyDecay = -5;    
        }
        
        if (gameMinutes % 25 === 0) adjustStat("hygiene", hygieneDecay);
        if (gameMinutes % 25 === 0) adjustStat("happy", happyDecay);

        if (gameMinutes % 30 === 0) {
            if (!isInside && Math.random() < 0.05) {
                triggerRandomEvent();
            }
        }
    }
  }, [gameMinutes, weather, isInside, screen]);

  useEffect(() => {
    if (screen !== 'game' || isInside) return;
    const checkLocationOverlap = () => {
      const arena = arenaRef.current;
      if (!arena) return;
      const locationElements = arena.querySelectorAll('.location');
      const arenaRect = arena.getBoundingClientRect();
      const centerX = arenaRect.width / 2;
      const centerY = arenaRect.height / 2;
      const playerX = centerX + playerPos.x;
      const playerY = centerY + playerPos.y;
      
      let foundLoc = null;
      locationElements.forEach(el => {
        const locName = el.getAttribute('data-location');
        const locLeft = el.offsetLeft;
        const locTop = el.offsetTop;
        const locRight = locLeft + el.offsetWidth;
        const locBottom = locTop + el.offsetHeight;
        if (playerX >= locLeft && playerX <= locRight && playerY >= locTop && playerY <= locBottom) {
            foundLoc = locName;
        }
      });
      setCurrentLocation(foundLoc);
    };
    checkLocationOverlap();
  }, [playerPos, screen, isInside]);

  useEffect(() => {
    if (!isInside || !currentLocation) { setActiveSpot(null); setShopMenu(null); return; }
    const spots = locationActivitySpots[currentLocation];
    if (!spots) { setActiveSpot(null); return; }
    let foundSpot = null;
    spots.forEach(spot => {
        const dist = Math.sqrt(Math.pow(playerPos.x - spot.x, 2) + Math.pow(playerPos.y - spot.y, 2));
        if (dist < 120) foundSpot = spot; 
    });
    if (activeSpot && foundSpot && activeSpot.id !== foundSpot.id) setShopMenu(null);
    if (!foundSpot) setShopMenu(null);
    setActiveSpot(foundSpot);
  }, [playerPos, isInside, currentLocation]);

  const hours = Math.floor(gameMinutes / 60);
  const timeString = `${String(hours).padStart(2,'0')}:${String(gameMinutes % 60).padStart(2,'0')}`;
  
  const getTimePhase = () => {
    if (hours >= 6 && hours < 16) return 'day';
    if (hours >= 16 && hours < 19) return 'afternoon';
    return 'night';
  };

  const phase = getTimePhase(); 

  let greetingText = "";
  if (weather === 'rainy') {
      greetingText = phase === 'night' ? "Rainy Night" : "Rainy Day";
  } else {
      if (phase === 'night') greetingText = "Clear Night";
      else if (phase === 'afternoon') greetingText = "Lovely Afternoon";
      else greetingText = "Sunny Day";
  }
  
  let bgImage = "";
  const mapBackgrounds = {
      day: "/gambar/map.webp",
      afternoon: "/gambar/map_sore.webp", 
      night: "/gambar/map_malam.webp" 
  };

  if (isInside && currentLocation) {
    const bgData = locationBackgrounds[currentLocation];
    if (typeof bgData === 'object') {
        bgImage = bgData[phase] || bgData['day']; 
    } else {
        bgImage = bgData; 
    }
  } else {
    bgImage = mapBackgrounds[phase];
  }

  const backgroundStyle = {
      backgroundImage: `url("${bgImage}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover', 
      backgroundColor: '#222',
      transition: 'background-image 1s ease-in-out' 
  };

  const visualAvatarSize = getCurrentAvatarSize();
  const visualAvatarStyle = {
      width: `${visualAvatarSize}px`, height: `${visualAvatarSize}px`,
      transform: `translate(${playerPos.x}px, ${playerPos.y}px)`,
      marginTop: `-${visualAvatarSize / 2}px`, marginLeft: `-${visualAvatarSize / 2}px`
  };

  const calculateFinalScore = () => {
      const statTotal = stats.hunger + stats.energy + stats.hygiene + stats.happy;
      const activityScore = activitiesDone.size * 20;
      const itemScore = Math.floor((lifetimeItems + itemsUsedCount) / 5) * 10;
      const explorationScore = visitedLocs.size * 50;
      const totalScore = statTotal + activityScore + itemScore + explorationScore;
      let grade = 'D';
      if (totalScore > 1500) grade = 'S';
      else if (totalScore > 1000) grade = 'A';
      else if (totalScore > 700) grade = 'B';
      else if (totalScore > 400) grade = 'C';
      return { statTotal, activityScore, itemScore, explorationScore, totalScore, grade };
  };

  if (screen === 'start') {
    return <StartScreen avatars={avatars} avatarIndex={avatarIndex} setAvatarIndex={setAvatarIndex} playerName={playerName} setPlayerName={setPlayerName} onStart={() => {
        if(!playerName.trim()) return alert("Enter name!");
        setScreen('game'); setCurrentLocation('Home'); setIsInside(true);
        setPlayerPos(locationSpawnPoints['Home']); setLastMapPos({ x: -120, y: -80 }); 
        setGameWon(false);
        setWeather('sunny'); 
        setVisitedLocs(new Set()); setActivitiesDone(new Set()); setLifetimeItems(0); setItemsUsedCount(0);
    }} />;
  }

  if (screen === 'gameover') {
    const isWin = gameWon;
    const themeColor = isWin ? '#ffd700' : 'red';
    const bgImage = "url('/gambar/map_blur.webp')"; 
    const titleText = isWin ? 'NEW VILLAGE CHIEF!' : 'GAME OVER';
    const glowColor = isWin ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 0, 0, 0.3)';
    const finalScore = calculateFinalScore();

    return (
      <div className="fullscreen" style={{ backgroundImage: bgImage, backgroundSize: 'cover', overflowY: 'auto' }}>
        <div className="container" style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.90)', border: `4px solid ${themeColor}`, 
            boxShadow: `0 0 40px ${glowColor}`, padding: '30px', maxWidth: '500px', borderRadius: '20px', marginTop: '20px', marginBottom: '20px'
        }}>
          <h1 style={{color: themeColor, textShadow: '3px 3px 0px #000', fontSize: '2.5rem', marginBottom: '10px'}}>{titleText}</h1>
          <p style={{margin: '10px 0', fontSize: '1rem', color: '#fff', fontStyle: 'italic'}}>{gameOverReason}</p>
          <hr style={{borderColor: '#333', margin: '20px 0'}} />
          <h2 style={{color: '#00bfff', marginBottom: '15px'}}>LIFE SATISFACTION SCORE</h2>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc'}}><span>Stat Balance ({Math.round(finalScore.statTotal/4)} avg):</span><span style={{color: '#fff', fontWeight:'bold'}}>{finalScore.statTotal} pts</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc'}}><span>Activities ({activitiesDone.size} types):</span><span style={{color: '#fff', fontWeight:'bold'}}>{finalScore.activityScore} pts</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc'}}><span>Items (Collect/Use):</span><span style={{color: '#fff', fontWeight:'bold'}}>{finalScore.itemScore} pts</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc'}}><span>Exploration ({visitedLocs.size} locs):</span><span style={{color: '#fff', fontWeight:'bold'}}>{finalScore.explorationScore} pts</span></div>
          <div style={{background: '#222', padding: '15px', borderRadius: '10px', marginTop: '15px', border: `2px dashed ${themeColor}`}}>
              <div style={{fontSize: '14px', color: '#888'}}>TOTAL SCORE</div>
              <div style={{fontSize: '3rem', fontWeight: 'bold', color: themeColor}}>{finalScore.totalScore}</div>
              <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#fff'}}>GRADE: {finalScore.grade}</div>
          </div>
          <button onClick={() => window.location.reload()} style={{
              backgroundColor: themeColor, color: isWin ? 'black' : 'white', border: 'none', marginTop: '25px', padding: '15px 40px',
              fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: `0 5px 15px ${glowColor}`
          }}>PLAY AGAIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <HUD greeting={greetingText} playerName={playerName} day={day} timeString={timeString} stats={stats} />

      {currentEvent && (
          <div className="event-modal-overlay">
              <div className="event-card">
                  <h3>⚠ RANDOM EVENT! ⚠</h3>
                  <div style={{fontSize:'40px', margin:'10px'}}>🎲</div>
                  <h4 style={{color:'#00bfff', marginBottom:'5px'}}>{currentEvent.title}</h4>
                  <p>{currentEvent.text}</p>
                  <button onClick={closeEvent}>OK</button>
              </div>
          </div>
      )}

      {isBusy && !currentEvent && (
        <div className="progress-overlay">
            <div className="progress-container">
                <h3 style={{color: '#00bfff', marginBottom:'10px'}}>{pendingAction}...</h3>
                <div className="progress-track"><div className="progress-bar" style={{width: `${progress}%`}}></div></div>
                <button className="skip-btn" onClick={skipProgress}>FAST FORWARD (SKIP)</button>
            </div>
        </div>
      )}

      <div className="main-area">
        <GameArena 
            isInside={isInside} currentLocation={currentLocation} backgroundStyle={backgroundStyle}
            locationActivitySpots={locationActivitySpots} playerPos={playerPos}
            avatars={avatars} avatarIndex={avatarIndex} visualAvatarStyle={visualAvatarStyle}
            arenaRef={arenaRef}
        >
        </GameArena>

        <SidePanel 
            isInside={isInside} currentLocation={currentLocation} activeSpot={activeSpot} shopMenu={shopMenu}
            message={message} inventory={inventory} itemEffects={itemEffects}
            exitArea={exitArea} enterArea={enterArea} doActivity={doActivity} 
            handleInteraction={handleInteraction} useItem={useItem} setShopMenu={setShopMenu}
            movePlayer={movePlayer}
        />
      </div>
    </div>
  );
}

export default App;