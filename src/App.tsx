import { useEffect, useRef, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket'

const WEBSOCKET_URL = 'ws://localhost:3003/chat';

type Message = {
  message: string;
  type: 'received' | 'sent';
}

function App() {
  const refMsg = useRef<HTMLInputElement>(null);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  

  // establish websocket connection
  const { readyState, sendMessage, lastMessage } = useWebSocket(WEBSOCKET_URL, {
    onOpen: () => console.log('Established connection'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => true,
  })


  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat({
        type: 'received',
        message: lastMessage.data,
      }));
    }
  }, [lastMessage, setMessageHistory]);

  const onClickSendMessage = () => {
    const isOpeningConnection = readyState === ReadyState.OPEN;

    if (isOpeningConnection && refMsg.current) {
      const message = refMsg.current.value;
      sendMessage(message);
      setMessageHistory((prev) => prev.concat({
        type: 'sent',
        message,
      }))
      refMsg.current.value = '';
    }
  };

  return (
    <div className="card h-screen flex p-8">
      <div className="h-full overflow-y-auto">
        {messageHistory.map((msg: Message, idx: number) => {
          const isSent = msg.type === 'sent';

          return (
            <div  key={`${(msg.message || '').slice(0,3)}${idx}`} className={`chat chat-${isSent ? 'end' : 'start'}`}>
              <div className={`chat-bubble max-w-[250px] break-all chat-bubble-${isSent ? 'info' : 'primary'}`} style={isSent ? { marginRight: '0.75rem', gridColumnStart: 3 } : {}}>{msg.message}</div>
            </div>
          )
        })}
      </div>
      <div className="flex space-x-4 h-30px">
        <input className="input input-bordered input-primary w-full" type="text" placeholder="Message..." name="message" ref={refMsg} required/>
        <button className="btn btn-primary" onClick={onClickSendMessage}>
          Send Message
        </button>
      </div>
    </div>
  )
}

export default App
