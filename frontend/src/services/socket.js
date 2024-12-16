import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

const socket = io('http://localhost:3000', {
    auth: {
        token: getAuthToken()
    }
});

export default socket;