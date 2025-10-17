"use client";

import React from "react";
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material";

export default function FacultyHome() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      {/* Header Section */}
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Faculty Dashboard
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
        Welcome, Faculty! Manage your courses, review student progress, and post new opportunities here.
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button variant="contained" color="primary">
          View Courses
        </Button>
        <Button variant="outlined" color="primary">
          Add Opportunity
        </Button>
        <Button variant="contained" color="secondary">
          Manage Students
        </Button>
      </Box>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Student Submissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and evaluate the latest project submissions from your students.
              </Typography>
              <Button variant="text" color="primary" sx={{ mt: 1 }}>
                View Submissions →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep track of project review dates and opportunity deadlines.
              </Typography>
              <Button variant="text" color="primary" sx={{ mt: 1 }}>
                View Calendar →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Faculty Announcements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Post important notices or updates for students and staff.
              </Typography>
              <Button variant="text" color="primary" sx={{ mt: 1 }}>
                Create Announcement →
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile & Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update your details, manage preferences, and change your password.
              </Typography>
              <Button variant="text" color="primary" sx={{ mt: 1 }}>
                Go to Profile →
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
