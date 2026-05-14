const fs = require('fs');

const html = fs.readFileSync('./raw-data.txt', 'utf-8');

// Extract all matches with results
const matchRegex = /<li class="row visible" data-round="(\d+)"[^>]*>.*?<div class="club1"[^>]*>.*?href="[^"]*">([^<]+)<div.*?<div class="res1">(\d+)<\/div>.*?<div class="res2">(\d+)<\/div>.*?<div class="club2"[^>]*>.*?href="[^"]*">([^<]+)<div/gs;

const teams = {};

function getOrCreateTeam(name) {
  const cleanName = name.trim();
  if (!teams[cleanName]) {
    teams[cleanName] = {
      team: cleanName,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0
    };
  }
  return teams[cleanName];
}

let match;
let matchCount = 0;

while ((match = matchRegex.exec(html)) !== null) {
  const round = parseInt(match[1]);
  const team1Name = match[2].trim();
  const score1 = parseInt(match[3]);
  const score2 = parseInt(match[4]);
  const team2Name = match[5].trim();
  
  matchCount++;
  console.log(`Kolo ${round}: ${team1Name} ${score1}:${score2} ${team2Name}`);
  
  const team1 = getOrCreateTeam(team1Name);
  const team2 = getOrCreateTeam(team2Name);
  
  // Update played
  team1.played++;
  team2.played++;
  
  // Update goals
  team1.gf += score1;
  team1.ga += score2;
  team2.gf += score2;
  team2.ga += score1;
  
  // Update wins/draws/losses and points
  if (score1 > score2) {
    team1.wins++;
    team1.points += 3;
    team2.losses++;
  } else if (score1 < score2) {
    team2.wins++;
    team2.points += 3;
    team1.losses++;
  } else {
    team1.draws++;
    team2.draws++;
    team1.points += 1;
    team2.points += 1;
  }
}

console.log(`\nTotal matches parsed: ${matchCount}`);
console.log(`Total teams: ${Object.keys(teams).length}`);

// Calculate goal difference
Object.values(teams).forEach(team => {
  team.gd = team.gf - team.ga;
});

// Sort by points, then goal difference, then goals for
const standings = Object.values(teams).sort((a, b) => {
  if (b.points !== a.points) return b.points - a.points;
  if (b.gd !== a.gd) return b.gd - a.gd;
  return b.gf - a.gf;
});

console.log('\n--- TABLICA ---');
standings.forEach((team, i) => {
  console.log(`${i+1}. ${team.team} - ${team.points} bod (${team.played} ut, ${team.wins}-${team.draws}-${team.losses}, ${team.gf}:${team.ga}, +/-${team.gd})`);
});

fs.writeFileSync('./standings.json', JSON.stringify(standings, null, 2));
console.log('\nStandings saved to standings.json');
