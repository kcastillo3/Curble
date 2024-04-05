import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const history = useHistory();

  // Validation Schema for Register Form
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  return (
    <div className="register-container">
      <h1>Register</h1>
      <Formik
        initialValues={{ name: '', username: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          axios.post('/register', values)
            .then(response => {
              console.log('Registration successful:', response.data);
              // Redirect to SuccessfulMessage component after successful registration
              history.push('/successful-message');
            })
            .catch(error => {
              console.error('Error during registration:', error);
              alert('Failed to register. Please try again.');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <div className="input-group">
              <label htmlFor="name">Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button type="submit" disabled={isSubmitting} className="register-button">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;