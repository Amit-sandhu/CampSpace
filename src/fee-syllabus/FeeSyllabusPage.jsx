/*
 * BEGINNER GUIDE: FEE syllabus practice page
 * This page is an isolated learning area for topics that were not clearly present
 * in the original CampSpace UI, especially dynamic routes and small React exercises.
 * It is not linked from the normal sidebar, so the existing CampSpace experience is unchanged.
 */

import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./fee-syllabus.css";

/*
 * BEGINNER: CounterExample()
 * Main job: demonstrate the smallest useful React state example.
 * The number is stored with useState, and the button changes that state.
 * This is the syllabus counter mini-project in its simplest form.
 */
function CounterExample() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    <section className="fee-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <h2>Counter App</h2>
      <p>Count: {count}</p>
      <button type="button" onClick={increase}>
        +1
      </button>
    </section>
  );
}

/*
 * BEGINNER: TodoExample()
 * Main job: demonstrate arrays, objects, forms, controlled inputs and list rendering.
 * React state stores both the input text and the todo array.
 * Submitting the form adds a new object to the array without changing the original array.
 */
function TodoExample() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  function addTodo(event) {
    event.preventDefault();

    if (text.trim() === "") {
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: text.trim(),
    };

    setTodos([...todos, newTodo]);
    setText("");
  }

  return (
    <section className="fee-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <h2>Interactive To-Do</h2>

      <form onSubmit={addTodo}>
        {/* Form that groups related user inputs and handles submission. — FEE topics: JSX + semantic HTML + forms/events; className connects this structure to the CSS styling. */}
        <label htmlFor="fee-todo">Task</label>
        <input
          id="fee-todo"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </section>
  );
}

/*
 * BEGINNER: ProductCard()
 * Main job: demonstrate reusable components and props.
 * The parent supplies the product data, so the same component can display many products.
 * This is the product-card style React mini-project from the syllabus.
 */
function ProductCard({ product }) {
  return (
    <article className="fee-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>₹{product.price}</strong>
    </article>
  );
}

/*
 * BEGINNER: ControlledForm()
 * Main job: demonstrate a React controlled component.
 * The input value always comes from React state, and onChange updates that state.
 * onSubmit prevents a page reload and shows the submitted value.
 */
function ControlledForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function submitForm(event) {
    event.preventDefault();
    setMessage(`Hello, ${name || "student"}!`);
  }

  return (
    <section className="fee-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <h2>Controlled Form</h2>

      <form onSubmit={submitForm}>
        {/* Form that groups related user inputs and handles submission. — FEE topics: JSX + semantic HTML + forms/events; className connects this structure to the CSS styling. */}
        <label htmlFor="fee-name">Name</label>
        <input
          id="fee-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

/*
 * BEGINNER: SyllabusHome()
 * Main job: provide links to the small syllabus examples.
 * Link changes the URL without doing a full browser reload because React Router handles it.
 * The examples are intentionally isolated from the real CampSpace workspace.
 */
function SyllabusHome() {
  const product = {
    name: "CampSpace Student Pack",
    description: "A simple reusable product-card example.",
    price: 499,
  };

  return (
    <main className="fee-page">
      {/* Main semantic container for the primary page content. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <header className="fee-header">
        {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <p>CampSpace • FEE practice</p>
        <h1>Frontend Engineering Syllabus Lab</h1>
        <p>
          These examples cover the few syllabus items that were not obvious in
          the original application.
        </p>
      </header>

      <nav className="fee-nav" aria-label="Syllabus examples">
        {/* Navigation area containing links or controls for moving around the app. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <Link to="counter">Counter</Link>
        <Link to="todo">To-Do</Link>
        <Link to="product">Product Card</Link>
        <Link to="form">Controlled Form</Link>
      </nav>

      <div className="fee-grid">
        {/* Responsive grid that arranges the dashboard information cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <CounterExample />
        <TodoExample />
        <ProductCard product={product} />
        <ControlledForm />
      </div>

      <section className="fee-card">
        {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <h2>What this page demonstrates</h2>
        <ul>
          <li>React components, JSX, props and state</li>
          <li>Controlled forms and event handling</li>
          <li>Arrays, objects, map(), spread syntax and functions</li>
          <li>Responsive CSS with Flexbox, Grid and media queries</li>
          <li>Nested and dynamic React Router routes</li>
        </ul>
      </section>
    </main>
  );
}

/*
 * BEGINNER: SyllabusTopic()
 * Main job: read the dynamic topic from the URL using useParams().
 * The route /fee-syllabus/:topic sends different topic names into this component.
 * This gives the project a real, harmless example of dynamic routing and route parameters.
 */
function SyllabusTopic() {
  const { topic } = useParams();

  return (
    <section className="fee-page">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
      <div className="fee-card">
        {/* Content card that groups one related set of information. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <h1>Topic: {topic}</h1>
        <p>
          This page is rendered from the dynamic <code>:topic</code> route
          parameter.
        </p>
        <Link to="/fee-syllabus">← Back to syllabus lab</Link>
      </div>
    </section>
  );
}

/*
 * BEGINNER: FeeSyllabusPage()
 * Main job: create the parent route for the syllabus lab.
 * Outlet is where the nested /:topic page is rendered by React Router.
 * The normal CampSpace routes are not changed by this additional protected route.
 */
export default function FeeSyllabusPage() {
  return (
    <>
      <SyllabusHome />
      <Outlet />
    </>
  );
}

export { SyllabusTopic };
