const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// CodeChef stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Get user profile page
        const response = await axios.get(`https://www.codechef.com/users/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        // Check if user exists
        if ($('div.error-page').length > 0) {
            return res.status(404).json({ 
                error: `User '${username}' not found on CodeChef. Please check the username and try again.` 
            });
        }

        // Extract rating
        const rating = $('div.rating-number').text().trim() || '0';

        // Extract solved problems
        const solvedProblems = $('section.rating-data-section.problems-solved').find('h5').map((i, el) => $(el).text().trim()).get();
        const totalSolved = parseInt(solvedProblems[0]?.match(/\d+/)?.[0]) || 0;
        const partiallySolved = parseInt(solvedProblems[1]?.match(/\d+/)?.[0]) || 0;

        // Extract difficulty stats
        const difficultyStats = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0
        };

        // Get submissions page
        try {
            const submissionsResponse = await axios.get(`https://www.codechef.com/status?user_handle=${username}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const submissionsHtml = submissionsResponse.data;
            const submissions$ = cheerio.load(submissionsHtml);

            // Process submissions
            submissions$('tr').each((i, el) => {
                if (i === 0) return; // Skip header row
                const row = $(el);
                const status = row.find('td').eq(2).text().trim();
                const problemName = row.find('td').eq(1).text().trim();
                
                if (status === 'AC') {
                    const difficulty = problemName.match(/\[(EASY|MEDIUM|HARD)\]/);
                    if (difficulty) {
                        switch (difficulty[1]) {
                            case 'EASY':
                                difficultyStats.EASY++;
                                break;
                            case 'MEDIUM':
                                difficultyStats.MEDIUM++;
                                break;
                            case 'HARD':
                                difficultyStats.HARD++;
                                break;
                        }
                    }
                }
            });

            const stats = {
                total_solved: totalSolved,
                easy_solved: difficultyStats.EASY,
                medium_solved: difficultyStats.MEDIUM,
                hard_solved: difficultyStats.HARD,
                rating: rating,
                profile_url: `https://www.codechef.com/users/${username}`
            };

            res.json(stats);

        } catch (error) {
            console.error('Error fetching CodeChef submissions:', error);
            // If submissions can't be fetched, return basic stats
            const stats = {
                total_solved: totalSolved,
                easy_solved: 0,
                medium_solved: 0,
                hard_solved: 0,
                rating: rating,
                profile_url: `https://www.codechef.com/users/${username}`
            };
            res.json(stats);
        }

    } catch (error) {
        console.error('Error fetching CodeChef stats:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: `User '${username}' not found on CodeChef. Please check the username and try again.` 
            });
        }
        res.status(500).json({ 
            error: `Failed to fetch CodeChef stats: ${error.message}. Please try again later.` 
        });
    }
});

module.exports = router;
