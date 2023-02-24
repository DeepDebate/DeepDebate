import React, { useState, useEffect } from "react";

function Connection() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080/websocket");

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(message);
    }
  };

  return <div>{/* Render your React component here */}</div>;
}

export default Connection;
