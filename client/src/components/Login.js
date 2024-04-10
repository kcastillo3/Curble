import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from './AuthContext'; // Adjust the import path as necessary

const Login = () => {
  const history = useHistory();
  const { login } = useAuth(); // Destructure the login function from useAuth

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await login(values);
      // Since login() updates localStorage, retrieve the token from there
      const token = localStorage.getItem('access_token');
      console.log('JWT Token:', token); // Log the token to the console
      history.push('/successful-message'); // Adjust as necessary
    } catch (error) {
      console.error('Login error:', error.response?.data.message || error.message);
      alert('Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Log in!</h2>
      <p>Don't have an account? <Link to="/register">Register here!</Link></p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
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
            <button type="submit" disabled={isSubmitting} className="submit-button">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;