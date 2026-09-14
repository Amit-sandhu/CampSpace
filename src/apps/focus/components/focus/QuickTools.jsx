/*
 * BEGINNER GUIDE: src/apps/focus/components/focus/QuickTools.jsx
 * This React file defines the QuickTools component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

import {
  useNavigate
} from "react-router-dom";

import {
  LayoutGridIcon,
  FileTextIcon,
  CalendarIcon,
  CodeIcon,
  ArrowRightIcon
} from "../common/Icons";

import "./QuickTools.css";


// BEGINNER: QuickTools()
// This component/function is responsible for the QuickTools part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
function QuickTools() {

  const navigate =
    useNavigate();


  function openWorkspace(tool) {

    navigate(
      `/workspace/${tool}`
    );
  }


  return (
    <section className="quick-tools-card">
      {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}


      {/* HEADER */}

      <div className="quick-tools-header">
        {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

        <div className="quick-tools-header-icon">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <LayoutGridIcon />
        </div>

        <div>

          <h2>
            Quick Tools
          </h2>

          <p>
            Useful workspace shortcuts
          </p>

        </div>

      </div>


      {/* NOTES */}

      <button
        type="button"
        className="quick-tool"
        onClick={() =>
          openWorkspace(
            "notes"
          )
        }
      >

        <div className="quick-tool-icon notes">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <FileTextIcon />
        </div>

        <div className="quick-tool-content">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <strong>
            Notes
          </strong>

          <span>
            Quick notes & ideas
          </span>

        </div>

        <span className="quick-tool-arrow">
          <ArrowRightIcon />
        </span>

      </button>


      {/* CALENDAR */}

      <button
        type="button"
        className="quick-tool"
        onClick={() =>
          openWorkspace(
            "calendar"
          )
        }
      >

        <div className="quick-tool-icon calendar">
          {/* Calendar or date-selection interface. — FEE topics: JSX + semantic HTML + event handling; className connects this structure to the CSS styling. */}
          <CalendarIcon />
        </div>

        <div className="quick-tool-content">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <strong>
            Calendar
          </strong>

          <span>
            View your schedule
          </span>

        </div>

        <span className="quick-tool-arrow">
          <ArrowRightIcon />
        </span>

      </button>


      {/* CODE */}

      <button
        type="button"
        className="quick-tool"
        onClick={() =>
          openWorkspace(
            "code"
          )
        }
      >

        <div className="quick-tool-icon code">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <CodeIcon />
        </div>

        <div className="quick-tool-content">
          {/* Quick tools area for frequently used focus actions. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}

          <strong>
            Code Editor
          </strong>

          <span>
            Write. Build. Learn.
          </span>

        </div>

        <span className="quick-tool-arrow">
          <ArrowRightIcon />
        </span>

      </button>

    </section>
  );
}

export default QuickTools;
