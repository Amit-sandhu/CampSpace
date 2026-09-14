/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/TodayTasks.jsx
 * This React file defines the TodayTasks component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import { useEffect, useRef, useState } from "react";

import {
  ClipboardListIcon,
  PlusIcon,
  MoreVerticalIcon,
  CheckIcon
} from "../common/Icons";

import "./TodayTasks.css";


const taskTypes = [
  "Academic",
  "Study",
  "Project",
  "Learning",
  "Personal"
];


// BEGINNER: TodayTasks()
// This component/function is responsible for the TodayTasks part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function TodayTasks({
  tasks,
  setTasks
}) {

  const [filter, setFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [taskName, setTaskName] =
    useState("");

  const [taskType, setTaskType] =
    useState("Academic");


  // Tracks which task's "⋮" menu is currently open (only one at a time)
  const [openMenuId, setOpenMenuId] =
    useState(null);

  // Tracks which task is currently being edited, and the draft values
  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editType, setEditType] =
    useState("Academic");


  const cardRef =
    useRef(null);

  const taskInputRef =
    useRef(null);


  /* =======================================================
     DOM MANIPULATION
     Focus the task input when the add form opens.
  ======================================================= */

  useEffect(() => {
    if (showForm && taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [showForm]);


  /* =======================================================
     CLOSE MENU WHEN CLICKING OUTSIDE THE CARD
  ======================================================= */

  useEffect(() => {

    // BEGINNER: handleClickOutside()
    // Main job: perform one focused task for this file.
    // It receives data/props, performs the required work, and returns the result or UI.
    // Keeping this job in one function makes the code easier to follow during the PPT.
    function handleClickOutside(event) {

      if (
        cardRef.current &&
        !cardRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  const completedCount =
    tasks.filter(
      (task) =>
        task.completed
    ).length;


  const pendingCount =
    tasks.length -
    completedCount;


  const filteredTasks =
    tasks.filter(
      (task) => {

        if (
          filter === "Pending"
        ) {
          return !task.completed;
        }

        if (
          filter === "Completed"
        ) {
          return task.completed;
        }

        return true;
      }
    );


  // BEGINNER: handleAddTask()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function handleAddTask(event) {

    event.preventDefault();

    if (
      taskName.trim() === ""
    ) {
      return;
    }


    const newTask = {

      id:
        Date.now(),

      title:
        taskName.trim(),

      type:
        taskType,

      completed:
        false
    };


    setTasks(
      (previousTasks) => [
        ...previousTasks,
        newTask
      ]
    );


    setTaskName("");

    setTaskType(
      "Academic"
    );

    setShowForm(false);
  }


  // BEGINNER: handleToggleTask()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function handleToggleTask(
    taskId
  ) {

    setTasks(
      (previousTasks) =>
        previousTasks.map(
          (task) => {

            if (
              task.id === taskId
            ) {

              return {
                ...task,
                completed:
                  !task.completed
              };
            }

            return task;
          }
        )
    );
  }


  // BEGINNER: handleDeleteTask()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function handleDeleteTask(
    taskId
  ) {

    setTasks(
      (previousTasks) =>
        previousTasks.filter(
          (task) =>
            task.id !== taskId
        )
    );

    setOpenMenuId(null);
  }


  /* =======================================================
     EDIT TASK
  ======================================================= */

  // BEGINNER: handleToggleMenu()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function handleToggleMenu(taskId) {

    setOpenMenuId(
      (previousId) =>
        previousId === taskId ? null : taskId
    );
  }


  function handleStartEdit(task) {

    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditType(task.type);
    setOpenMenuId(null);
  }


  // BEGINNER: handleCancelEdit()
  // Main job: perform one focused task for this file.
  // It receives data/props, performs the required work, and returns the result or UI.
  // Keeping this job in one function makes the code easier to follow during the PPT.
  function handleCancelEdit() {
    setEditingTaskId(null);
  }


  function handleSaveEdit(event, taskId) {

    event.preventDefault();

    if (editTitle.trim() === "") {
      return;
    }

    setTasks(
      (previousTasks) =>
        previousTasks.map(
          (task) =>
            task.id === taskId
              ? { ...task, title: editTitle.trim(), type: editType }
              : task
        )
    );

    setEditingTaskId(null);
  }


  return (
    <section className="tasks-card" ref={cardRef}>
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}


      <div className="tasks-header">
        {/* Task-management area where tasks can be created, filtered, edited, and completed. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <div className="tasks-title">
          {/* Task-management area where tasks can be created, filtered, edited, and completed. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

          <span className="tasks-title-icon">
            <ClipboardListIcon />
          </span>

          <h2>
            Today's Tasks
          </h2>

        </div>


        <button
          className="add-task-button"
          type="button"
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >
          <PlusIcon />
          <span>Add Task</span>
        </button>

      </div>


      {showForm && (

        <form
          className="task-form"
          onSubmit={
            handleAddTask
          }
        >

          <label className="sr-only" htmlFor="task-name-input">
            Task name
          </label>

          <input
            id="task-name-input"
            ref={taskInputRef}
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={(event) =>
              setTaskName(
                event.target.value
              )
            }
          />


          <label className="sr-only" htmlFor="task-type-select">
            Task type
          </label>

          <select
            id="task-type-select"
            value={taskType}
            onChange={(event) =>
              setTaskType(
                event.target.value
              )
            }
          >

            {taskTypes.map(
              (type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>

              )
            )}

          </select>


          <button
            type="submit"
            className="save-task"
          >
            Add
          </button>


          <button
            type="button"
            className="cancel-task"
            onClick={() =>
              setShowForm(false)
            }
          >
            Cancel
          </button>

        </form>
      )}


      <div className="task-filters">
        {/* Filter buttons that change which tasks are shown. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        <button
          className={
            filter === "All"
              ? "task-filter active"
              : "task-filter"
          }
          onClick={() =>
            setFilter("All")
          }
        >
          All ({tasks.length})
        </button>


        <button
          className={
            filter === "Pending"
              ? "task-filter active"
              : "task-filter"
          }
          onClick={() =>
            setFilter("Pending")
          }
        >
          Pending ({pendingCount})
        </button>


        <button
          className={
            filter === "Completed"
              ? "task-filter active"
              : "task-filter"
          }
          onClick={() =>
            setFilter("Completed")
          }
        >
          Completed ({completedCount})
        </button>

      </div>


      <div className="task-list">
        {/* List that renders the current tasks from react state. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}

        {filteredTasks.length === 0 ? (

          <div className="empty-tasks">
            {/* Task-management area where tasks can be created, filtered, edited, and completed. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
            No tasks in this category.
          </div>

        ) : (

          filteredTasks.map(
            (task) => {

              const isEditing =
                editingTaskId === task.id;


              if (isEditing) {

                return (

                  <form
                    className="task-row task-row-editing"
                    key={task.id}
                    onSubmit={(event) =>
                      handleSaveEdit(event, task.id)
                    }
                  >

                    <input
                      className="edit-title-input"
                      type="text"
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(event.target.value)
                      }
                      autoFocus
                    />

                    <select
                      className="edit-type-select"
                      value={editType}
                      onChange={(event) =>
                        setEditType(event.target.value)
                      }
                    >

                      {taskTypes.map(
                        (type) => (

                          <option key={type} value={type}>
                            {type}
                          </option>

                        )
                      )}

                    </select>

                    <div className="edit-actions">
                      {/* Action buttons that open related campspace applications. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

                      <button
                        type="submit"
                        className="edit-save-button"
                        aria-label="Save changes"
                      >
                        <CheckIcon />
                      </button>

                      <button
                        type="button"
                        className="edit-cancel-button"
                        onClick={handleCancelEdit}
                        aria-label="Cancel editing"
                      >
                        ×
                      </button>

                    </div>

                  </form>

                );
              }


              return (

                <div
                  className={
                    task.completed
                      ? "task-row completed"
                      : "task-row"
                  }
                  key={task.id}
                >

                  <input
                    className="task-checkbox"
                    type="checkbox"
                    checked={
                      task.completed
                    }
                    onChange={() =>
                      handleToggleTask(
                        task.id
                      )
                    }
                  />


                  <span className="task-name">
                    {task.title}
                  </span>


                  <span
                    className={
                      `task-type ${
                        task.type.toLowerCase()
                      }`
                    }
                  >
                    {task.type}
                  </span>


                  <div className="task-menu-wrapper">

                    <button
                      className="delete-task"
                      type="button"
                      onClick={() =>
                        handleToggleMenu(task.id)
                      }
                      aria-label={
                        `Options for ${task.title}`
                      }
                    >
                      <MoreVerticalIcon />
                    </button>


                    {openMenuId === task.id && (

                      <div className="task-menu">

                        <button
                          type="button"
                          onClick={() => handleStartEdit(task)}
                        >
                          ✎ Edit
                        </button>

                        <button
                          type="button"
                          className="task-menu-delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          🗑 Delete
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              );
            }
          )

        )}

      </div>

    </section>
  );
}

export default TodayTasks;
