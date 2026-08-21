// Teams and drivers (2023 season)
const teams = {
    "Red Bull": ["Max Verstappen", "Sergio Perez"],
    "Ferrari": ["Charles Leclerc", "Carlos Sainz"],
    "Mercedes": ["George Russell", "Lewis Hamilton"],
    "McLaren": ["Lando Norris", "Oscar Piastri"],
    "Aston Martin": ["Fernando Alonso", "Lance Stroll"],
    "Alpine": ["Pierre Gasly", "Esteban Ocon"],
    "Williams": ["Alex Albon", "Logan Sargeant"],
    "AlphaTauri": ["Nyck De Vries", "Yuki Tsunoda"],
    "Haas": ["Nico Hülkenberg", "Kevin Magnussen"],
    "Sauber": ["Valterri Bottas", "Guanyu Zhou"]
};
// FIX NUMBER OF RACES FOR 2023 AND ORDER
// Reduced performance gaps between teams
const teamBasePerformance = {
    "Red Bull": 0.0, "Ferrari": 0.11, "McLaren": 0.11, "Mercedes": 0.09,
    "Aston Martin": 0.1, "Alpine": 0.30, "Williams": 0.3, "AlphaTauri": 0.26,
    "Haas": 0.27, "Sauber": 0.28
};

const driverSkill = {
    "Max Verstappen": 0.45, "Sergio Perez": 0.2, "Charles Leclerc": 0.22,
    "Carlos Sainz": 0.22, "George Russell": 0.25, "Lewis Hamilton": 0.3,
    "Lando Norris": 0.3, "Oscar Piastri": 0.2, "Fernando Alonso": 0.3,
    "Lance Stroll": 0.05, "Pierre Gasly": 0.15, "Esteban Ocon": 0.05,
    "Alex Albon": 0.15, "Logan Sargeant": 0.10, "Nico Hülkenberg": 0.05,
    "Kevin Magnussen": 0.05, "Nyck De Vries": 0.05, "Yuki Tsunoda": 0.15,
    "Valterri Bottas": 0.05, "Guanyu Zhou": 0.05
};

const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const sprintPointsSystem = [8, 7, 6, 5, 4, 3, 2, 1];
const sprintRaces = ["China", "Miami", "Austria", "United States", "Brazil", "Qatar"];
const races = ["Bahrain", "Saudi Arabia", "Australia", "Japan", "China", "Miami", "Emilia-Romagna", "Monaco", "Canada", "Spain", "Austria", "Great Britain", "Hungary", "Belgium", "Netherlands", "Italy", "Azerbaijan", "Singapore", "United States", "Mexico", "Brazil", "Las Vegas", "Qatar", "Abu Dhabi"];
   
const dryRaces = ["Qatar", "Abu Dhabi", "Bahrain", "Saudi Arabia"];

// Team colors for charts and UI
const teamColors = {
    "Red Bull": "#0600EF",
    "Ferrari": "#DC0000",
    "Mercedes": "#00D2BE",
    "McLaren": "#FF8700",
    "Aston Martin": "#006F62",
    "Alpine": "#0090FF",
    "Williams": "#005AFF",
    "Racing Bulls": "#1E41FF",
    "Haas": "#FFFFFF",
    "Sauber": "#39FF14"
};

// Global variables to store season data
let seasonResults = {};
let driverStandings = {};
let constructorStandings = {};
let driverCumulativePoints = {};
let simulationResults = {
    drivers: {},
    constructors: {}
};

// Add event listener for the "Run Simulations" button
document.getElementById("runSimulations").addEventListener("click", () => {
    const numSimulationsInput = document.getElementById("numSimulations");
    const numSimulations = parseInt(numSimulationsInput.value);

    // Validate input
    if (numSimulations < 1 || numSimulations > 10000 || isNaN(numSimulations)) {
        alert("Please enter a number between 1 and 10000.");
        return;
    }

    // Run simulations
    simulateSeason(numSimulations);
});

function getTeam(driver) {
    for (let team in teams) {
        if (teams[team].includes(driver)) return team;
    }
    return null;
}

