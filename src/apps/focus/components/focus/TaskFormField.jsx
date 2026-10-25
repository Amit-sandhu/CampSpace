/*
 * REUSABLE INPUT COMPONENT (FEE topic: reusable input components)
 * One wrapper = label + the input (passed as children) + the error message.
 * Any form in the app can reuse it instead of repeating this markup.
 */
function TaskFormField({ id, label, error, children }) {
  return (
    <div className="task-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="task-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default TaskFormField;