/*
 * VALIDATION STRATEGIES (FEE topic: form handling / validation strategies)
 * Each rule is a tiny pure function:  (value, allValues) => "error message" or "".
 * A field has an ARRAY of rules; the first rule that fails wins, so the user
 * sees one clear message at a time. Because the rules are plain functions they
 * are easy to reuse in any form (Login, snippet name, ...) and easy to unit test.
 */

export const required = (message = "This field is required.") => (value) =>
  String(value ?? "").trim() ? "" : message;

export const isEmail = (message = "Enter a valid email address.") => (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim()) ? "" : message;

export const minLength = (min, message) => (value) =>
  String(value ?? "").length >= min
    ? ""
    : message || `Must be at least ${min} characters.`;

export const maxLength = (max, message) => (value) =>
  String(value ?? "").length <= max
    ? ""
    : message || `Must be ${max} characters or fewer.`;

// Run one field's rules in order and return the first error ("" = valid).
export function validateField(value, rules = [], allValues = {}) {
  for (const rule of rules) {
    const message = rule(value, allValues);
    if (message) return message;
  }
  return "";
}

// Run a whole schema { fieldName: [rules] } and return { fieldName: message }
// containing ONLY the invalid fields (an empty object means the form is valid).
export function validateForm(values, schema) {
  const errors = {};
  Object.keys(schema).forEach((name) => {
    const message = validateField(values[name], schema[name], values);
    if (message) errors[name] = message;
  });
  return errors;
}
