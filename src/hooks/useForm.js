/*
 * FORM HANDLING (FEE topic: form handling in React / controlled components)
 * A custom hook that owns the three things every form needs:
 *   values  - what the user typed (controlled inputs: value + onChange)
 *   errors  - validation messages produced by src/lib/validators.js
 *   touched - which fields the user has already visited
 *
 * Validation strategy ("validate on blur, then live"):
 *   1. While the user is still typing a field for the first time, stay quiet.
 *   2. When they leave the field (onBlur) the field is validated.
 *   3. After that, every keystroke re-validates it so the error clears instantly.
 *   4. On submit, every field is validated; the first invalid one gets focus.
 */
import { useCallback, useState } from "react";
import { validateField, validateForm } from "../lib/validators.js";

export function useForm({ initialValues, schema, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const nextValues = { ...values, [name]: value };
      setValues(nextValues);

      if (touched[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(value, schema[name], nextValues)
        }));
      }
    },
    [values, touched, schema]
  );

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(values[name], schema[name], values)
      }));
    },
    [values, schema]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      const nextErrors = validateForm(values, schema);
      setErrors(nextErrors);
      setTouched(
        Object.keys(schema).reduce((all, name) => ({ ...all, [name]: true }), {})
      );

      const firstInvalid = Object.keys(schema).find((name) => nextErrors[name]);
      if (firstInvalid) {
        event.target.elements?.[firstInvalid]?.focus();
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, schema, onSubmit, isSubmitting]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset };
}
