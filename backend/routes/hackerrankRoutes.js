const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// HackerRank stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Get user profile page
        const response = await axios.get(`https://www.hackerrank.com/profile/${username}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Connection': 'keep-alive'
            }
        });

        if (response.status !== 200) {
            if (response.status === 404) {
                return res.status(404).json({ 
                    error: `User '${username}' not found on HackerRank` 
                });
            }
            return res.status(response.status).json({ 
                error: `HackerRank API Error: ${response.statusText}` 
            });
        }

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract badges
        const badges = [];
        $('svg.hexagon').each((i, el) => {
            const title = $(el).find('text.badge-title').text().trim();
            const stars = $(el).find('path.star').length;
            if (title) {
                badges.push({
                    title,
                    stars
                });
            }
        });

        // Extract certificates
        const certificates = [];
        const certificatesDiv = $('div.hacker-certificates');
        if (certificatesDiv.length > 0) {
            certificatesDiv.find('a.certificate-link').each((i, el) => {
                const certHeading = $(el).find('h2.certificate_v3-heading');
                if (certHeading.length > 0) {
                    const certName = certHeading.text().replace('Certificate:', '').trim();
                    const certUrl = 'https://www.hackerrank.com' + $(el).attr('href');
                    const isVerified = $(el).find('span.certificate_v3-heading-verified').length > 0;
                    certificates.push({
                        name: certName,
                        url: certUrl,
                        verified: isVerified
                    });
                }
            });
        }

        // Extract difficulty stats
        const difficultyStats = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0
        };

        // Get submissions page
        try {
            const submissionsResponse = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/submissions`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Connection': 'keep-alive'
                }
            });
            const submissions = submissionsResponse.data;

            // Process submissions
            if (submissions.success && submissions.model) {
                submissions.model.forEach(submission => {
                    if (submission.status === 'solved') {
                        switch (submission.difficulty) {
                            case 'easy':
                                difficultyStats.EASY++;
                                break;
                            case 'medium':
                                difficultyStats.MEDIUM++;
                                break;
                            case 'hard':
                                difficultyStats.HARD++;
                                break;
                        }
                    }
                });
            }

            const stats = {
                badges,
                certificates,
                total_solved: submissions.success ? submissions.model.length : 0,
                easy_solved: difficultyStats.EASY,
                medium_solved: difficultyStats.MEDIUM,
                hard_solved: difficultyStats.HARD,
                profile_url: `https://www.hackerrank.com/profile/${username}`
            };

            res.json(stats);

        } catch (error) {
            console.error('Error fetching HackerRank submissions:', error);
            // If submissions can't be fetched, return basic stats
            const stats = {
                badges,
                certificates,
                total_solved: 0,
                easy_solved: 0,
                medium_solved: 0,
                hard_solved: 0,
                profile_url: `https://www.hackerrank.com/profile/${username}`
            };
            res.json(stats);
        }

    } catch (error) {
        console.error('Error fetching HackerRank stats:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ 
                error: `User '${username}' not found on HackerRank` 
            });
        }
        res.status(500).json({ 
            error: `Failed to fetch HackerRank stats: ${error.message}` 
        });
    }
});

module.exports = router;
