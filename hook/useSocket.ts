import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { IP } from "../api";

const useSocket = (topic: any, token: any, handleReceivedData: any) => {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!token) {
      return;
    }
    const socket = new SockJS(`http://${IP}:8080/ws`);
    const client = Stomp.over(socket);
    client.debug = (str) => {
      console.log('STOMP DEBUG:', str);
    };
    client.connect(
      {},
      (frame: any) => {
        setConnected(true);
        client.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          handleReceivedData(data)
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket", error);
        setConnected(false);
      }
    );

    return () => {
      if (client && client.connected) {
        client.disconnect(() => {
          setConnected(false);
          console.log("Disconnected");
        });
      }
    };
  }, [topic, token]);

  return connected;
};

export default useSocket;
