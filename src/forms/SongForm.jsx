import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const songSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .required("Title is required"),
  duration: Yup.number()
    .min(1, "Must be at least 1 minute")
    .required("Duration is required"),
});

function SongForm({ onSubmit }) {
  return (
    <Formik
      initialValues={{ title: "", duration: "" }}
      validationSchema={songSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <label>Title</label>
          <Field name="title" />
          <ErrorMessage name="title" component="div" />

          <label>Duration (mins)</label>
          <Field name="duration" type="number" />
          <ErrorMessage name="duration" component="div" />

          <button type="submit">Add Song</button>
        </Form>
      )}
    </Formik>
  );
}

export default SongForm;
