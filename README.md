[PizzaRadar - Best Pizza & Live Distance Tracker]
One line: what this is and who it's for (hint: it's for you).

Author: [Nile Robinson] · Course: CMP 464/343 Product 1 · Last updated: [10/14/26]


1. About Me (the User)
Who am I in the context of this problem? What roles am I playing (student, employee, parent, athlete, gamer…)?
I am a hungry commuter who cares about the freshness of the food. I want a pizza without wasting 40 minutes on an overrated tourist trap. The role is customer.


The last 3 times this happened: Real, recent moments. For each: when and where, what went wrong, what it cost, what you did.

1: Searched for a generic map service, saw a 4.6 star spot listed as "0.3 miles away.
2: The delivery services listed places 4 miles away with 60-minute delivery estimates, while local review lists didn't account for our walking pace or who was actually serving lunch right then.
3 : needed a quick detour for dinner. A place looked close as the crow flies across the river, but
involved a 25-minute route across a congested bridge. By the time we arrived, their ovens were already off for the night.
What it costs me: Be specific. How often, how much?

⏱️ Time:30–45 minutes lost per outing cross-referencing ratings, estimated travel times, and open hours across separate browser tabs.
💸 Money:$20–$45 wasted per bad meal on soggy crusts or delivery surge markups.
🔋 Energy:Decision fatigue when hungry.
🙂 Joy:Missing out on the pleasure of biting into a hot, freshly baked crust straight from the oven.


2. Problem Statement
Gut check: I need honest quality scores and true walking or driving proximity together in one view because the distance estimates ignore how quickly I can actually reach the place.

I need [X] because [Y].

Five Whys:

Why did I end up with cold, mediocre pizza? Because I picked a place solely based on a high star count that was further away than I realized.
Why do generic reviews lump together cheap fountain drinks, quick delivery speed, and tourist hype rather than dough fermentation, crust crispness, and sauce balance?
Why does straight-line distance don't match real turn-by-turn travel time across busy city streets?
Why cross-referencing food blogs, review boards, and transit directions while walking on the street requires juggling multiple screens?
Why are food quality and physical proximity treated as separate decisions instead of a single immediate trade-off?

Problem statement:
When stepping onto the street hungry and needing dinner right now, I struggle to pinpoint which nearby ovens bake exceptional crusts and are realistically reachable before closing, which costs me 30 to 45 minutes of aimless walking and $25 to $50 on disappointing meals each week. This happens because high aggregate star counts mask mediocre food quality and straight line mileage misleads actual walking and driving travel times. Right now I was between food blogs, map lookups, and delivery listings on my phone, but piecing together conflicting opinions while on the move is slow, stressful, and still ends in cold meals.

I'll know this is solved when: I can leave my location, walk or drive directly to an oven serving hot, crisp pizza within 15 minutes, and take my first bite without second-guessing my choice.

Check: none of these words appear: app, website, platform, dashboard, tool, AI, track, automate, notify, feature.


3. Existing Solutions
What I use or tried
What it does well
Why it falls short for me
Google Maps
Comprehensive location database
no distinction between slice styles
Yelp
High volume of user photos and detailed opening times.
Dominated by complaints about parking or service rather than pizza quality;
Uber Eats
Seamless ordering and delivery ETAs.
Focuses on delivery drivers rather than dining in or walking in;


The gap: In one sentence, what's still missing for me?

None of the current options combine pizza-specific dough and crust assessments with live, step-by-step physical proximity in a single, glanceable view.


4. Features & Benefits
Every feature should move me toward my "solved when" line.

Feature (what it does)
Benefit (how my life gets better)
MVP or Later?
Live Geolocation & Real-Time Distance Countdown
Shows exact walking and driving distance and updates continuously as I walk down the street toward the shop
MVP
Weighted Pizza Quality Index
Combines star scores with review volume and crust feedback so exceptional artisan spots rise above tourist traps.
MVP
Pizza Style Filter (Neapolitan, Detroit, NY Slice, Wood-Fired)
Eliminates decision fatigue by showing only the exact crust style I crave.
MVP
Interactive Community Crust & Sauce Scorecard
Allows pizza lovers to submit dedicated ratings for crust, sauce, and cheese pull.
later

MVP (2–3 features): The skateboard: the smallest version I'd actually use.
Real-time GPS distance calculation + Weighted Pizza Quality Index + Style filtering on an interactive map.
Later: Oven wait times, photo uploads, user scorecards, multi-stop crawls.
Not doing: Online payment processing, driver dispatch/delivery logistics, table reservations, or non-pizza restaurant categories.


5. Tech Stack
Front end
Surface: Responsive Web (Optimized for mobile viewports on the street and desktop exploration).
Tools: React 19, TypeScript, Tailwind CSS, @vis.gl/react-google-maps.
Why: When hunger strikes, users are on foot with a mobile browser; instant load time without app store installations is essential, while desktop support allows trip planning at home
Back end
Piece
Choice
Why
Client / API Layer
Modern Google Maps JavaScript SDK (Places API New & Routes API)
Promise-based, client-side execution avoiding CORS restrictions and eliminating server proxy latency.
Data Storage
Local Storage + Client State (with Firestore path for shared reviews)
Instantaneous zero-latency reads for ratings, custom reviews, and location presets.
Outside Services
Google Maps Platform (Maps JS, Advanced Markers, Routes) & Browser Geolocation API
Industry standard for geospatial accuracy, road network routing, and high-accuracy device GPS coordinates.
Hosting / deploy
Google Cloud Run / Vite Production Build
Fast global CDN delivery, sub-second TTFB, and seamless integration with Google Cloud project credentials.

Architecture sketch
flowchart LR

  U["Me"] --> FE["Front end: ..."]

  FE --> API["Back end / API: ..."]

  API --> DB[("Data: ...")]


6. Open Questions
What am I still unsure about? What do I need to figure out or test first?
How much does walking speed vary across users?
Test: Measure whether a standard 3.1 mph (1.4 m/s) walking calculation feels accurate in dense pedestrian cities with traffic lights versus suburban sidewalks.

link to the app
https://ai.studio/apps/723a0e43-f979-460c-b407-e2a6c218e69a 
