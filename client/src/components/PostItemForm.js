import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const PostItemForm = ({ onItemPostSuccess }) => {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dropzone setup with explicit button trigger
  const DropzoneComponent = ({ setFieldValue }) => {
    const { getRootProps, getInputProps, open } = useDropzone({
      // Specifying acceptable MIME types directly
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
      },
      noClick: true, // Preventing file dialog opening on click
      onDrop: acceptedFiles => {
        // Handle file(s) dropped
        const file = acceptedFiles[0]; // Assuming single file upload
        if (file) {
          setFieldValue("image", file); // Set the file as the value for the 'image' field
        }
      }
    });

    return (
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <button type="button" onClick={open} className="upload-button">
          Upload Image
        </button>
      </div>
    );
  };

  return (
    <div className="post-item-form-container">
      <h2>Post Your Item</h2>
      <p>Fill out the form below to post an item. Remember to upload an image for your item!</p>
      <Formik
        initialValues={{
          name: '',
          description: '',
          location: '',
          condition: '',
          image: null,
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
          location: Yup.string().required('Required'),
          condition: Yup.string().required('Required'),
          image: Yup.mixed().required('An image is required'),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          for (const key in values) {
            formData.append(key, values[key]);
          }

          axios.post('/items', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            if (onItemPostSuccess) {
              onItemPostSuccess(response.data);
            }
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 5000);
            resetForm();
          })
          .catch(error => {
            setSubmitError(error.response ? error.response.data.message : 'Error posting item');
          })
          .finally(() => {
            setSubmitting(false);
          });
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <Field name="name" type="text" placeholder="Item Name" className="form-field" />
            <ErrorMessage name="name" component="div" className="error-message" />

            <Field as="textarea" name="description" placeholder="Description" className="form-textarea" />
            <ErrorMessage name="description" component="div" className="error-message" />

            <Field name="location" type="text" placeholder="Location" className="form-field" />
            <ErrorMessage name="location" component="div" className="error-message" />

            <Field as="select" name="condition" className="form-select">
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </Field>
            <ErrorMessage name="condition" component="div" className="error-message" />

            <DropzoneComponent setFieldValue={setFieldValue} />
            {values.image && (
              <p className="file-name">Selected file: {values.image.name}</p>
            )}
            <ErrorMessage name="image" component="div" className="error-message" />

            <button type="submit" disabled={isSubmitting} className="form-button">Submit</button>
            {submitError && <div className="error-message">{submitError}</div>}
          </Form>
        )}
      </Formik>
      {submitSuccess && <div className="success-message">Item posted successfully!</div>}
    </div>
  );
};

export default PostItemForm;