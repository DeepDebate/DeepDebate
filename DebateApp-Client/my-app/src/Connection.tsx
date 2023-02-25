import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";

function CountDownClock() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => console.log(msg),
      forceBinaryWSFrames: false,
      maxWebSocketChunkSize: 65536,
    });

    client.onConnect = (frame) => {
      client.subscribe("/topic/messages", (message) => {
        setResponse(JSON.parse(message.body).content);
      });
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      console.log("WebSocket connection is closed.");
    };
  }, []);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!stompClient) {
      return;
    }
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify({ name }),
    });
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <input type="submit" value="Send" />
      </form>
      <p>{response}</p>
    </div>
  );
}

export default CountDownClock;
