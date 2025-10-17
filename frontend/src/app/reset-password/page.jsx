'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api/api';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regNoQuery = searchParams.get('regNo');

  const [regNo, setRegNo] = useState(regNoQuery || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (regNoQuery) {
      toast.info('This is your first login. Please reset your password.');
    }
  }, [regNoQuery]);

  const handleRequestOtp = async () => {
    if (!regNo) {
      toast.error('Please enter your registration number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { regNo });
      toast.success('OTP sent to your college email!');
      router.push(`/reset-password/verify-otp?regNo=${regNo}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Password
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Registration Number"
            fullWidth
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            margin="normal"
            disabled={!!regNoQuery} // disable if coming from first login
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleRequestOtp}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}