function simulateRace(raceName, isSprint = false) {
    let isWet = Math.random() < 0.2 && !dryRaces.includes(raceName);
    let results = [];
    let allDrivers = Object.values(teams).flat();

    // Track lap times for fastest lap calculation
    let lapTimes = {};

    allDrivers.forEach(driver => {
        let team = getTeam(driver);
        let performance = teamBasePerformance[team] - (driverSkill[driver] || 0);

        // Apply some randomness to performance
        performance += team in { "Red Bull": 1, "Ferrari": 1, "McLaren": 1, "Mercedes": 1 } ?
            (Math.random() * 0.15 - 0.075) : (Math.random() * 0.2 - 0.1);

        // DNF chance - slightly more reliability for top teams but less than before
        let dnf = Math.random() < (team in { "Red Bull": 1, "Ferrari": 1, "McLaren": 1, "Mercedes": 1 } ? 0.08 : 0.12);

        // Base time for the race in seconds (approximately 5400 seconds or 90 minutes)
        let raceTime = 5400 + performance * 60;
        // Add some random variation
        raceTime += Math.random() * 10 - 5;

        // Generate lap time (for fastest lap tracking)
        let lapTime = raceTime / 60; // Approximating lap time based on race performance
        lapTimes[driver] = lapTime;

        results.push({ driver, team, performance, dnf, raceTime, lapTime });
    });

    results.sort((a, b) => a.performance - b.performance); // Sort by performance ascending (lower is better)

    let finishers = results.filter(r => !r.dnf);
    let dnfs = results.filter(r => r.dnf);

    // Calculate time gap from leader
    if (finishers.length > 0) {
        let leaderTime = finishers[0].raceTime;
        finishers.forEach((result, index) => {
            if (index === 0) {
                result.timeGap = "-"; // Leader has no gap
            } else {
                let gapInSeconds = result.raceTime - leaderTime;
                result.timeGap = formatTimeGap(gapInSeconds);
            }
        });
    }

    // Find fastest lap driver
    let fastestLapDriver = Object.keys(lapTimes).reduce((a, b) => 
        lapTimes[a] < lapTimes[b] ? a : b
    );

    // Distribute points
    let finalResults = finishers.map((r, i) => {
    let points = (isSprint ?
        (i < sprintPointsSystem.length ? sprintPointsSystem[i] : 0) :
        (i < pointsSystem.length ? pointsSystem[i] : 0));

    // Add extra point for fastest lap if in top 10 and race is not a sprint
    if (!isSprint && r.driver === fastestLapDriver && i < 10) {
        points += 1;
    }

    return {
        position: i + 1,
        driver: r.driver,
        team: r.team,
        points: points,
        timeGap: r.timeGap,
        lapTime: r.lapTime,
        hasFastestLap: r.driver === fastestLapDriver && i < 10 && !isSprint // Ensure this is only true if not a sprint
    };
});

    // Add DNFs
    dnfs.forEach(dnf => {
        finalResults.push({
            position: "DNF",
            driver: dnf.driver,
            team: dnf.team,
            points: 0,
            timeGap: "DNF"
        });
    });

    // Add fastest lap information to the return object
    return { 
        raceName, 
        isWet, 
        results: finalResults,
        fastestLapDriver: fastestLapDriver,
        fastestLapTime: lapTimes[fastestLapDriver]
    };
}

