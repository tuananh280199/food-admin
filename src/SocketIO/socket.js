import io from 'socket.io-client';
import {store} from "../config/configStore";

const socket = io(process.env.REACT_APP_SOCKET_GATEWAY, { transports: ["websocket"] });

socket.authEmit = (event, payload) => {
    const token = store.getState().auth.token;
    console.log(token);
    return socket.emit(event, {...payload, token});
};

export default socket;
