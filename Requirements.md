# **Racing League Web App – Functional Requirements**

## **1. General / System**

1. The system will support multiple concurrent **seasons**.
2. Each season can have multiple **classes** racing simultaneously.
3. Each season will have multiple **races**, each associated with a track and date.
4. The system will track **racers** who can participate in multiple seasons over time.
5. **Admins** can manage seasons, races, racers, classes, and cars.
6. Public users (or league members) can **view standings** and race results.
7. No real-time functionality is required — **results are entered manually** after races.
8. The system should allow **drop-lowest scoring races per racer per season**, configurable per season.
9. Some races can be marked as **double points**, configurable per season.
10. **Fastest lap bonus** per class is supported and awarded per race.

---

## **2. Racers**

1. A **Racer** entity exists independently of seasons.
2. Racer fields:

   * `steam_name` (unique, required)
   * `ac_name` (required)
   * `rank` (enum: Rookie, Amateur, Pro, Expert, default Rookie)
3. A racer can participate in **only one class per season**, but can switch classes across seasons.
4. A racer can **switch cars within the same class mid-season**.

---

## **3. Classes & Cars**

1. **Class**: A category of competition (e.g., GT3, GT4).
2. **Car**: Specific car model within a class (e.g., Porsche 911 GT3 R).
3. Each car is linked to exactly **one class**.
4. **Admins** can manage classes and cars (CRUD).
5. Cars can change per race, but **class cannot change mid-season**.

---

## **4. Seasons**

1. Each season has:

   * Name
   * Start date
   * End date
   * Configurable number of races
   * Number of races to **drop per racer**
2. Admins can specify:

   * Tracks / races
   * Which races are worth **double points**
   * Number of races **excluded** per season per racer
3. Each season maintains **season-specific participation**: racers + class selection.

---

## **5. Races**

1. Each race belongs to **one season**.
2. Each race has:

   * Track name
   * Race date
   * Optional double-points flag (defined per season)
3. Admins can enter race results manually after the race.

---

## **6. Race Results**

1. Race results are entered per **race and class**.
2. Each result includes:

   * Racer (via season participation)
   * Car used
   * Finishing position
   * Points earned
   * Fastest lap flag (boolean)
3. Points calculation:

   * Standard points for finishing position
   * Bonus for fastest lap
   * Optional double points applied if race is marked as such

---

## **7. Season Participation**

1. Tracks **racer participation per season per class**.
2. Each racer can have only **one class per season**.
3. Racer can switch cars mid-season — car is tied to **race result**, not season participation.

---

## **8. Leaderboards**

1. Standings are computed per **season and class**.
2. Total points calculation includes:

   * Sum of race points
   * Drop lowest N race results per season (configurable)
   * Fastest lap bonuses
   * Double points where applicable
3. Leaderboard output includes:

   * Racer name / Steam name / AC name
   * Total points
   * Races counted / dropped
   * Cars used per race (optional)
4. Ties may optionally be broken by number of wins or fastest laps.

---

## **9. Admin Functionality**

1. CRUD operations for:

   * Racers
   * Classes
   * Cars
   * Seasons
   * Races
   * Race Results
2. Season configuration:

   * Set number of races
   * Configure drop-lowest count
   * Assign tracks / double points
3. Validation enforced:

   * Racer cannot participate in multiple classes in the same season
   * Car must belong to class when entered in race results

---

## **10. Wiki / External Integration**

1. Leaderboards should be exportable as **Markdown or HTML** for Wiki.js.
2. Backend exposes endpoints for generating **Markdown leaderboard pages**.
3. Wiki.js pulls standings dynamically via API (remote content module).

---

## **11. Non-Functional Requirements**

1. System must be web-accessible (frontend SPA).
2. Admin operations must be secure (authentication optional initially).
3. Low-cost deployment using Azure services:

   * PostgreSQL for database
   * App Service for backend
   * Static Web Apps for frontend
4. Scalable for multiple seasons and hundreds of racers.
5. Logging and monitoring for errors and race updates.

---

✅ **This functional requirements document now captures all the rules, relationships, and business logic we discussed**, including:

* Racer constraints
* Classes / cars
* Seasons and races
* Drop-lowest logic and double points
* Admin CRUD
* Wiki.js integration

---