function formatTimeGap(seconds) {
    if (seconds < 60) {
        return `+${seconds.toFixed(3)}`;
    } else {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return `+${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
    }
}

function simulateSeason(numSimulations) {
    // Reset data
    seasonResults = {};
    driverStandings = {};
    constructorStandings = {};
    driverCumulativePoints = {};

    // Initialize standings
    Object.keys(driverSkill).forEach(driver => {
        driverStandings[driver] = 0;
        driverCumulativePoints[driver] = races.map(() => 0);
    });

    Object.keys(teams).forEach(team => {
        constructorStandings[team] = 0;
    });

    // If running multiple simulations, reset simulation results THIS PART EDIT FOR AVERAGE RESULTS FOR 10K SIMULATIONS
    if (numSimulations > 1) {
        simulationResults = {
            drivers: {},
            constructors: {}
        };

        Object.keys(driverSkill).forEach(driver => {
            simulationResults.drivers[driver] = 0;
        });

        Object.keys(teams).forEach(team => {
            simulationResults.constructors[team] = 0;
        });
    }

    // Run simulations
    for (let sim = 0; sim < numSimulations; sim++) {
        // If it's not the first simulation and we're doing multiple, reset just the standings
        if (sim > 0) {
            Object.keys(driverSkill).forEach(driver => {
                driverStandings[driver] = 0;
            });

            Object.keys(teams).forEach(team => {
                constructorStandings[team] = 0;
            });
        }

        // Simulate each race in the season
        races.forEach((race, raceIndex) => {
            // Only store detailed results for the first simulation
            if (sim === 0) {
                seasonResults[race] = { mainRace: null, sprintRace: null };
            }

            // Simulate sprint race if applicable
            if (sprintRaces.includes(race)) {
                let sprintResult = simulateRace(race, true);

                if (sim === 0) {
                    seasonResults[race].sprintRace = sprintResult;
                }

                // Update standings with sprint results
                sprintResult.results.forEach(res => {
                    if (res.position !== "DNF") {
                        driverStandings[res.driver] += res.points;
                        constructorStandings[res.team] += res.points;
                    }
                });
            }

            // Simulate main race
            let mainResult = simulateRace(race);

            if (sim === 0) {
                seasonResults[race].mainRace = mainResult;
            }

            // Update standings with main race results
            mainResult.results.forEach(res => {
                if (res.position !== "DNF") {
                    driverStandings[res.driver] += res.points;
                    constructorStandings[res.team] += res.points;
                }
            });

            // Update cumulative points for the driver line graph (only for first simulation)
            if (sim === 0) {
                Object.keys(driverStandings).forEach(driver => {
                    driverCumulativePoints[driver][raceIndex] = driverStandings[driver];
                });
            }
        });

        // For multiple simulations, accumulate the results
        if (numSimulations > 1) {
            Object.keys(driverStandings).forEach(driver => {
                simulationResults.drivers[driver] += driverStandings[driver];
            });

            Object.keys(constructorStandings).forEach(team => {
                simulationResults.constructors[team] += constructorStandings[team];
            });
        }
    }

    // Calculate averages for multiple simulations
    if (numSimulations > 1) {
        Object.keys(simulationResults.drivers).forEach(driver => {
            simulationResults.drivers[driver] = Math.round(simulationResults.drivers[driver] / numSimulations);
        });

        Object.keys(simulationResults.constructors).forEach(team => {
            simulationResults.constructors[team] = Math.round(simulationResults.constructors[team] / numSimulations);
        });
    }

    updateUI(numSimulations > 1);
}

function updateUI(showSimulationResults = false) {
    // Update race buttons
    const raceButtonsContainer = document.getElementById("raceButtons");
    raceButtonsContainer.innerHTML = "";

    races.forEach(race => {
        const button = document.createElement("button");
        button.className = "px-3 py-1 text-sm rounded-md bg-gray-200";
        button.textContent = race;
        button.dataset.race = race;
        button.addEventListener("click", () => showRaceResults(race));
        raceButtonsContainer.appendChild(button);
    });

    // Show first race by default
    if (races.length > 0) {
        showRaceResults(races[0]);
    }

    // Update driver standings
    updateDriverStandings(showSimulationResults);

    // Update constructor standings
    updateConstructorStandings(showSimulationResults);

    // Draw cumulative points line graph
    drawDriverCumulativePointsChart();
}

function showRaceResults(raceName) {
    // Highlight selected race button
    document.querySelectorAll("#raceButtons button").forEach(btn => {
        if (btn.dataset.race === raceName) {
            btn.className = "px-3 py-1 text-sm rounded-md bg-red-600 text-white";
        } else {
            btn.className = "px-3 py-1 text-sm rounded-md bg-gray-200";
        }
    });

    const raceData = seasonResults[raceName];
    if (!raceData || !raceData.mainRace) return;

    // Update race title
    document.getElementById("raceTitle").textContent = `${raceName} Grand Prix`;

    // Show/hide sprint button
    const sprintButton = document.getElementById("sprintButton");
    if (raceData.sprintRace) {
        sprintButton.style.display = "block";
        sprintButton.dataset.race = raceName;
        sprintButton.textContent = "View Sprint Race";
        sprintButton.onclick = () => showSprintResults(raceName);
    } else {
        sprintButton.style.display = "none";
    }

    // Update race results table
    const tableBody = document.querySelector("#raceTable tbody");
    tableBody.innerHTML = "";

    raceData.mainRace.results.forEach(result => {
        if (result.position !== "DNF") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-2 py-1">${result.position}</td>
                <td class="px-2 py-1 font-medium">${result.driver}</td>
                <td class="px-2 py-1">${result.team}</td>
                <td class="px-2 py-1 text-right">${result.points}</td>
                <td class="px-2 py-1 text-right">${result.timeGap}</td>
            `;
            tableBody.appendChild(row);
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-2 py-1">DNF</td>
                <td class="px-2 py-1 font-medium text-gray-500">${result.driver}</td>
                <td class="px-2 py-1 text-gray-500">${result.team}</td>
                <td class="px-2 py-1 text-right">0</td>
                <td class="px-2 py-1 text-right">DNF</td>
            `;
            tableBody.appendChild(row);
        }
    });
}

function showSprintResults(raceName) {
    const raceData = seasonResults[raceName];
    if (!raceData || !raceData.sprintRace) return;

    // Update race title
    document.getElementById("raceTitle").textContent = `${raceName} Sprint Race`;

    // Update sprint button to show main race
    const sprintButton = document.getElementById("sprintButton");
    sprintButton.textContent = "View Main Race";
    sprintButton.onclick = () => showRaceResults(raceName);

    // Update race results table
    const tableBody = document.querySelector("#raceTable tbody");
    tableBody.innerHTML = "";

    raceData.sprintRace.results.forEach(result => {
        if (result.position !== "DNF") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-2 py-1">${result.position}</td>
                <td class="px-2 py-1 font-medium">${result.driver}</td>
                <td class="px-2 py-1">${result.team}</td>
                <td class="px-2 py-1 text-right">${result.points}</td>
                <td class="px-2 py-1 text-right">${result.timeGap}</td>
            `;
            tableBody.appendChild(row);
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-2 py-1">DNF</td>
                <td class="px-2 py-1 font-medium text-gray-500">${result.driver}</td>
                <td class="px-2 py-1 text-gray-500">${result.team}</td>
                <td class="px-2 py-1 text-right">0</td>
                <td class="px-2 py-1 text-right">DNF</td>
            `;
            tableBody.appendChild(row);
        }
    });
}

function updateDriverStandings(showSimulationResults = false) {
    // Sort drivers by points
    const pointsSource = showSimulationResults ? simulationResults.drivers : driverStandings;

    const sortedDrivers = Object.entries(pointsSource)
        .sort((a, b) => b[1] - a[1])
        .map(([driver, points], index) => ({
            position: index + 1,
            driver,
            team: getTeam(driver),
            points
        }));

    // Update driver standings table
    const tableBody = document.querySelector("#driverStandingsTable tbody");
    tableBody.innerHTML = "";

    sortedDrivers.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="px-2 py-1">${entry.position}</td>
            <td class="px-2 py-1">${entry.driver}</td>
            <td class="px-2 py-1">${entry.team}</td>
            <td class="px-2 py-1 text-right font-semibold">${entry.points}</td>
        `;
        tableBody.appendChild(row);
    });


    // Draw driver standings chart (top 10)
    drawDriverStandingsChart(sortedDrivers.slice(0, 10));
}

