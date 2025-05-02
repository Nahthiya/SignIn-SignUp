import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../services/api';
import './styles.css';

//1.personal details
const StepOneSchema = Yup.object({
  name:   Yup.string().required('Name is required'),
  email:  Yup.string().email('Invalid email').required('Email is required'),
  phone:  Yup.string().optional(),
});

//2.company details
const StepTwoSchema = Yup.object({
  companyName:    Yup.string().required('Company name is required'),
  companyEmail:   Yup.string().email('Invalid email').required('Company email is required'),
  companyAddress: Yup.string().optional(),
});

//3.credentials
const StepThreeSchema = Yup.object({
  password:        Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Signup() {
  const [step, setStep]     = useState(1);
  const [formData, setData] = useState({});

  const next = (values) => {
    setData(d => ({ ...d, ...values }));
    setStep(s => s + 1);
  };

  const submitAll = async (values) => {
    const payload = { ...formData, ...values };
    try {
      await api.post('/auth/signup', payload);
      alert('Please check your email to confirm your account.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="form-container">
      {step === 1 && (
        <Formik
          initialValues={{ name:'', email:'', phone:'' }}
          validationSchema={StepOneSchema}
          onSubmit={next}
        >
          <Form>
            <label>Name</label>
            <Field name="name" placeholder="Your name" />
            <ErrorMessage name="name" component="div" className="error" />

            <label>Email</label>
            <Field name="email" placeholder="you@example.com" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Phone (optional)</label>
            <Field name="phone" placeholder="eg: +123456789" />
            <ErrorMessage name="phone" component="div" className="error" />

            <button type="submit">Next →</button>
            <p className="redirect">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </Form>
        </Formik>
      )}

      {step === 2 && (
        <Formik
          initialValues={{ companyName:'', companyEmail:'', companyAddress:'' }}
          validationSchema={StepTwoSchema}
          onSubmit={next}
        >
          <Form>
            <label>Company Name</label>
            <Field name="companyName" placeholder="Your company" />
            <ErrorMessage name="companyName" component="div" className="error" />

            <label>Company Email</label>
            <Field name="companyEmail" placeholder="company@example.com" />
            <ErrorMessage name="companyEmail" component="div" className="error" />

            <label>Company Address (optional)</label>
            <Field name="companyAddress" placeholder="Street, City" />
            <ErrorMessage name="companyAddress" component="div" className="error" />

            <button type="button" onClick={() => setStep(1)}>← Back</button>
            <button type="submit">Next →</button>
          </Form>
        </Formik>
      )}

      {step === 3 && (
        <Formik
          initialValues={{ password:'', confirmPassword:'' }}
          validationSchema={StepThreeSchema}
          onSubmit={submitAll}
        >
          <Form>
            <label>Password</label>
            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" className="error" />

            <label>Confirm Password</label>
            <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
            <ErrorMessage name="confirmPassword" component="div" className="error" />

            <button type="button" onClick={() => setStep(2)}>← Back</button>
            <button type="submit">Sign Up</button>
          </Form>
        </Formik>
      )}
    </div>
);
}
