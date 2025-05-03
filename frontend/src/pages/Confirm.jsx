import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Confirm() {
  const { search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(search);
    api.get(`/auth/confirm?token=${params.get('token')}`)
      .then(() => {
        alert('Email confirmed! You can now log in.');
        navigate('/login', { replace: true });
      })
      .catch(() => alert('This is an invalid token now, check if you have received your confirmation mail.'));
  }, [search, navigate]);

  return <p>Confirming your email…</p>;
}