function updateConstructorStandings(showSimulationResults = false) {
    // Sort constructors by points
    const pointsSource = showSimulationResults ? simulationResults.constructors : constructorStandings;

    const sortedConstructors = Object.entries(pointsSource)
        .sort((a, b) => b[1] - a[1])
        .map(([team, points], index) => ({
            position: index + 1,
            team,
            points
        }));

    // Update constructor standings table
    const tableBody = document.querySelector("#constructorStandingsTable tbody");
    tableBody.innerHTML = "";

    sortedConstructors.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="px-2 py-1">${entry.position}</td>
            <td class="px-2 py-1">${entry.team}</td>
            <td class="px-2 py-1 text-right font-semibold">${entry.points}</td>
        `;
        tableBody.appendChild(row);
    });

    // Draw constructor standings chart
    drawConstructorStandingsChart(sortedConstructors);
}

function drawDriverStandingsChart(topDrivers) {
    const container = document.getElementById("driverStandingsChart");
    container.innerHTML = "";

    // Create bar chart with more space
    const maxPoints = topDrivers[0]?.points || 0;
    const barHeight = 30; // Increased height
    const chartHeight = topDrivers.length * (barHeight + 10); // More space between bars

    const svgContent = `
    <svg width="100%" height="${chartHeight}" style="overflow: visible;">
        ${topDrivers.map((entry, index) => {
        const y = index * (barHeight + 10);
        const width = (entry.points / maxPoints) * 90 + '%';
        const team = entry.team;
        const color = teamColors[team] || "#ccc";

        return `
            <g>
                <rect x="0" y="${y}" width="${width}" height="${barHeight}" fill="${color}" />
                <text x="10" y="${y + barHeight / 2 + 5}" fill="white" font-size="14" font-weight="bold">${entry.driver}</text>
                <text x="${(entry.points / maxPoints) * 90 + 5}%" y="${y + barHeight / 2 + 5}" fill="black" font-size="14" text-anchor="start">${entry.points} pts</text>
            </g>`;
    }).join('')}
    </svg>`;

    container.innerHTML = svgContent;
}

function drawConstructorStandingsChart(constructors) {
    const container = document.getElementById("constructorStandingsChart");
    container.innerHTML = "";

    // Create bar chart with more space
    const maxPoints = constructors[0]?.points || 0;
    const barHeight = 35; // Increased height
    const chartHeight = constructors.length * (barHeight + 10); // More space between bars

    const svgContent = `
    <svg width="100%" height="${chartHeight}" style="overflow: visible;">
        ${constructors.map((entry, index) => {
        const y = index * (barHeight + 10);
        const width = (entry.points / maxPoints) * 90 + '%';
        const team = entry.team;
        const color = teamColors[team] || "#ccc";

        return `
            <g>
                <rect x="0" y="${y}" width="${width}" height="${barHeight}" fill="${color}" />
                <text x="10" y="${y + barHeight / 2 + 5}" fill="white" font-size="16" font-weight="bold">${entry.team}</text>
                <text x="${(entry.points / maxPoints) * 90 + 5}%" y="${y + barHeight / 2 + 5}" fill="black" font-size="14" text-anchor="start">${entry.points} pts</text>
            </g>`;
    }).join('')}
    </svg>`;

    container.innerHTML = svgContent;
}

function drawDriverCumulativePointsChart() {
    const container = document.getElementById("teamPerformanceChart");
    container.innerHTML = "";

    // Line chart for cumulative points
    const svgWidth = container.offsetWidth || 600;
    const svgHeight = container.offsetHeight || 300;
    const margin = { top: 20, right: 120, bottom: 30, left: 40 }; // Increased right margin for legend
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Get all drivers and their cumulative points
    const driverData = Object.entries(driverCumulativePoints);

    // Find max points for scaling
    const maxPoints = Math.max(...driverData.map(([_, points]) => Math.max(...points)));

    // Create SVG content for line chart
    let svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}">
        <g transform="translate(${margin.left},${margin.top})">
            <!-- X and Y axes -->
            <line x1="0" y1="${height}" x2="${width}" y2="${height}" stroke="black" />
            <line x1="0" y1="0" x2="0" y2="${height}" stroke="black" />
            
            <!-- X axis labels -->
            ${races.map((race, index) => {
        if (index % 3 === 0) { // Show every 3rd race to avoid crowding
            const x = (index / (races.length - 1)) * width;
            return `
                    <text 
                        x="${x}" 
                        y="${height + 15}" 
                        font-size="10" 
                        text-anchor="middle" 
                        transform="rotate(45, ${x}, ${height + 15})"
                    >${race}</text>`;
        }
        return '';
    }).join('')}
            
            <!-- Y axis labels -->
            ${[0, 100, 200, 300, 400, 500].filter(val => val <= maxPoints).map(val => {
        const y = height - (val / maxPoints) * height;
        return `
                <text 
                    x="-5" 
                    y="${y}" 
                    font-size="10" 
                    text-anchor="end" 
                    dominant-baseline="middle"
                >${val}</text>
                <line 
                    x1="0" 
                    y1="${y}" 
                    x2="${width}" 
                    y2="${y}" 
                    stroke="#ddd" 
                    stroke-dasharray="2,2"
                />`;
    }).join('')}
            
            <!-- Title -->
            <text 
                x="${width / 2}" 
                y="-5" 
                font-size="14" 
                font-weight="bold" 
                text-anchor="middle"
            >Driver Points Progression</text>
            
            <!-- Line for each driver -->
            ${driverData.map(([driver, points]) => {
        const team = getTeam(driver);
        const color = teamColors[team] || "#ccc";

        // Calculate points line
        let path = "M";
        path += points.map((p, i) => {
            const x = (i / (races.length - 1)) * width;
            const y = height - (p / maxPoints) * height;
            return `${x},${y}`;
        }).join(" L");

        return `
                <path 
                    d="${path}" 
                    fill="none" 
                    stroke="${color}" 
                    stroke-width="2"
                />`;
    }).join('')}
            
            <!-- Legend -->
            ${driverData.map(([driver, _], index) => {
        const team = getTeam(driver);
        const color = teamColors[team] || "#ccc";
        const y = 20 + (index * 15);

        // Only show legend for top 10 to avoid overcrowding
        if (index < 10) {
            return `
                    <line 
                        x1="${width + 10}" 
                        y1="${y}" 
                        x2="${width + 30}" 
                        y2="${y}" 
                        stroke="${color}" 
                        stroke-width="2"
                    />
                    <text 
                        x="${width + 35}" 
                        y="${y}" 
                        font-size="10" 
                        dominant-baseline="middle"
                    >${driver}</text>`;
        }
        return '';
    }).join('')}
        </g>
    </svg>`;

    container.innerHTML = svgContent;
}

window.onload = function () {
    document.getElementById("simulateButton").addEventListener("click", () => simulateSeason(1));
    showSimulationControls();
};

