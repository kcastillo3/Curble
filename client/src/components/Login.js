import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useHistory, Link } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';

const Login = () => {
  const history = useHistory();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = (values, { setSubmitting }) => {
    axios.post('/login', values)
      .then(response => {
        // Assuming response.data contains a 'userId' when login is successful
        console.log('Login successful:', response.data);
        // Perform any state updates or localStorage/sessionStorage handling here
        // Then redirect the user to the successful message page
        history.push('/successful-message');
      })
      .catch(error => {
        // Handle errors such as incorrect credentials
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      })
      .finally(() => {
        setSubmitting(false);
      });
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