import ChalkpadApp from './ChalkpadContent.jsx';

export default function ChalkpadWindow() {
  return (
    <section className="mainpage-window mainpage-window--chalkpad mainpage-window--hidden" data-mainpage-window="" data-app="chalkpad" style={{'--mainpage-x': "300px", '--mainpage-y': "90px", '--mainpage-w': "720px"}}>
      <header className="mainpage-window-bar" data-mainpage-drag-handle="">
        <div className="mainpage-traffic-lights">
          <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
          <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
          <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
        </div>
        <h2 className="mainpage-window-title">Chalkpad</h2>
      </header>
      <div className="mainpage-window-body mainpage-chalkpad-body">
        <ChalkpadApp />
      </div>
    </section>
  );
}