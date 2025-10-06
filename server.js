const express = require('express');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize teams object
const teams = {};

const scrapeStandings = async () => {
  try {
    // Reset teams data
    Object.keys(teams).forEach(key => delete teams[key]);

    // You need to add the actual URL you want to scrape
    const url = 'YOUR_TARGET_URL_HERE';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('.current_results').each((i, table) => {
      $(table).find('tr').each((j, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 3) {
          const homeTeam = $(cols[0]).text().trim();
          const score = $(cols[1]).text().trim();
          const awayTeam = $(cols[2]).text().trim();
          
          if (!score.includes(':')) return;
          
          const [homeGoals, awayGoals] = score.split(':').map(Number);

          // Validate that we got proper numbers
          if (isNaN(homeGoals) || isNaN(awayGoals)) return;

          const initTeam = (team) => {
            if (!teams[team]) {
              teams[team] = { 
                played: 0, 
                wins: 0, 
                draws: 0, 
                losses: 0, 
                gf: 0, 
                ga: 0 
              };
            }
          };

          initTeam(homeTeam);
          initTeam(awayTeam);

          teams[homeTeam].played++;
          teams[awayTeam].played++;
          teams[homeTeam].gf += homeGoals;
          teams[homeTeam].ga += awayGoals;
          teams[awayTeam].gf += awayGoals;
          teams[awayTeam].ga += homeGoals;

          if (homeGoals > awayGoals) {
            teams[homeTeam].wins++;
            teams[awayTeam].losses++;
          } else if (homeGoals < awayGoals) {
            teams[awayTeam].wins++;
            teams[homeTeam].losses++;
          } else {
            teams[homeTeam].draws++;
            teams[awayTeam].draws++;
          }
        }
      });
    });

    const standings = Object.entries(teams).map(([name, stats]) => ({
      team: name,
      ...stats,
      gd: stats.gf - stats.ga,
      points: stats.wins * 3 + stats.draws
    }));

    standings.sort((a, b) => 
      b.points - a.points || 
      b.gd - a.gd || 
      b.gf - a.gf
    );

    fs.writeFileSync('standings.json', JSON.stringify(standings, null, 2));
    console.log(`[${new Date().toLocaleString()}] Standings updated.`);

  } catch (err) {
    console.error('Error scraping standings:', err.message);
  }
};

// Cron: every 30 minutes from 9:00 to 23:00 on Saturday and Sunday
cron.schedule('*/30 9-23 * * 6,0', scrapeStandings);

app.get('/api/standings', (req, res) => {
  try {
    const data = fs.readFileSync('standings.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading standings:', error.message);
    res.status(500).json({ error: 'Unable to load standings data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  // Initial scrape on startup
  scrapeStandings();
});
