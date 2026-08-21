const { useState } = React; 

const { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Bar } = Recharts; 

 

const F1SeasonPredictor = () => { 

  // Define drivers and teams 

  const teams = { 

    "Red Bull": ["Max Verstappen", "Liam Lawson"], 

    "Ferrari": ["Charles Leclerc", "Lewis Hamilton"], 

    "Mercedes": ["George Russell", "Kimi Antonelli"], 

    "McLaren": ["Lando Norris", "Oscar Piastri"], 

    "Aston Martin": ["Fernando Alonso", "Lance Stroll"], 

    "Alpine": ["Pierre Gasly", "Jack Doohan"], 

    "Williams": ["Alex Albon", "Carlos Sainz"], 

    "Racing Bulls": ["Yuki Tsunoda", "Isack Hadjar"], 

    "Haas": ["Esteban Ocon", "Oliver Bearman"], 

    "Sauber": ["Nico Hülkenberg", "Gabriel Bortoleto"] 

  }; 

 

  // Team base performance (seconds gap to theoretical "perfect" lap) 

  // Lower numbers mean faster teams 

  const teamBasePerformance = { 

    "Red Bull": 0.0,      // Reference point 

    "Ferrari": 0.05,      // Very close to Red Bull 

    "McLaren": 0.10,      // Slightly behind Ferrari 

    "Mercedes": 0.15,     // Close but still developing 

    "Aston Martin": 0.50, // Top of midfield 

    "Alpine": 0.60, 

    "Williams": 0.65, 

    "Racing Bulls": 0.70, 

    "Haas": 0.80, 

    "Sauber": 0.90 

  }; 

 

  // Track characteristics (1.0 = neutral, >1.0 favors certain teams, <1.0 disadvantages) 

  const trackCharacteristics = { 

    "Australia": { 

      "Red Bull": 1.01, "Ferrari": 1.02, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.99, "Racing Bulls": 0.98,  

      "Haas": 1.00, "Sauber": 0.99 

    }, 

    "China": { 

      "Red Bull": 1.01, "Ferrari": 1.01, "McLaren": 1.01, "Mercedes": 1.02, 

      "Aston Martin": 0.99, "Alpine": 0.99, "Williams": 0.98, "Racing Bulls": 0.98,  

      "Haas": 0.97, "Sauber": 0.98 

    }, 

    "Japan": { 

      "Red Bull": 1.02, "Ferrari": 1.00, "McLaren": 1.03, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.97, "Racing Bulls": 1.00,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Bahrain": { 

      "Red Bull": 1.02, "Ferrari": 1.03, "McLaren": 0.99, "Mercedes": 0.98, 

      "Aston Martin": 1.00, "Alpine": 0.99, "Williams": 0.97, "Racing Bulls": 1.01,  

      "Haas": 1.00, "Sauber": 0.98 

    }, 

    "Saudi Arabia": { 

      "Red Bull": 1.03, "Ferrari": 1.01, "McLaren": 1.02, "Mercedes": 0.99, 

      "Aston Martin": 0.98, "Alpine": 1.00, "Williams": 1.01, "Racing Bulls": 1.00,  

      "Haas": 0.99, "Sauber": 0.98 

    }, 

    "Miami": { 

      "Red Bull": 1.00, "Ferrari": 1.02, "McLaren": 1.01, "Mercedes": 1.01, 

      "Aston Martin": 0.98, "Alpine": 1.00, "Williams": 1.00, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Imola": { 

      "Red Bull": 1.01, "Ferrari": 1.03, "McLaren": 1.00, "Mercedes": 1.00, 

      "Aston Martin": 1.01, "Alpine": 0.99, "Williams": 0.97, "Racing Bulls": 0.98,  

      "Haas": 0.99, "Sauber": 0.98 

    }, 

    "Monaco": { 

      "Red Bull": 0.99, "Ferrari": 1.02, "McLaren": 1.01, "Mercedes": 0.99, 

      "Aston Martin": 1.02, "Alpine": 1.00, "Williams": 0.97, "Racing Bulls": 0.98,  

      "Haas": 1.01, "Sauber": 0.99 

    }, 

    "Spain": { 

      "Red Bull": 1.01, "Ferrari": 1.01, "McLaren": 1.02, "Mercedes": 1.01, 

      "Aston Martin": 1.00, "Alpine": 0.99, "Williams": 0.98, "Racing Bulls": 0.98,  

      "Haas": 0.97, "Sauber": 0.97 

    }, 

    "Canada": { 

      "Red Bull": 1.02, "Ferrari": 1.00, "McLaren": 1.01, "Mercedes": 1.01, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 1.00, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Austria": { 

      "Red Bull": 1.03, "Ferrari": 1.00, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.98, "Alpine": 0.99, "Williams": 0.99, "Racing Bulls": 1.01,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "United Kingdom": { 

      "Red Bull": 1.01, "Ferrari": 1.00, "McLaren": 1.02, "Mercedes": 1.02, 

      "Aston Martin": 1.00, "Alpine": 0.98, "Williams": 1.00, "Racing Bulls": 0.98,  

      "Haas": 0.97, "Sauber": 0.98 

    }, 

    "Belgium": { 

      "Red Bull": 1.02, "Ferrari": 1.01, "McLaren": 1.00, "Mercedes": 1.01, 

      "Aston Martin": 0.99, "Alpine": 1.00, "Williams": 1.01, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Hungary": { 

      "Red Bull": 1.00, "Ferrari": 1.02, "McLaren": 1.01, "Mercedes": 1.01, 

      "Aston Martin": 1.01, "Alpine": 0.99, "Williams": 0.97, "Racing Bulls": 0.98,  

      "Haas": 0.99, "Sauber": 0.98 

    }, 

    "Netherlands": { 

      "Red Bull": 1.03, "Ferrari": 1.00, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.99, "Racing Bulls": 1.00,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Italy": { 

      "Red Bull": 1.01, "Ferrari": 1.03, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.99, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.98 

    }, 

    "Azerbaijan": { 

      "Red Bull": 1.00, "Ferrari": 1.01, "McLaren": 1.00, "Mercedes": 1.01, 

      "Aston Martin": 1.00, "Alpine": 1.00, "Williams": 1.01, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.98 

    }, 

    "Singapore": { 

      "Red Bull": 0.99, "Ferrari": 1.02, "McLaren": 1.02, "Mercedes": 1.01, 

      "Aston Martin": 1.01, "Alpine": 0.99, "Williams": 0.98, "Racing Bulls": 0.98,  

      "Haas": 0.99, "Sauber": 0.98 

    }, 

    "United States": { 

      "Red Bull": 1.01, "Ferrari": 1.01, "McLaren": 1.02, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.99, "Williams": 0.99, "Racing Bulls": 0.98,  

      "Haas": 1.00, "Sauber": 0.97 

    }, 

    "Mexico": { 

      "Red Bull": 1.01, "Ferrari": 1.00, "McLaren": 1.01, "Mercedes": 1.01, 

      "Aston Martin": 0.99, "Alpine": 0.99, "Williams": 0.98, "Racing Bulls": 1.00,  

      "Haas": 0.99, "Sauber": 0.98 

    }, 

    "Brazil": { 

      "Red Bull": 1.02, "Ferrari": 1.01, "McLaren": 1.00, "Mercedes": 1.01, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.99, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Las Vegas": { 

      "Red Bull": 1.01, "Ferrari": 1.02, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.98, "Alpine": 0.99, "Williams": 1.01, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Qatar": { 

      "Red Bull": 1.02, "Ferrari": 1.01, "McLaren": 1.01, "Mercedes": 1.00, 

      "Aston Martin": 0.99, "Alpine": 0.98, "Williams": 0.98, "Racing Bulls": 0.99,  

      "Haas": 0.98, "Sauber": 0.97 

    }, 

    "Abu Dhabi": { 

      "Red Bull": 1.01, "Ferrari": 1.01, "McLaren": 1.01, "Mercedes": 1.01, 

      "Aston Martin": 0.99, "Alpine": 0.99, "Williams": 0.98, "Racing Bulls": 0.98,  

      "Haas": 0.97, "Sauber": 0.98 

    } 

  }; 

 

  // Driver skill ratings (relative to teammates) 

  const driverSkill = { 

    "Max Verstappen": 0.30,      // Exceptional 

    "Liam Lawson": 0.05,         // Rookie, promising 

    "Charles Leclerc": 0.25,     // Top tier 

    "Lewis Hamilton": 0.25,      // Multiple champion 

    "George Russell": 0.20,      // Very strong 

    "Kimi Antonelli": 0.00,      // Rookie 

    "Lando Norris": 0.25,        // Top tier 

    "Oscar Piastri": 0.15,       // Strong second season 

    "Fernando Alonso": 0.25,     // Veteran champion 

    "Lance Stroll": 0.05,        // Experienced 

    "Pierre Gasly": 0.15,        // Experienced, solid 

    "Jack Doohan": 0.00,         // Rookie 

    "Alex Albon": 0.15,          // Experienced, skilled 

    "Carlos Sainz": 0.20,        // Proven race winner 

    "Esteban Ocon": 0.15,        // Experienced 

    "Oliver Bearman": 0.05,      // Rookie, promising 

    "Yuki Tsunoda": 0.10,        // Experienced 

    "Isack Hadjar": 0.00,        // Rookie 

    "Nico Hülkenberg": 0.15,     // Veteran 

    "Gabriel Bortoleto": 0.00    // Rookie 

  }; 

 

  // Development rates through the season (positive means improving) 

  const teamDevelopment = { 

    "Red Bull": 0.001,         // Steady improvement 

    "Ferrari": 0.0015,         // Strong development 

    "Mercedes": 0.002,         // Catching up 

    "McLaren": 0.0015,         // Strong development 

    "Aston Martin": 0.001,     // Steady improvement 

    "Alpine": 0.0005,          // Slow improvement 

    "Williams": 0.001,         // Steady improvement 

    "Racing Bulls": 0.0005,    // Slow improvement 

    "Haas": 0.0005,            // Slow improvement 

    "Sauber": 0.0005           // Slow improvement 

  }; 

 

  // Weather sensitivity - some teams perform better/worse in wet conditions 

  // >1.0 means better in wet, <1.0 means worse in wet 

  const wetWeatherPerformance = { 

    "Red Bull": 1.01,            

    "Ferrari": 0.98,             

    "Mercedes": 1.00,           

    "McLaren": 1.00,           

    "Aston Martin": 1.02,      

    "Alpine": 0.99,           

    "Williams": 0.98,          

    "Racing Bulls": 0.99,     

    "Haas": 0.97,             

    "Sauber": 0.98            

  }; 

 

  // Driver wet weather skill modifiers 

  const driverWetSkill = { 

    "Max Verstappen": 0.10,     // Exceptional in wet 

    "Lewis Hamilton": 0.10,     // Exceptional in wet 

    "Fernando Alonso": 0.08,    // Very good in wet 

    "Carlos Sainz": 0.05,       // Good in wet 

    "Lando Norris": 0.05,       // Good in wet 

    "George Russell": 0.03      // Above average in wet 

  }; 

 

  // List of all F1 drivers 

  const allDrivers = Object.values(teams).flat(); 

 

  // F1 races for 2025 season (updated calendar) 

  const races = [ 

    "Australia", "China", "Japan", "Bahrain", "Saudi Arabia",  

    "Miami", "Imola", "Monaco", "Spain", "Canada",  

    "Austria", "United Kingdom", "Belgium", "Hungary", "Netherlands",  

    "Italy", "Azerbaijan", "Singapore", "United States", "Mexico",  

    "Brazil", "Las Vegas", "Qatar", "Abu Dhabi" 

  ]; 

 

  // Points system 

  const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; 

  const fastestLapPoint = 1; 

  const sprintPointsSystem = [8, 7, 6, 5, 4, 3, 2, 1]; // 8-7-6-5-4-3-2-1 point system for sprint races 

 

  // Sprint races 

  const sprintRaces = ["China", "Miami", "Belgium", "United States", "Brazil", "Qatar"]; 

 

  // State for season results 

  const [seasonResults, setSeasonResults] = useState([]); 

  const [sprintResults, setSprintResults] = useState([]); 

  const [driverStandings, setDriverStandings] = useState([]); 

  const [constructorStandings, setConstructorStandings] = useState([]); 

  const [selectedRace, setSelectedRace] = useState(null); 

  const [selectedSprint, setSelectedSprint] = useState(null); 

  const [performanceTracker, setPerformanceTracker] = useState([]); 

  const [isWetRace, setIsWetRace] = useState({}); 

 

  // Function to get team for a driver 

  const getTeamForDriver = (driver) => { 

    for (const [team, drivers] of Object.entries(teams)) { 

      if (drivers.includes(driver)) { 

        return team; 

      } 

    } 

    return "Unknown Team"; 

  }; 

 

  // Function to calculate team & driver performance at a specific race 

  const calculatePerformance = (team, driver, raceName, raceIndex, isWet) => { 

    // Base performance (seconds off the pace) 

    let performance = teamBasePerformance[team]; 

     

    // Add track characteristics influence 

    performance = performance / trackCharacteristics[raceName][team]; 

     

    // Add driver skill advantage 

    performance = performance - driverSkill[driver]; 

     

    // Add season development factor (teams get better through the season) 

    performance = performance - (teamDevelopment[team] * raceIndex); 

     

    // Add wet weather factor if applicable 

    if (isWet) { 

      performance = performance / (wetWeatherPerformance[team] || 1.0); 

      // Add driver wet weather skill if they have it 

      if (driverWetSkill[driver]) { 

        performance = performance - driverWetSkill[driver]; 

      } 

    } 

     

    // Add random factor (representing weekend performance variations) 

    // More random for midfield teams 

    let randomFactor = 0; 

    if (["Red Bull", "Ferrari", "McLaren", "Mercedes"].includes(team)) { 

      // Less random variation for top teams 

      randomFactor = (Math.random() - 0.5) * 0.2; 

    } else { 

      // More random variation for midfield teams 

      randomFactor = (Math.random() - 0.5) * 0.3; 

    } 

    performance = performance + randomFactor; 

     

    // Ensure no negative performance (which would mean faster than "perfect") 

    return Math.max(0, performance); 

  }; 

 

  // Function to simulate race results 

  const simulateRace = (raceName, raceIndex, isSprint = false) => { 

    // Random chance of wet race (20% chance) 

    const isWet = Math.random() < 0.2; 

     

    if (!isSprint) { 

      // Store wet race information 

      setIsWetRace(prev => ({...prev, [raceName]: isWet})); 

    } 

     

    // Calculate driver performances for this race 

    const performances = []; 

     

    for (const driver of allDrivers) { 

      const team = getTeamForDriver(driver); 

      const performance = calculatePerformance(team, driver, raceName, raceIndex, isWet); 

       

      performances.push({ 

        driver, 

        team, 

        performance 

      }); 

    } 

     

    // Sort by performance (lowest time first = better) 

    performances.sort((a, b) => a.performance - b.performance); 

     

    // Random chance of DNF (more likely for lower teams) 

    const finalResults = performances.map((perf, index) => { 

      // Base DNF chance is low for top teams, higher for backmarkers 

      const baseChance = ["Red Bull", "Ferrari", "McLaren", "Mercedes"].includes(perf.team) ? 0.05 : 0.1; 

       

      // Add some randomness 

      const dnfChance = baseChance + (Math.random() * 0.07); 

       

      // Is this a DNF? 

      const isDNF = Math.random() < dnfChance; 

       

      return { 

        ...perf, 

        position: index + 1, 

        points: !isDNF && index < (isSprint ? 8 : 10) ?  

                (isSprint ? sprintPointsSystem[index] : pointsSystem[index]) : 0, 

        isDNF, 

        // Only main races get fastest lap point, and only if not DNF  

        fastestLap: !isSprint && !isDNF && index === 0 

      }; 

    }); 

     

    // Apply fastest lap point if relevant 

    if (!isSprint) { 

      // Find random driver in top 10 who finished 

      const eligibleDrivers = finalResults 

        .filter(result => !result.isDNF && result.position <= 10); 

       

      if (eligibleDrivers.length > 0) { 

        const fastestLapDriver = eligibleDrivers[Math.floor(Math.random() * eligibleDrivers.length)]; 

         

        // Reset all fastest laps 

        finalResults.forEach(result => result.fastestLap = false); 

         

        // Set new fastest lap 

        finalResults.find(result => result.driver === fastestLapDriver.driver).fastestLap = true; 

      } 

    } 

     

    // Track team performance for visualization 

    if (!isSprint) { 

      const teamPerfs = {}; 

      Object.keys(teams).forEach(team => { 

        // Average of both drivers 

        const drivers = teams[team]; 

        const driverResults = finalResults.filter(r => drivers.includes(r.driver) && !r.isDNF); 

         

        if (driverResults.length > 0) { 

          teamPerfs[team] = driverResults.reduce((sum, r) => sum + r.performance, 0) / driverResults.length; 

        } else { 

          // If both DNF, use average of team base performance 

          teamPerfs[team] = teamBasePerformance[team]; 

        } 

      }); 

       

      // Add to tracker 

      setPerformanceTracker(prev => [ 

        ...prev,  

        {  

          race: raceName, 

          raceIndex, 

          ...teamPerfs, 

          isWet 

        } 

      ]); 

    } 

     

    return { 

      raceName, 

      isWet, 

      positions: finalResults 

    }; 

  }; 

 

  // Function to calculate championship standings 

  const calculateStandings = (results, sprints) => { 

    // Initialize driver points 

    const driverPoints = {}; 

    allDrivers.forEach(driver => { 

      driverPoints[driver] = 0; 

    }); 

 

    // Initialize constructor points 

    const constructorPoints = {}; 

    Object.keys(teams).forEach(team => { 

      constructorPoints[team] = 0; 

    }); 

 

    // Calculate points from race results 

    results.forEach(race => { 

      race.positions.forEach(position => { 

        if (!position.isDNF) { 

          // Add position points 

          driverPoints[position.driver] += position.points; 

          constructorPoints[position.team] += position.points; 

 

          // Add fastest lap point if applicable 

          if (position.fastestLap) { 

            driverPoints[position.driver] += fastestLapPoint; 

            constructorPoints[position.team] += fastestLapPoint; 

          } 

        } 

      }); 

    }); 

     

    // Add sprint race points 

    sprints.forEach(sprint => { 

      sprint.positions.forEach(position => { 

        if (!position.isDNF) { 

          // Add sprint points 

          driverPoints[position.driver] += position.points; 

          constructorPoints[position.team] += position.points; 

        } 

      }); 

    }); 

 

    // Sort driver standings 

    const driverStandings = Object.entries(driverPoints) 

      .map(([driver, points]) => ({ 

        driver, 

        team: getTeamForDriver(driver), 

        points 

      })) 

      .sort((a, b) => b.points - a.points); 

 

    // Sort constructor standings 

    const constructorStandings = Object.entries(constructorPoints) 

      .map(([team, points]) => ({ 

        team, 

        points 

      })) 

      .sort((a, b) => b.points - a.points); 

 

    return { 

      driverStandings, 

      constructorStandings 

    }; 

  }; 

 

  // Simulate entire season 

  const simulateSeason = () => { 

    // Reset states 

    setSeasonResults([]); 

    setSprintResults([]); 

    setPerformanceTracker([]); 

    setIsWetRace({}); 

     

    // Simulate main races 

    const results = races.map((race, index) => simulateRace(race, index)); 

     

    // Simulate sprint races 

    const sprints = races 

      .filter(race => sprintRaces.includes(race)) 

      .map((race, index) => simulateRace(race, races.indexOf(race), true)); 

     

    // Update states 

    setSeasonResults(results); 

    setSprintResults(sprints); 

     

    const standings = calculateStandings(results, sprints); 

    setDriverStandings(standings.driverStandings); 

    setConstructorStandings(standings.constructorStandings); 

     

    setSelectedRace(null); 

    setSelectedSprint(null); 

  }; 

 

  // View specific race result 

  const viewRaceResult = (index) => { 

    setSelectedRace(index); 

    setSelectedSprint(null); 

  }; 

   

  // View specific sprint result 

  const viewSprintResult = (raceName) => { 

    const sprintIndex = sprintResults.findIndex(sprint => sprint.raceName === raceName); 

    if (sprintIndex !== -1) { 

      setSelectedSprint(sprintIndex); 

      setSelectedRace(null); 

    } 

  }; 

 

  // Get chart data for drivers 

  const getDriverChartData = () => { 

    return driverStandings 

      .slice(0, 10) // Top 10 drivers 

      .map(entry => ({ 

        name: entry.driver.split(' ')[1], // Last name only for legibility 

        points: entry.points, 

        team: entry.team 

      })); 

  }; 

 

  // Get chart data for constructors 

  const getConstructorChartData = () => { 

    return constructorStandings.map(entry => ({ 

      name: entry.team, 

      points: entry.points 

    })); 

  }; 

   

  // Get performance chart data 

  const getPerformanceChartData = () => { 

    if (performanceTracker.length === 0) return []; 

     

    // Convert the tracker data to recharts format 

    // We want each race to be a data point, with team performances as values 

    return performanceTracker.map(raceData => { 

      const { race, raceIndex, isWet, ...teamData } = raceData; 

       

      // Invert performance numbers so higher is better for the chart 

      const invertedData = {}; 

      for (const [team, value] of Object.entries(teamData)) { 

        // Lower lap time is better, so invert it for visualization 

        invertedData[team] = 1 - value; 

      } 

       

      return { 

        name: race, 

        ...invertedData, 

        isWet 

      }; 

    }); 

  }; 

 

  // Team colors for chart 

  const teamColors = { 

    "Red Bull": "#0600EF", 

    "Ferrari": "#DC0000", 

    "Mercedes": "#00D2BE", 

    "McLaren": "#FF8700", 

    "Aston Martin": "#006F62", 

    "Alpine": "#0090FF", 

    "Williams": "#005AFF", 

    "Racing Bulls": "#2B4562", 

    "Haas": "#FFFFFF", 

    "Sauber": "#900000" 

  }; 

 

  // Get color for bar chart 

  const getTeamColor = (entry) => { 

    return teamColors[entry.team] || "#777777"; 

  }; 

 

  return ( 

    <div className="p-4 max-w-6xl mx-auto"> 

      <div className="text-center mb-6"> 

        <h1 className="text-3xl font-bold mb-2">F1 2025 Season Predictor</h1> 

        <p className="text-gray-600 mb-4">Incorporating team performance differentials, track characteristics, and development rates</p> 

        <button  

          onClick={simulateSeason} 

          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" 

        > 

          Simulate Full Season 

        </button> 

      </div> 

 

      {seasonResults.length > 0 && ( 

        <div className="mb-8"> 

          <h2 className="text-xl font-bold mb-4">Team Performance Tracker</h2> 

          <div className="bg-gray-100 p-4 rounded-lg"> 

            <div className="h-64"> 

              <ResponsiveContainer width="100%" height="100%"> 

                <LineChart data={getPerformanceChartData()}> 

                  <CartesianGrid strokeDasharray="3 3" /> 

                  <XAxis dataKey="name" /> 

                  <YAxis domain={[0, 1]} hide /> 

                  <Tooltip  

                    formatter={(value, name) => [ 

                      `${(value * 100).toFixed(1)}%`,  

                      name 

                    ]} 

                    labelFormatter={(value) => { 

                      const raceData = performanceTracker.find(r => r.race === value); 

                      return `${value} GP${raceData?.isWet ? ' (Wet)' : ''}`; 

                    }} 

                  /> 

                  <Legend /> 

                  {Object.keys(teams).map(team => ( 

                    <Line  

                      key={team} 

                      type="monotone" 

                      dataKey={team} 

                      stroke={teamColors[team]} 

                      dot={{ r: 3 }} 

                      activeDot={{ r: 6 }} 

                    /> 

                  ))} 

                </LineChart> 

              </ResponsiveContainer> 

            </div> 

            <div className="mt-2 text-sm text-gray-600 text-center"> 

              Higher values indicate better performance. Wet races are indicated in tooltips. 

            </div> 

          </div> 

        </div> 

      )} 

 

      {seasonResults.length > 0 && ( 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 

          {/* Driver Standings */} 

          <div className="bg-gray-100 p-4 rounded-lg"> 

            <h2 className="text-xl font-bold mb-4">Driver Standings</h2> 

            <div className="h-64"> 

              <ResponsiveContainer width="100%" height="100%"> 

                <BarChart data={getDriverChartData()} layout="vertical"> 

                  <CartesianGrid strokeDasharray="3 3" /> 

                  <XAxis type="number" /> 

                  <YAxis dataKey="name" type="category" width={80} /> 

                  <Tooltip  

                    formatter={(value, name, props) => [`${value} points`, props.payload.name]} 

                    labelFormatter={(value) => `Driver: ${value}`} 

                  /> 

                  <Legend /> 

 

<Bar dataKey="points" fill="#8884d8" name="Points" radius={[4, 4, 0, 0]} 

                       fill={(entry) => getTeamColor(entry)} /> 

                </BarChart> 

              </ResponsiveContainer> 

            </div> 

            <div className="mt-4 max-h-96 overflow-y-auto"> 

              <table className="min-w-full"> 

                <thead> 

                  <tr> 

                    <th className="px-2 py-1 text-left">Pos</th> 

                    <th className="px-2 py-1 text-left">Driver</th> 

                    <th className="px-2 py-1 text-left">Team</th> 

                    <th className="px-2 py-1 text-right">Points</th> 

                  </tr> 

                </thead> 

                <tbody> 

                  {driverStandings.map((entry, index) => ( 

                    <tr key={entry.driver} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}> 

                      <td className="px-2 py-1">{index + 1}</td> 

                      <td className="px-2 py-1">{entry.driver}</td> 

                      <td className="px-2 py-1">{entry.team}</td> 

                      <td className="px-2 py-1 text-right font-semibold">{entry.points}</td> 

                    </tr> 

                  ))} 

                </tbody> 

              </table> 

            </div> 

          </div> 

 

          {/* Constructor Standings */} 

          <div className="bg-gray-100 p-4 rounded-lg"> 

            <h2 className="text-xl font-bold mb-4">Constructor Standings</h2> 

            <div className="h-64"> 

              <ResponsiveContainer width="100%" height="100%"> 

                <BarChart data={getConstructorChartData()} layout="vertical"> 

                  <CartesianGrid strokeDasharray="3 3" /> 

                  <XAxis type="number" /> 

                  <YAxis dataKey="name" type="category" width={100} /> 

                  <Tooltip formatter={(value) => [`${value} points`, "Points"]} /> 

                  <Legend /> 

                  <Bar dataKey="points" name="Points" radius={[4, 4, 0, 0]} 

                       fill={(entry) => teamColors[entry.name] || "#777777"} /> 

                </BarChart> 

              </ResponsiveContainer> 

            </div> 

            <div className="mt-4"> 

              <table className="min-w-full"> 

                <thead> 

                  <tr> 

                    <th className="px-2 py-1 text-left">Pos</th> 

                    <th className="px-2 py-1 text-left">Team</th> 

                    <th className="px-2 py-1 text-right">Points</th> 

                  </tr> 

                </thead> 

                <tbody> 

                  {constructorStandings.map((entry, index) => ( 

                    <tr key={entry.team} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}> 

                      <td className="px-2 py-1">{index + 1}</td> 

                      <td className="px-2 py-1">{entry.team}</td> 

                      <td className="px-2 py-1 text-right font-semibold">{entry.points}</td> 

                    </tr> 

                  ))} 

                </tbody> 

              </table> 

            </div> 

          </div> 

        </div> 

      )} 

 

      {/* Race Selection */} 

      {seasonResults.length > 0 && ( 

        <div className="mt-8"> 

          <h2 className="text-xl font-bold mb-4">Race Results</h2> 

          <div className="flex flex-wrap gap-2 mb-4"> 

            {races.map((race, index) => ( 

              <button 

                key={race} 

                onClick={() => viewRaceResult(index)} 

                className={`px-3 py-1 text-sm rounded-md ${ 

                  selectedRace === index 

                    ? 'bg-red-600 text-white' 

                    : 'bg-gray-200 hover:bg-gray-300' 

                } ${isWetRace[race] ? 'border-2 border-blue-500' : ''}`} 

              > 

                {race} 

                {sprintRaces.includes(race) && ( 

                  <span className="ml-1 text-xs">+S</span> 

                )} 

              </button> 

            ))} 

          </div> 

 

          {/* Selected Race Result */} 

          {selectedRace !== null && ( 

            <div className="bg-gray-100 p-4 rounded-lg"> 

              <div className="flex justify-between items-center mb-4"> 

                <h3 className="text-lg font-bold"> 

                  {seasonResults[selectedRace].raceName} Grand Prix 

                  {seasonResults[selectedRace].isWet && ( 

                    <span className="ml-2 text-sm text-blue-600 font-normal">(Wet Race)</span> 

                  )} 

                </h3> 

                {sprintRaces.includes(seasonResults[selectedRace].raceName) && ( 

                  <button 

                    onClick={() => viewSprintResult(seasonResults[selectedRace].raceName)} 

                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600" 

                  > 

                    View Sprint Race 

                  </button> 

                )} 

              </div> 

              <div className="overflow-x-auto"> 

                <table className="min-w-full"> 

                  <thead> 

                    <tr> 

                      <th className="px-2 py-1 text-left">Pos</th> 

                      <th className="px-2 py-1 text-left">Driver</th> 

                      <th className="px-2 py-1 text-left">Team</th> 

                      <th className="px-2 py-1 text-right">Points</th> 

                      <th className="px-2 py-1 text-center">Fastest Lap</th> 

                    </tr> 

                  </thead> 

                  <tbody> 

                    {seasonResults[selectedRace].positions.map((position) => ( 

                      <tr  

                        key={position.driver}  

                        className={position.isDNF ? "bg-red-100" : (position.position % 2 === 0 ? "bg-white" : "bg-gray-50")} 

                      > 

                        <td className="px-2 py-1"> 

                          {position.isDNF ? 'DNF' : position.position} 

                        </td> 

                        <td className="px-2 py-1 font-medium">{position.driver}</td> 

                        <td className="px-2 py-1">{position.team}</td> 

                        <td className="px-2 py-1 text-right"> 

                          {position.isDNF ? '-' : position.points + (position.fastestLap ? 1 : 0)} 

                        </td> 

                        <td className="px-2 py-1 text-center"> 

                          {position.fastestLap && '🏎️'} 

                        </td> 

                      </tr> 

                    ))} 

                  </tbody> 

                </table> 

              </div> 

            </div> 

          )} 

 

          {/* Selected Sprint Result */} 

          {selectedSprint !== null && ( 

            <div className="bg-yellow-50 p-4 rounded-lg mt-4"> 

              <div className="flex justify-between items-center mb-4"> 

                <h3 className="text-lg font-bold"> 

                  {sprintResults[selectedSprint].raceName} Sprint Race 

                  {sprintResults[selectedSprint].isWet && ( 

                    <span className="ml-2 text-sm text-blue-600 font-normal">(Wet Race)</span> 

                  )} 

                </h3> 

                <button 

                  onClick={() => viewRaceResult(races.indexOf(sprintResults[selectedSprint].raceName))} 

                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700" 

                > 

                  View Main Race 

                </button> 

              </div> 

              <div className="overflow-x-auto"> 

                <table className="min-w-full"> 

                  <thead> 

                    <tr> 

                      <th className="px-2 py-1 text-left">Pos</th> 

                      <th className="px-2 py-1 text-left">Driver</th> 

                      <th className="px-2 py-1 text-left">Team</th> 

                      <th className="px-2 py-1 text-right">Points</th> 

                    </tr> 

                  </thead> 

                  <tbody> 

                    {sprintResults[selectedSprint].positions.map((position) => ( 

                      <tr  

                        key={position.driver}  

                        className={position.isDNF ? "bg-red-100" : (position.position % 2 === 0 ? "bg-white" : "bg-gray-50")} 

                      > 

                        <td className="px-2 py-1"> 

                          {position.isDNF ? 'DNF' : position.position} 

                        </td> 

                        <td className="px-2 py-1 font-medium">{position.driver}</td> 

                        <td className="px-2 py-1">{position.team}</td> 

                        <td className="px-2 py-1 text-right"> 

                          {position.isDNF ? '-' : position.points} 

                        </td> 

                      </tr> 

                    ))} 

                  </tbody> 

                </table> 

              </div> 

            </div> 

          )} 

        </div> 

      )} 

    </div> 

  ); 

   

}; 

const root = ReactDOM.createRoot(document.getElementById("root")); 

root.render(React.createElement(F1SeasonPredictor)); 

export default F1SeasonPredictor; 

 

 
