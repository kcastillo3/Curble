import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Make sure this import is correct

const Register = () => {
  const history = useHistory();
  const { login } = useAuth(); // Destructure login function from useAuth

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const initialValues = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      // Adjust the endpoint as necessary to match my API
      const response = await axios.post('/register', values);
      // Ensure my API response matches this structure or adjust accordingly
      if (response.data.access_token) {
        // Login the user with the credentials
        await login({ email: values.email, password: values.password });
        // Navigate to the success message page
        history.push('/successful-message');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data.message || error.message);
      alert('Failed to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <p>Already have an account? <Link to="/login">Log in here!</Link></p>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="input-group">
              <label htmlFor="name">Name:</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button type="submit" disabled={isSubmitting} className="register-button">
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
