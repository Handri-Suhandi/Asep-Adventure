export const avatars = [
  "/gambar/avatar1.webp",
  "/gambar/avatar2.webp",
  "/gambar/avatar3.webp",
  "/gambar/avatar4.webp"
];

export const locationBackgrounds = {
  "Home": {
    day: "/gambar/home_bg.webp",
    afternoon: "/gambar/home_sore.webp",
    night: "/gambar/home_malam.webp"
  },
  "Village": {
    day: "/gambar/village_bg.webp",
    afternoon: "/gambar/village_sore.webp",
    night: "/gambar/village_malam.webp"
  },
  "Forest": {
    day: "/gambar/forest_bg.webp",
    afternoon: "/gambar/forest_sore.webp",
    night: "/gambar/forest_malam.webp"
  },
  "Lake": {
    day: "/gambar/lake_bg.webp",
    afternoon: "/gambar/lake_sore.webp",
    night: "/gambar/lake_malam.webp"
  },
  "Warteg": {
    day: "/gambar/warteg_bg.webp",
    afternoon: "/gambar/warteg_sore.webp",
    night: "/gambar/warteg_malam.webp"
  },
  "Beach": {
    day: "/gambar/beach_bg.webp",
    afternoon: "/gambar/beach_sore.webp",
    night: "/gambar/beach_malam.webp"
  }
};

export const locationSpawnPoints = {
  "Home":    { x: 0, y: 250 },     
  "Village": { x: -100, y: 250 },    
  "Forest":  { x: 70, y: 250 },   
  "Lake":    { x: 0, y: 250 },    
  "Warteg":  { x: 0, y: 200 },     
  "Beach":   { x: -250, y: 200 }  
};

export const locationAvatarSizes = {
  "Map": 60,       
  "Home": 250,     
  "Warteg": 180,   
  "Village": 150,
  "Forest": 120,
  "Lake": 150,
  "Beach": 150
};

export const locationActivitySpots = {
  "Home": [
    { id: 1, x: -300, y: 200, action: "Resting", label: "Sleep (Bed)" },
    { id: 2, x: -150, y: 200, action: "Taking a Bath", label:"Take a Bath"},
    { id: 3, x: 300, y: 150, label: "Use PC",
        menuItems: [
            { label: "Watch YouTube", action: "Watching YouTube"},
            { label: "Read Online Books", action: "Reading"},
            { label: "Play Games", action: "Playing Games"}
        ]
    }
  ],
  "Warteg": [
    { 
      id: 1, x: 0, y: -100, label: "Order Food", 
      menuItems: [
        { label: "Rice ($30)", action: "Ordering Rice" },
        { label: "Tea ($5)", action: "Ordering Tea" },
        { label: "Fish ($15 + Fish)", action: "Ordering Fried Fish" },
        { label: "Juice ($10 + Fruits)", action: "Ordering Juice"}
      ]
    },
    { id: 3, x: -400, y: 200, action: "Cleaning Table", label: "Table" }
  ],
  "Village": [
    { id: 1, x: 200, y: 150, label: "Villager",
      menuItems: [
        { label: "Talk", action: "Talking to Villagers"}
      ]
     },
    { 
      id: 2, x: 80, y: -20, label: "General Store", 
      menuItems: [
        { label: "Buy Fishing Rod (-$300)", action: "Buying Fishing Rod" },
        { label: "Buy Fruit Basket (-$70)", action: "Buying Fruit Basket"},
        { label: "Sell Wild Berry (+$20)", action: "Selling Berry" },
        { label: "Sell Seashell (+$15)", action: "Selling Seashell" },
        { label: "Sell Old Coin (+$150)", action: "Selling Old Coin" }
      ]
    },
    { id: 3, x: 350, y: 300, label: "Village Chief House",
      menuItems: [
        { label: "Buy the whole town (-$10,000)", action: "Buying Village" }
      ]
    }
  ],
  "Lake": [
    { id: 1, x: 300, y: 200, action: "Fishing", label: "Fishing Spot" }
  ],
  "Forest": [
    { id: 1, x: -100, y: 150, action: "Foraging for Berries", label: "Bush" },
    { id: 3, x: 200, y: 200,  label: "Tree",
      menuItems:[
      {label: "Rest", action: "Resting on a Tree"},
      {label: "Pick Fruits", action: "Picking Fruits"}
      ]
      
    }
  ],
  "Beach": [
    { id: 1, x: -200, y: 250, label: "Sand",
      menuItems: [
        {label: "Collect Shells", action: "Collecting Shells"},
        {label: "Build Sand Castle", action: "Building a Sand Castle"},
        {label: "Hunt for Treasure", action: "Hunting for Treasure"}
      ]
    }
  ]
};

