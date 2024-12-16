import { io } from 'socket.io-client';
import { getAuthToken } from './auth';

const socket = io('https://api.local-shyphem.site', {
    auth: {
        token: getAuthToken()
    }
});

export default socket;