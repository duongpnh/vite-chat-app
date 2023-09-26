import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket'

function App() {
  const refMsg = useRef<HTMLInputElement>(null);
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
  

  // establish websocket connection
  const { readyState, sendMessage, lastMessage } = useWebSocket('ws://localhost:3000/ws', {
    onOpen: () => {
      console.log('Established connection')
    }
  })


  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const onClickSendMessage = () => {
    const isOpeningConnection = readyState === ReadyState.OPEN;

    if (isOpeningConnection && refMsg.current) {
      sendMessage(refMsg.current.value);
      refMsg.current.value = '';
    }
  };

  console.log('messageHistory', messageHistory)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <ul>
          {messageHistory.map((msg: MessageEvent, idx: number) => <li key={`${(msg.data || '').slice(0,3)}${idx}`}><span>{msg.data}</span></li>)}
        </ul>
        <input type="text" placeholder="Message..." name="message" ref={refMsg} required/>
        <button onClick={onClickSendMessage}>
          Send Message
        </button>
      </div>
    </>
  )
}

export default App
