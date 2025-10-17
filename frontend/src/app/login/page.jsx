'use client';
import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import api from '../api/api';

export default function Login() {
  const [formData, setFormData] = useState({ regNo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (!formData.regNo) {
      toast.error('Please enter your registration number');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password should be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      toast.success('Login successful!');
      localStorage.setItem('token', res.data.token);
      

      // Redirect based on role
      console.log('Login response data:', res.data);
      const { role, isFirstLogin } = res.data;
      if (isFirstLogin) {
        toast.info('Please reset your password.');
        router.push('/reset-password');
      } else if (role === 'faculty') {
        router.push('/faculty/home');
      } else {
        router.push('/student/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login to Your Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Registration Number"
            name="regNo"
            fullWidth
            margin="normal"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            slotProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Forgot your password?{' '}
          <MuiLink component={Link} href="/auth/forgot-password">
            Reset here
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}