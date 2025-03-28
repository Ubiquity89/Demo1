import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Copyright } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <Box
      sx={{
        bgcolor: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        py: 2,
        mt: 4,
        borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          color: darkMode ? '#f8fafc' : '#0f172a',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Copyright sx={{ fontSize: '1.2rem' }} />
          <Typography variant="body2">
            Made by Ubiquity
          </Typography>
        </Box>

        <IconButton
          href="https://www.linkedin.com/in/ubiquity-sinha-ray-09434227b/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: darkMode ? '#f8fafc' : '#0f172a',
            '&:hover': {
              color: darkMode ? '#dc2626' : '#dc2626',
            },
          }}
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          href="https://github.com/Ubiquity89"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: darkMode ? '#f8fafc' : '#0f172a',
            '&:hover': {
              color: darkMode ? '#dc2626' : '#dc2626',
            },
          }}
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
