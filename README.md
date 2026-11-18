# 🌾 Asep Adventure

A pixel-art life simulation and exploration web game built with **React** and **Vite**.

Created for the **Basic Web Programming** final project at **Universitas Multimedia Nusantara (UMN)**, 2025.

---

## 👥 Kelompok 6 (Group Members)

* **Handri Suhandi** – `00000112190`
* **Juan Christifen Lowandy** – `00000117229`
* **Aquijade Grace Paendong** – `00000134176`

---

## 🎮 Game Overview

In **Asep Adventure**, you guide your character through daily life in a vibrant pixel village. Manage your daily schedule, explore distinct locations, interact with NPCs, forage, fish, and work toward becoming the village chief—all while keeping your core stats balanced!

### Starting Conditions
* All stats start at **50%**.
* Starting money: **$500**.

### 📊 Core Stats System
All stats decay naturally over time (and faster during bad weather):
* **Hunger:** Keep nourished by eating food or buying meals at the Warteg.
* **Energy:** Rest on your bed at Home or under trees in the Forest.
* **Hygiene:** Take baths at Home to stay clean and healthy.
* **Happiness:** Boost your mood by talking to villagers, reading, playing games, or building sandcastles.
* If any of Hunger, Energy, Hygiene, or Happiness reaches **0**, you receive a **Game Over**.

---

## 🗺️ Locations to Explore

* 🏠 **Home:** Sleep to restore Energy, take a bath for Hygiene, or use your PC (watch YouTube, read books, or play games).
* 🍲 **Warteg:** Order food (Rice, Tea, Fried Fish, Juice) or clean tables to earn money.
* 🏘️ **Village:** Chat with villagers, visit the General Store to buy tools (Fishing Rod, Fruit Basket) or sell goods (Wild Berries, Seashells, Old Coins), and visit the Village Chief House.
* 🏖️ **Beach:** Hunt for treasures, collect seashells, and build sandcastles.
* 🌊 **Lake:** Catch fish (requires a Fishing Rod).
* 🌲 **Forest:** Forage for wild berries, pick fruits (requires a Fruit Basket), or rest under trees.

---

## 🏆 Game Objectives & Endings

1. ☠️ **Bad Ending:**
   Occurs if any one of your stats reaches 0:
   * **Hunger = 0:** Collapse from starvation
   * **Energy = 0:** Pass out from extreme exhaustion
   * **Hygiene = 0:** Fall gravely ill due to poor hygiene
   * **Happiness = 0:** Lose all hope and give up

2. 👑 **Good Ending (Village Chief):**
   * Save up **$10,000**.
   * Purchase the entire town from the **Village Chief House** in the Village.
   * Unlocks the victory celebration and your final **Life Satisfaction Score & Grade (S / A / B / C / D)** based on stats, activities completed, items used, and locations visited.

---

## 🕹️ Controls

* **Movement:** `W`, `A`, `S`, `D` or `Arrow Keys` (or the on-screen D-pad buttons on the side panel).
* **Interactions:** Walk up to an object, NPC, or interaction zone, then click the interaction button on the right-hand panel.
* **Fast Forward:** Skip activity timers instantly with the **Fast Forward (Skip)** button.

---

## 🚀 How to Run Locally

1. **Navigate to the web app folder:**
   ```bash
   cd "stardew-asep"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
