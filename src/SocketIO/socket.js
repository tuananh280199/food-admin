import io from 'socket.io-client';
import {store} from "../config/configStore";
import {SERVER_EMIT_CLIENT_SEND_ORDER} from "./constants";
import {addOrderSendClient} from "../pages/Order/slice";

const socket = io(process.env.REACT_APP_SOCKET_GATEWAY, { transports: ["websocket"] });

socket.on(SERVER_EMIT_CLIENT_SEND_ORDER, (data) => {
    // console.log('SERVER_EMIT_CLIENT_SEND_ORDER', data);
    store.dispatch(addOrderSendClient({
        order: [data.order]
    }))
})

socket.authEmit = (event, payload) => {
    const token = store.getState().auth.token;
    return socket.emit(event, {...payload, token});
};

export default socket;
