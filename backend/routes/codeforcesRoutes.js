const express = require('express');
const router = express.Router();
const axios = require('axios');

// CodeForces stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Get user info
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const data = response.data;

        if (data.status !== 'OK') {
            return res.status(404).json({ 
                error: `User '${username}' not found on Codeforces. Please check the username and try again.` 
            });
        }

        const user_info = data.result[0];

        const stats = {
            username: user_info.handle,
            rating: user_info.rating || "N/A",
            max_rating: user_info.maxRating || "N/A",
            rank: user_info.rank || "N/A",
            max_rank: user_info.maxRank || "N/A",
            contribution: user_info.contribution || 0,
            friend_count: user_info.friendOfCount || 0,
            avatar: user_info.avatar || "",
            profile_url: `https://codeforces.com/profile/${username}`
        };

        res.json(stats);

    } catch (error) {
        console.error('Error fetching CodeForces stats:', error);
        res.status(500).json({ 
            error: `Failed to fetch CodeForces stats: ${error.message}. Please try again later.` 
        });
    }
});

module.exports = router;
