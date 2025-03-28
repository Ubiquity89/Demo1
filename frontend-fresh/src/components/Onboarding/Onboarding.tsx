import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Paper, CircularProgress, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Footer from '../Footer/Footer';

interface FormData {
  name: string;
  leetcode: string;
  gfg: string;
  hackerrank: string;
  codeforces: string;
  codechef: string;
}

function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    leetcode: '',
    gfg: '',
    hackerrank: '',
    codeforces: '',
    codechef: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDarkModeToggle = () => {
    setDarkMode(prev => !prev);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leetcode) {
      setError('Please fill in your name and LeetCode username');
      return;
    }
    
    // Save the form data to localStorage
    localStorage.setItem('codingProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  const getTextColor = () => {
    return darkMode ? '#f8fafc' : '#000000';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? '#000000' : '#ffffff', pt: 12 }}>
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          bgcolor: darkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: darkMode ? "#f8fafc" : "#0f172a",
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={handleLogoClick}
            >
              Code<span style={{ color: "#dc2626", fontWeight: 800 }}>Tracker</span>
            </Typography>
            <IconButton
              onClick={handleDarkModeToggle}
              sx={{ color: darkMode ? "#f8fafc" : "#0f172a" }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: '#ffffff' }}>
              Connect Your Coding Profiles
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="LeetCode Username"
                    name="leetcode"
                    value={formData.leetcode}
                    onChange={handleChange}
                    required
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="GeeksforGeeks Username"
                    name="gfg"
                    value={formData.gfg}
                    onChange={handleChange}
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="HackerRank Username"
                    name="hackerrank"
                    value={formData.hackerrank}
                    onChange={handleChange}
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Codeforces Username"
                    name="codeforces"
                    value={formData.codeforces}
                    onChange={handleChange}
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CodeChef Username"
                    name="codechef"
                    value={formData.codechef}
                    onChange={handleChange}
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      bgcolor: '#4338ca',
                      '&:hover': { bgcolor: '#3730a3' },
                    }}
                  >
                    {loading ? 'Connecting...' : 'Connect Profiles'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </motion.div>
        </Paper>
      </Container>

      <Footer darkMode={darkMode} />
    </Box>
  );
}

export default Onboarding;
