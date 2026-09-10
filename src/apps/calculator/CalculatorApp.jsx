/*
 * BEGINNER GUIDE: src/apps/calculator/CalculatorApp.jsx
 * This React file defines the CalculatorApp component(s) and their visible UI.
 * Read the JSX below as HTML-like structure; JavaScript above/below it supplies the behaviour.
 * Syllabus topics are marked near the code that actually demonstrates them.
 */

// BEGINNER: CalculatorApp()
// This component/function is responsible for the CalculatorApp part of this feature.
// It keeps that task in one place so the surrounding JSX and state logic are easier to understand.
// FEE topics: JavaScript functions, React components/JSX, and the feature-specific concepts used below.
export default function CalculatorApp() {
  return (

      <section className="mainpage-window mainpage-window--calculator mainpage-window--hidden" data-mainpage-window="" data-app="calculator" style={{'--mainpage-x': "600px", '--mainpage-y': "430px", '--mainpage-w': "280px"}}>
        {/* Semantic section that groups related content into one feature area. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
        <header className="mainpage-window-bar" data-mainpage-drag-handle="">
          {/* Semantic header that identifies the top part of this ui section. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
          <div className="mainpage-traffic-lights">
            {/* Window control buttons for close, minimize, and maximize. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
            <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
            <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
          </div>
          <h2 className="mainpage-window-title">
            Calculator
          </h2>
        </header>
        <div className="mainpage-window-body mainpage-calculator-body">
          <div className="mainpage-calc-display">
            <div className="mainpage-calc-expression" id="mainpage-calc-expr"></div>
            <div className="mainpage-calc-result" id="mainpage-calc-result">
              0
            </div>
          </div>
          <div className="mainpage-calc-grid">
            {/* Responsive grid that arranges the dashboard information cards. — FEE topics: JSX + semantic HTML; className connects this structure to the CSS styling. */}
            <button className="mainpage-calc-btn mainpage-calc-btn--fn" data-calc-action="clear">
              C
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--fn" data-calc-action="backspace">
              ⌫
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--fn" data-calc-action="percent">
              %
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--op" data-calc-op="\u00f7">
              ÷
            </button>
            <button className="mainpage-calc-btn" data-calc-num="7">
              7
            </button>
            <button className="mainpage-calc-btn" data-calc-num="8">
              8
            </button>
            <button className="mainpage-calc-btn" data-calc-num="9">
              9
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--op" data-calc-op="\u00d7">
              ×
            </button>
            <button className="mainpage-calc-btn" data-calc-num="4">
              4
            </button>
            <button className="mainpage-calc-btn" data-calc-num="5">
              5
            </button>
            <button className="mainpage-calc-btn" data-calc-num="6">
              6
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--op" data-calc-op="\u2212">
              −
            </button>
            <button className="mainpage-calc-btn" data-calc-num="1">
              1
            </button>
            <button className="mainpage-calc-btn" data-calc-num="2">
              2
            </button>
            <button className="mainpage-calc-btn" data-calc-num="3">
              3
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--op" data-calc-op="+">
              +
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--wide" data-calc-num="0">
              0
            </button>
            <button className="mainpage-calc-btn" data-calc-action="decimal">
              .
            </button>
            <button className="mainpage-calc-btn mainpage-calc-btn--equals" data-calc-action="equals">
              =
            </button>
          </div>
        </div>
      </section>
  );
}
