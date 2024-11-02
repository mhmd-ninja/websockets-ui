import { httpServer } from "./http_server/index";
import { ws_server } from "./ws_server/index";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

ws_server.on('listening', () => {
    const address = ws_server.address();
    if (address && typeof address !== "string") console.log(`Start WS server on port ${address.port}`);
});