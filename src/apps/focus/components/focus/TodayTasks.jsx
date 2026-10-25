/*
 * CHANGED in this file (what + why):
 *  - Add / edit now uses ONE modal form (was: separate inline add form + inline edit row)
 *  - FORM HANDLING: controlled inputs (form state) + onSubmit with preventDefault
 *  - VALIDATION: required, 3-100 characters, no duplicate titles -> errors shown per field
 *  - REUSABLE INPUT: <TaskFormField> wraps label + input + error message
 *  - GLOBAL STATE: search / filter / sort / toast live in the Redux Toolkit store (focusUiStore)
 *  - CONTEXT: tasks + setTasks come from FocusDashboardContext instead of props
 *  - Search is debounced (waits 250 ms after typing stops) before filtering
 */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ClipboardListIcon,
  PlusIcon,
  MoreVerticalIcon,
  CheckIcon
} from "../common/Icons";
import TaskFormField from "./TaskFormField";
import FocusDashboardContext from "./FocusDashboardContext";
import {
  clearToast as clearToastAction,
  setCategoryFilter as setCategoryFilterAction,
  setSearchTerm as setSearchTermAction,
  setSortBy as setSortByAction,
  setStatusFilter as setStatusFilterAction,
  showToast as showToastAction
} from "./focusUiStore";

import "./TodayTasks.css";

const taskTypes = ["Academic", "Study", "Project", "Learning", "Personal"];

function getTaskTime(task) {
  if (task.createdAt) {
    const parsed = new Date(task.createdAt).getTime();
    if (Number.isFinite(parsed)) return parsed;
  }

  const numericId = Number(task.id);
  return Number.isFinite(numericId) ? numericId : 0;
}

