import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const PostItemForm = ({ onItemPostSuccess }) => {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(''); // State to hold the preview URL

  const DropzoneComponent = ({ setFieldValue }) => {
    const { getRootProps, getInputProps, open } = useDropzone({
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
      },
      noClick: true,
      onDrop: acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
          setFieldValue('image', file);
          const filePreview = URL.createObjectURL(file);
          setPreviewSrc(filePreview); // Update the preview URL
        }
      },
    });

    return (
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <button type="button" onClick={open} className="upload-button">
          Upload Image
        </button>
        {previewSrc && (
          <div className="image-preview-wrapper">
            <img src={previewSrc} alt="Preview" className="image-preview" />
          </div>
        )}
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
          borough: '', // Change this to 'borough'
          address: '', // New field for address
          condition: '',
          image: null,
          time_to_be_set_on_curb: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          description: Yup.string().required('Required'),
          borough: Yup.string().required('Required'), // Dropdown for NYC Boroughs
          address: Yup.string().required('Required'), // Text input for specific address
          condition: Yup.string().required('Required'),
          image: Yup.mixed().required('An image is required'),
          time_to_be_set_on_curb: Yup.date().required('Setting a curb time is required'),
        })}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('description', values.description);
          formData.append('location', `${values.borough}, ${values.address}`);
          formData.append('condition', values.condition);
          formData.append('image', values.image);
          formData.append('time_to_be_set_on_curb', values.time_to_be_set_on_curb);
        
          axios.post('/items', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          })
            .then(response => {
              if (onItemPostSuccess) {
                onItemPostSuccess(response.data);
              }
              setSubmitSuccess(true);
              setTimeout(() => setSubmitSuccess(false), 5000);
              resetForm();  // Reset all Formik fields
              setPreviewSrc('');  // Clear image preview
              setFieldValue('image', null);  // Explicitly clear the image field
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

            {/* Dropdown for Boroughs */}
            <Field as="select" name="borough" placeholder="Borough" className="form-select">
              <option value="">Select Borough</option>
              <option value="Manhattan">Manhattan</option>
              <option value="Brooklyn">Brooklyn</option>
              <option value="Queens">Queens</option>
              <option value="Bronx">Bronx</option>
              <option value="Staten Island">Staten Island</option>
            </Field>
            <ErrorMessage name="borough" component="div" className="error-message" />

            {/* Input for Address */}
            <Field name="address" type="text" placeholder="Address" className="form-field" />
            <ErrorMessage name="address" component="div" className="error-message" />

            <Field as="select" name="condition" className="form-select">
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </Field>
            <ErrorMessage name="condition" component="div" className="error-message" />

            <Field name="time_to_be_set_on_curb" type="datetime-local" placeholder="Time to Be Set on Curb" className="form-field" />
            <ErrorMessage name="time_to_be_set_on_curb" component="div" className="error-message" />

            <DropzoneComponent setFieldValue={setFieldValue} />
            {values.image && <p className="file-name">Selected file: {values.image.name}</p>}
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