const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// GFG stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Fetch user profile page
        const response = await axios.get(`https://www.geeksforgeeks.org/user/${username}`);
        const html = response.data;
        const $ = cheerio.load(html);

        // Find the problem statistics element
        const problemStats = $('.problemNavbar_head__cKSRi');
        
        if (!problemStats.length) {
            throw new Error('No problem statistics found');
        }

        // Extract difficulty stats
        const difficultyStats = {
            SCHOOL: 0,
            BASIC: 0,
            EASY: 0,
            MEDIUM: 0,
            HARD: 0
        };

        // Extract numbers from the text
        const rawText = problemStats.text();
        const numbers = [];
        let currentNumber = '';
        
        for (let char of rawText) {
            if (char >= '0' && char <= '9') {
                currentNumber += char;
            } else if (currentNumber) {
                numbers.push(parseInt(currentNumber));
                currentNumber = '';
            }
        }
        if (currentNumber) {
            numbers.push(parseInt(currentNumber));
        }

        // Assign numbers to difficulty levels
        // The numbers array should contain: School, Basic, Easy, Medium, Hard
        if (numbers.length >= 5) {
            difficultyStats.SCHOOL = numbers[0];
            difficultyStats.BASIC = numbers[1];
            difficultyStats.EASY = numbers[2];
            difficultyStats.MEDIUM = numbers[3];
            difficultyStats.HARD = numbers[4];
        }

        // Calculate total solved
        const totalSolved = Object.values(difficultyStats).reduce((sum, count) => sum + count, 0);

        const stats = {
            total_solved: totalSolved,
            school_solved: difficultyStats.SCHOOL,
            basic_solved: difficultyStats.BASIC,
            easy_solved: difficultyStats.EASY,
            medium_solved: difficultyStats.MEDIUM,
            hard_solved: difficultyStats.HARD,
            profile_url: `https://www.geeksforgeeks.org/user/${username}`
        };

        res.json(stats);

    } catch (error) {
        console.error('Error fetching GFG stats:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'User not found on GFG' });
        }
        res.status(500).json({ error: 'Failed to fetch GFG stats' });
    }
});

module.exports = router;