export const activityEffects = {
  "Talking to Villagers": { happy: +15, hunger: -7,hygiene: -8, time: 20 },
  "Buying Fishing Rod": { happy: +5, money: -300, receive: { name: "Fishing Rod", qty: 1 }, time: 5 },
  "Ordering Rice": { money: -30, receive: { name: "Rice", qty: 1 }, time: 20 },
  "Buying Fruit Basket": { money : -70, receive: { name: "Fruit Basket", qty: 1}, time: 5},
  "Ordering Tea": { money: -5, receive: { name: "Tea", qty: 1 }, time: 10 },
  "Selling Seashell": { money: +15, happy: +3, sell: { name: "Seashell", qty: 1 }, time: 2 },
  "Selling Berry": { money: +20, happy: +2, sell: { name: "Wild Berry", qty: 1 }, time: 2 },
  "Selling Old Coin": { money: +150, happy: +10, sell: { name: "Old Coin", qty: 1 }, time: 2 },
  "Cleaning Table": { hygiene: -8, happy: -2, money: +45, time: 60 },
  "Resting": { energy: +80, hunger: -15, hygiene: -18, time: 480 },
  "Taking a Bath": { hygiene: +40, happy: -2, hunger: -15, time: 30 },
  "Resting on a Tree": { energy: +12, hunger: -2, happy: +5, time: 45 },
  "Watching YouTube": {energy: -10, hunger: -5, happy: +10, time: 60},
  "Reading": {energy: -15, hunger: -5, happy: +8, time: 45},
  "Playing Games": {energy: -20, hunger: -10, happy: +15, time: 90},
  "Collecting Shells": {happy: +3, hygiene: -10, energy: -5, receive: { name: "Seashell", qty: 1 }, time: 30 },
  "Building a Sand Castle": {happy: +8, hygiene: -15, energy: -10, time: 90 },
  "Hunting for Treasure": { energy: -25, hunger: -15, hygiene: -10, receive: { name: "Old Coin", qty: 1 }, time: 90 },
  "Fishing": {happy: +8, hygiene: -8, energy: -5, receive: { name: "Raw Fish", qty: 1 }, requires: "Fishing Rod", time: 60 },
  "Foraging for Berries": { happy: +5, hygiene: -3, receive: { name: "Wild Berry", qty: 2 }, time: 45 },
  "Picking Fruits": {happy: +10, hygiene: -5, hunger: -5, energy: -8, receive: {name: "Fruits", qty:1 }, requires: "Fruit Basket", time: 30},
  "Ordering Fried Fish": { money: -15, consume: { name: "Raw Fish", qty: 1 }, receive: { name: "Fried Fish", qty: 1 }, time: 25},
  "Ordering Juice": { money: -10, consume: { name: "Fruits", qty: 1}, receive: { name: "Juice", qty: 1}, time: 20},
  "Buying Village": { money: -10000, win: true, time: 0 }
};

export const itemEffects = {
    "Rice": { hunger: +20, energy: +10 },
    "Tea": { hunger: +3, energy: +10, happy: +5 },
    "Wild Berry": { hunger: +5, energy: +2 },
    "Raw Fish": { hunger: +2, happy: -15, energy: -25}, 
    "Fruits": { hunger: +12, happy: +8},
    "Seeds": null, 
    "Fishing Rod": null,
    "Fruit Basket": null, 
    "Old Coin": null,
    "Seashell": null,
    "Recyclables": null,
    "Fried Fish": { hunger: +40, energy: +20, happy: +10 },
    "Juice": {hunger: +5, energy: +12, happy: +20}
};