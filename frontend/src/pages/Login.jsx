import React from 'react';
import { Formik, Form, Field } from 'formik';
import api from '../services/api';
import './styles.css';

export default function Login() {
  const handleLogin = async (values) => {
    try {
      await api.post('/auth/login', values);
      window.location = '/dashboard';
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="form-container">
      <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin}>
        <Form>
          <Field name="email" placeholder="Email" />
          <Field name="password" type="password" placeholder="Password" />
          <button type="submit">Log In</button>
        </Form>
      </Formik>

      <p>—or—</p>
      <a href="http://localhost:5000/api/auth/google">
        <button>Sign in with Google</button>
      </a>
    </div>
  );
}
