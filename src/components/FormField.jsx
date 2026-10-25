/*
 * REUSABLE INPUT COMPONENT (FEE topic: reusable input components / composition)
 * One wrapper = label + the control (passed as children) + the error message.
 * Any form in CampSpace can reuse it instead of repeating this markup, and the
 * error is announced to screen readers through role="alert".
 *
 *   <FormField id="login-email" label="Email" error={errors.email}>
 *     <input id="login-email" name="email" ... />
 *   </FormField>
 */
import "./form-field.css";

export default function FormField({ id, label, error, children }) {
  return (
    <div className={`form-field ${error ? "form-field--invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="form-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
