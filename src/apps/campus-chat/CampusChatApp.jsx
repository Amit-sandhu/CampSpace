import { useState, useEffect } from 'react';

export default function CampusChatApp() {
  var [messages, setMessages] = useState(function() {
    var saved = localStorage.getItem('campus_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: 1, text: 'Public board for notes & info - synced across tabs.', time: 'Just now' }
    ];
  });

  var [inputText, setInputText] = useState('');

  useEffect(function() {
    function handleStorage(e) {
      if (e.key === 'campus_chat_messages' && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {}
      }
    }
    window.addEventListener('storage', handleStorage);
    return function() {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function sendMessage(e) {
    e.preventDefault();
    if (inputText.trim() === '') {
      return;
    }

    var newMsg = {
      id: Date.now(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    var nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    localStorage.setItem('campus_chat_messages', JSON.stringify(nextMessages));
    setInputText('');
  }

  return (
    <section className="mainpage-window mainpage-window--chat mainpage-window--hidden" data-mainpage-window="" data-app="chat" style={{'--mainpage-x': "1010px", '--mainpage-y': "460px", '--mainpage-w': "360px"}}>
      <header className="mainpage-window-bar" data-mainpage-drag-handle="">
        <div className="mainpage-traffic-lights">
          <button className="mainpage-tl mainpage-tl--red" data-mainpage-action="close" aria-label="Close"></button>
          <button className="mainpage-tl mainpage-tl--yellow" data-mainpage-action="minimize" aria-label="Minimize"></button>
          <button className="mainpage-tl mainpage-tl--green" data-mainpage-action="maximize" aria-label="Maximize"></button>
        </div>
        <h2 className="mainpage-window-title">
          Campus Chat
        </h2>
      </header>
      <div className="mainpage-window-body mainpage-chat-body">
        <p className="mainpage-chat-hint">
          Public board for notes & info — synced across tabs open on this device.
        </p>
        
        <div className="mainpage-chat-messages" id="mainpage-chat-messages">
          {messages.map(function(msg) {
            return (
              <div className="mainpage-chat-bubble" key={msg.id}>
                <p>{msg.text}</p>
                <small>{msg.time}</small>
              </div>
            );
          })}
        </div>

        <form className="mainpage-chat-input-row" onSubmit={sendMessage}>
          <input 
            type="text" 
            id="mainpage-chat-input" 
            placeholder="Share a note..." 
            autoComplete="off" 
            maxLength="500" 
            value={inputText}
            onChange={function(e) { setInputText(e.target.value); }}
          />
          <button id="mainpage-chat-send" type="submit" aria-label="Send">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}