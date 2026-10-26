# F1 Season Predictor

A browser-based Monte Carlo simulator for Formula 1 seasons (2022 to 2025). Open `index.html`, pick a season, then simulate the season once or run up to 10,000 simulations to get average championship standings.

## How it works

Each race is simulated driver by driver:

- **Pace** = team base performance (gap to the fastest car) + driver skill, scaled by track-specific team multipliers
- **Randomness**: race-to-race noise, a 20% chance of a wet race (outside races marked as dry) that widens the noise, and a per-driver DNF probability (lower for the top four teams)
- **Scoring**: the real points systems for Grands Prix and sprints, with a fastest-lap point
- Running N simulations accumulates the points across runs, giving expected driver and constructor standings

## Files

| File | Season |
|---|---|
| `2025.html` / `2025.js` | 2025 grid, with a batch runner for up to 10,000 simulations |
| `2022`-`2024` `.html` / `.js` | earlier seasons |
| `script.js` | React/Recharts version of the 2025 simulator |
| `index.html`, `styles.css` | season picker and styling |

Built with JavaScript, HTML and CSS, plus React and Recharts in `script.js`. No install is needed: open `index.html` in a browser.
