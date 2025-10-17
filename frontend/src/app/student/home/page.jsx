"use client";
import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Your Home Page
      </Typography>
      <Typography variant="body1" align="center">
        This is the user home page. You can access your dashboard, view opportunities, and manage your profile from here.
      </Typography>
    </Container>
  );
}
