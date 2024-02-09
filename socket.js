// socket.js
import { useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io("http://localhost:3000", { path: '/api/socket/ping' });
const socket = io({ path: '/api/socket' });
// const socket = io('https://localhost:3000/api/socket/ping');

export default function useSocket() {
    useEffect(() => {
        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    return socket;
}