function TodayTasks() {
  const { tasks, setTasks } = useContext(FocusDashboardContext);
  const dispatch = useDispatch();
  const { searchTerm, statusFilter, categoryFilter, sortBy, toastMessage } =
    useSelector((state) => state.focusUi);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({ title: "", type: "Academic" });
  const [formErrors, setFormErrors] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const cardRef = useRef(null);
  const titleInputRef = useRef(null);
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Debounce the search input so filtering waits until typing pauses.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  // Keep the modal keyboard-friendly and focus the title field when it opens.
  useEffect(() => {
    if (showModal) titleInputRef.current?.focus();
  }, [showModal]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => dispatch(clearToastAction()), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage, dispatch]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowModal(false);
        setOpenMenuId(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const title = String(task.title || "").toLowerCase();
      const matchesSearch = title.includes(debouncedSearch);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && !task.completed) ||
        (statusFilter === "Completed" && task.completed);
      const matchesCategory =
        categoryFilter === "All" || task.type === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === "title-asc") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      if (sortBy === "title-desc") {
        return String(b.title || "").localeCompare(String(a.title || ""));
      }
      if (sortBy === "oldest") return getTaskTime(a) - getTaskTime(b);
      return getTaskTime(b) - getTaskTime(a);
    });

    return result;
  }, [tasks, debouncedSearch, statusFilter, categoryFilter, sortBy]);

  function openAddModal() {
    setEditingTaskId(null);
    setForm({ title: "", type: "Academic" });
    setFormErrors({});
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingTaskId(task.id);
    setForm({ title: task.title || "", type: task.type || "Academic" });
    setFormErrors({});
    setOpenMenuId(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingTaskId(null);
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    const cleanTitle = form.title.trim();

    if (!cleanTitle) {
      errors.title = "Task title is required.";
    } else if (cleanTitle.length < 3) {
      errors.title = "Enter at least 3 characters.";
    } else if (cleanTitle.length > 100) {
      errors.title = "Use 100 characters or fewer.";
    }

    const duplicate = tasks.some(
      (task) =>
        task.id !== editingTaskId &&
        String(task.title || "").trim().toLowerCase() === cleanTitle.toLowerCase()
    );

    if (cleanTitle && duplicate) {
      errors.title = "A task with this title already exists.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const cleanTitle = form.title.trim();

    if (editingTaskId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: cleanTitle, type: form.type }
            : task
        )
      );
      dispatch(showToastAction("Task updated successfully."));
    } else {
      const newTask = {
        id: Date.now(),
        title: cleanTitle,
        type: form.type,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks((previousTasks) => [...previousTasks, newTask]);
      dispatch(showToastAction("Task added successfully."));
      dispatch(setSearchTermAction(""));
      dispatch(setStatusFilterAction("All"));
      dispatch(setCategoryFilterAction("All"));
      dispatch(setSortByAction("newest"));
    }

    closeModal();
  }

  function handleToggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find((item) => item.id === taskId);
    dispatch(showToastAction(task?.completed ? "Task marked as pending." : "Task completed."));
  }

  function handleDeleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    setTasks((previousTasks) => previousTasks.filter((item) => item.id !== taskId));
    setOpenMenuId(null);
    dispatch(showToastAction(`Deleted “${task?.title || "task"}”.`));
  }

  function handleModalBackdrop(event) {
    if (event.target === event.currentTarget) closeModal();
  }

  return (
    <section className="tasks-card" ref={cardRef}>
      <div className="tasks-header">
        <div className="tasks-title">
          <span className="tasks-title-icon"><ClipboardListIcon /></span>
          <h2>Today's Tasks</h2>
        </div>

        <button className="add-task-button" type="button" onClick={openAddModal}>
          <PlusIcon />
          <span>Add Task</span>
        </button>
      </div>

      <div className="task-toolbar">
        <label className="task-search">
          <span className="sr-only">Search tasks</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => dispatch(setSearchTermAction(event.target.value))}
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />
        </label>

        <label className="task-control">
          <span className="sr-only">Filter by category</span>
          <select
            value={categoryFilter}
            onChange={(event) => dispatch(setCategoryFilterAction(event.target.value))}
            aria-label="Filter tasks by category"
          >
            <option value="All">All categories</option>
            {taskTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label className="task-control task-sort">
          <span className="sr-only">Sort tasks</span>
          <select
            value={sortBy}
            onChange={(event) => dispatch(setSortByAction(event.target.value))}
            aria-label="Sort tasks"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
          </select>
        </label>
      </div>

      <div className="task-filters" role="tablist" aria-label="Task status filters">
        <button type="button" role="tab" aria-selected={statusFilter === "All"}
          className={statusFilter === "All" ? "task-filter active" : "task-filter"}
          onClick={() => dispatch(setStatusFilterAction("All"))}>All ({tasks.length})</button>
        <button type="button" role="tab" aria-selected={statusFilter === "Pending"}
          className={statusFilter === "Pending" ? "task-filter active" : "task-filter"}
          onClick={() => dispatch(setStatusFilterAction("Pending"))}>Pending ({pendingCount})</button>
        <button type="button" role="tab" aria-selected={statusFilter === "Completed"}
          className={statusFilter === "Completed" ? "task-filter active" : "task-filter"}
          onClick={() => dispatch(setStatusFilterAction("Completed"))}>Completed ({completedCount})</button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-tasks">
            {tasks.length === 0
              ? "No tasks yet. Add your first task."
              : "No tasks match your search or filters."}
          </div>
        ) : filteredTasks.map((task) => (
          <div className={task.completed ? "task-row completed" : "task-row"} key={task.id}>
            <input
              className="task-checkbox"
              type="checkbox"
              checked={Boolean(task.completed)}
              onChange={() => handleToggleTask(task.id)}
              aria-label={`${task.completed ? "Mark pending" : "Complete"}: ${task.title}`}
            />

            <span className="task-name" title={task.title}>{task.title}</span>

            <span className={`task-type ${String(task.type || "Study").toLowerCase()}`}>
              {task.type || "Study"}
            </span>

            <div className="task-menu-wrapper">
              <button className="delete-task" type="button"
                onClick={() => setOpenMenuId((previous) => previous === task.id ? null : task.id)}
                aria-label={`Options for ${task.title}`} aria-expanded={openMenuId === task.id}>
                <MoreVerticalIcon />
              </button>

              {openMenuId === task.id && (
                <div className="task-menu">
                  <button type="button" onClick={() => openEditModal(task)}>✎ Edit</button>
                  <button type="button" className="task-menu-delete"
                    onClick={() => handleDeleteTask(task.id)}>🗑 Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {toastMessage && (
        <div className="task-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => dispatch(clearToastAction())} aria-label="Dismiss notification">×</button>
        </div>
      )}

      {showModal && (
        <div className="task-modal-backdrop" onMouseDown={handleModalBackdrop}>
          <section className="task-modal" role="dialog" aria-modal="true"
            aria-labelledby="task-modal-title">
            <div className="task-modal-heading">
              <div>
                <p className="task-modal-eyebrow">FOCUS DASHBOARD</p>
                <h3 id="task-modal-title">{editingTaskId !== null ? "Edit task" : "Add a task"}</h3>
              </div>
              <button type="button" className="task-modal-close" onClick={closeModal}
                aria-label="Close task form">×</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <TaskFormField id="task-title" label="Task title" error={formErrors.title}>
                <input
                  id="task-title"
                  ref={titleInputRef}
                  type="text"
                  maxLength={100}
                  value={form.title}
                  onChange={(event) => {
                    setForm((previous) => ({ ...previous, title: event.target.value }));
                    if (formErrors.title) setFormErrors((previous) => ({ ...previous, title: "" }));
                  }}
                  placeholder="e.g. Revise Java collections"
                  aria-invalid={Boolean(formErrors.title)}
                  aria-describedby={formErrors.title ? "task-title-error" : undefined}
                />
              </TaskFormField>

              <TaskFormField id="task-type" label="Category">
                <select id="task-type" value={form.type}
                  onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value }))}>
                  {taskTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </TaskFormField>

              <p className="task-form-hint">Use 3–100 characters. Duplicate task titles are not allowed.</p>

              <div className="task-modal-actions">
                <button type="button" className="task-modal-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="task-modal-save">
                  <CheckIcon /> {editingTaskId !== null ? "Save changes" : "Add task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}

export default TodayTasks;