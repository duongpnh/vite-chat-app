/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Helmet } from "react-helmet";
import * as dayjs from "dayjs";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getGreetingMessage } from "../../utils/get-greeting-message.util";
// import { GiphyFetch } from '@giphy/js-fetch-api'
// import { Gif } from '@giphy/react-components'
// import { SignIn } from './pages/auth/SignIn'

const WEBSOCKET_URL = "ws://localhost:3003/chat";

type Message = {
  content: {
    message: string;
    username: string;
    sentAt: number;
  };
  type: "received" | "sent";
};
const Chat = () => {
  const refMsg = useRef<HTMLInputElement>(null);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const auth = useAuth();
  const user = JSON.parse(auth.user || "{}");
  const navigate = useNavigate();

  // establish websocket connection
  const { readyState, sendMessage, lastMessage } = useWebSocket(
    `${WEBSOCKET_URL}?access_token=${user.token}`,
    {
      onOpen: () => console.log("Established connection"),
      onClose: () => console.log("WebSocket connection closed."),
      shouldReconnect: () => true,
    },
  );

  // useEffect(() => {
  //   const gf = new GiphyFetch('A1FBgEQlzXiLtulnrvwQHmohmjob3wLn');
  //   const getTrending = async () => {
  //     const { data: gifs } = await gf.trending({ limit: 10 });

  //     setStickers(gifs);
  //     gifs.map((gif) =>
  //       setMessageHistory((prev) => prev.concat({
  //         type: 'sent',
  //         message: {
  //           content: <Gif gif={gif} width={100} />,
  //           username: 'You'
  //         }
  //       }))
  //     )
  //   }

  //   if (!Array.isArray(stickers) || !stickers.length) {
  //     getTrending();
  //   }
  // }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;
      console.log("🚀 ~ file: Chat.tsx:60 ~ useEffect ~ msg:", lastMessage);
      const msg = JSON.parse(data);

      setMessageHistory((prev) =>
        prev.concat({
          type: "received",
          content: {
            message: msg.message,
            username: msg.username,
            sentAt: msg.sentAt,
          },
        }),
      );
    }
  }, [lastMessage, setMessageHistory]);

  const onClickSendMessage = () => {
    const isOpeningConnection = readyState === ReadyState.OPEN;

    if (isOpeningConnection && refMsg.current) {
      const message = refMsg.current.value;
      console.log("auth.user", user);
      sendMessage(JSON.stringify({ message }));
      setMessageHistory((prev) =>
        prev.concat({
          type: "sent",
          content: {
            message,
            username: user.username as string,
            sentAt: Date.now(),
          },
        }),
      );
      refMsg.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClickSendMessage();
    }
  };

  return (
    <>
      <Helmet>
        <title>Chat App</title>
        <meta name="description" content="Chat App Description" />
      </Helmet>
      <div className="card h-full flex p-8">
        <div className="flex space-x-4 h-30px">
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <div className="normal-case text-xl bold">
                {getGreetingMessage()}, {user.username}
              </div>
            </div>
            <div className="flex-none gap-2">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-24 md:w-auto"
                />
              </div>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li
                    onClick={() =>
                      auth.signOut(() => navigate("/", { replace: true }))
                    }
                  >
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          {messageHistory.map(({ type, content }: Message, idx: number) => {
            const isSent = type === "sent";

            return (
              <div
                key={`${content.username}${idx}`}
                className={`chat chat-${
                  isSent
                    ? "end grid-cols-[minmax(0,1fr)_40px] justify-items-end"
                    : "start grid-cols-[40px_minmax(0,1fr)] justify-items-start"
                }`}
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
                  {content.username}
                  <time className="text-xs opacity-50">
                    {dayjs(content.sentAt).format("HH:mm:ss")}
                  </time>
                </div>
                <div className="chat-bubble">{content.message}</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            );
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
    </>
  );
};

export default Chat;
