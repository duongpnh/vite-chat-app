/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Gif } from '@giphy/react-components'

const WEBSOCKET_URL = 'ws://localhost:3003/chat';

type Message = {
  message: {
    content: any;
    username: string;
  };
  type: 'received' | 'sent';
}

function App() {
  const refMsg = useRef<HTMLInputElement>(null);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  

  // establish websocket connection
  const { readyState, sendMessage, lastMessage } = useWebSocket(WEBSOCKET_URL, {
    onOpen: () => console.log('Established connection'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => true,
  })

  useEffect(() => {
    const gf = new GiphyFetch('A1FBgEQlzXiLtulnrvwQHmohmjob3wLn');
    const getTrending = async () => {
      const { data: gifs } = await gf.trending({ limit: 10 });

      setStickers(gifs);
      gifs.map((gif) => 
        setMessageHistory((prev) => prev.concat({
          type: 'sent',
          message: {
            content: <Gif gif={gif} width={100} />,
            username: 'You'
          }
        }))
      )
    }

    if (!Array.isArray(stickers) || !stickers.length) {
      getTrending();
    }
  }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;
      const msg = JSON.parse(data);

      setMessageHistory((prev) => prev.concat({
        type: 'received',
        message: {
          content: msg.message,
          username: msg.username,
        },
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
        message: {
          content: message,
          username: 'You',
        },
      }))
      refMsg.current.value = '';
    }
  };

  const handleKeyDown  = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSendMessage();
    }
  };

  console.log('gifs', stickers);

  return (
    <div className="card h-screen flex p-8">
      <div className="h-full overflow-y-auto">
        {messageHistory.map((msg: Message, idx: number) => {
          const isSent = msg.type === 'sent';

          return (
            <div 
              key={`${msg.message.username}${idx}`} 
              className={`chat chat-${isSent ? 'end grid-cols-[minmax(0,1fr)_40px] justify-items-end' : 'start grid-cols-[40px_minmax(0,1fr)] justify-items-start'}`}
            >
              {/* <div 
                className={`chat-bubble max-w-[250px] break-all chat-bubble-${isSent ? 'info' : 'primary'}`} 
                style={isSent ? { marginRight: '0.75rem', gridColumnStart: 3 } : { marginLeft: '0.75rem', gridColumnStart: 1 }}
              >
                {msg.message}
              </div> */}
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
              <div className="chat-header">
                {msg.message.username}
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble">{msg.message.content}</div>
              <div className="chat-footer opacity-50">
                Delivered
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex space-x-4 h-30px">
        <input 
          className="input input-bordered input-primary w-full" 
          type="text" 
          placeholder="Message..." 
          name="message" 
          ref={refMsg}
          onKeyDown={handleKeyDown} 
          required
        />
        <button className="btn btn-primary" onClick={onClickSendMessage}>
          Send Message
        </button>
      </div>
    </div>
  )
}

export default App
