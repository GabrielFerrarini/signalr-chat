import React, { useEffect, useState } from 'react';
import faker from 'faker';
import { HubConnectionBuilder } from '@aspnet/signalr';

import './Chat.css';

const Chat = () => {
  const [nick, setNick] = useState('');
  const [message, setMessage] = useState({ value: '' });
  const [messages, setMessages] = useState([]);
  const [hubConnection, setHubConnection] = useState(null);

  useEffect(() => {
    if (nick) {
      const conn = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/chathub')
        .build();

      setHubConnection(conn);
    }
  }, [nick]);

  useEffect(() => {
    if (hubConnection) {
      hubConnection.start()
        .then(() => console.log('Connection started'))
        .catch(error => console.error('Error while establishing connection:', error));
    }
  }, [hubConnection]);

  useEffect(() => {
    if (hubConnection) {
      const handleMessage = (nick, receivedMessage) => {
        const nextMessage = {
          nick,
          value: receivedMessage,
        };
        const newMessages = messages.concat([nextMessage]);
        setMessages(newMessages);
      };

      hubConnection.on('ReceiveMessage', handleMessage);

      return () => hubConnection.off('ReceiveMessage', handleMessage);
    }
  }, [hubConnection, messages]);

  useEffect(() => {
    const nickName = faker.name.findName();

    setNick(nickName);
  }, []);

  const sendMessage = () => {
    hubConnection
      .invoke('SendToAll', nick, message.value)
      .catch(error => console.error(error));
    setMessage({ value: '' });
  };

  return (
    <div className="chat-container">
      <div className="my-nick">Hello, {nick}</div>
      <input type="text" value={message.value} onChange={e => setMessage({ nick, value: e.target.value })} onKeyUp={(e) => e.keyCode === 13 ? sendMessage() : null} />
      <button onClick={sendMessage}>Send</button>
      <div className="messages-container">
        <div>
          <br />
          {
            messages.map((message, index) => (
              <div className={`message ${message.nick === nick ? 'my-message' : 'my-contacts-message'}`} key={index}>
                <div className="nick">{message.nick}</div>
                <div>{message.value}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;
