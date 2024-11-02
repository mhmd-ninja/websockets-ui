import { WebSocket, WebSocketServer } from 'ws';
import { Command } from '../types';
import { User, userMap } from './modules/User';
import { error } from 'console';
import { toSerializedMessage } from './utils';
import { Room, roomMap } from './modules/Room';

const PORT = 3000;
const ws_server = new WebSocketServer({ port: Number(PORT) });

const socketToUserMap = new Map();
const userToSocketMap = new Map();


const winnersMap = new Map<string, number>();

ws_server.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    ws.on('message', (message: string) => {
        const messagePayload = JSON.parse(message.toString());
        const dataPayload = JSON.parse(messagePayload.data || '{}');
        console.log(`Received message: ${messagePayload.type}`);
        console.log(`Received dataPayload: ${JSON.stringify(dataPayload)}`);

        switch (messagePayload.type as Command) {
            case 'reg': {
                if(userMap.get(messagePayload.id)) {
                    return ws.send(
                        toSerializedMessage('reg', {
                            name: dataPayload.name,
                            index: 1, 
                            error: true,
                            errorText: `A user with account name: "${dataPayload.name}" already exists`,
                        })
                    )
                }

                const user = new User(dataPayload.name);
                userMap.set(user.getIndex(), user);
                socketToUserMap.set(ws, user);
                userToSocketMap.set(user.getIndex(), ws);

                ws.send(
                  toSerializedMessage('reg', {
                    name: dataPayload.name,
                    index: user.getIndex(),
                    error: false,
                  }),
                );

                ws_server.clients.forEach((client) => {
                    client.send(toSerializedMessage('update_winners', 
                      Array.from(winnersMap.entries()).map(([key, value]) => ({
                        name: key,
                        wins: value,
                      }))
                    ));
                    client.send(
                      toSerializedMessage('update_room', 
                        Array.from(roomMap.values()).filter((room) => !room.isFull()),
                      ),
                    );
                  });
                break;
            }
            case 'create_room': {
                const user = socketToUserMap.get(ws);

                if (!user) {
                    console.error(
                    `[WebSocket]: Received command: ${messagePayload.type} from UNKNOWN user}`,
                    );
                    return;
                }

                const room = new Room();
                room.addUser(user);
                roomMap.set(room.getRoomId(), room);

                console.log(
                  `[Game]: added ${user.getIndex()} to room: ${room.getRoomId()}`,
                );

                ws_server.clients.forEach((client) => {
                    client.send(
                      toSerializedMessage('update_room', 
                        Array.from(roomMap.values()).filter((room) => !room.isFull())
                      ),
                    );
                  });
                break;
            }
            case 'add_user_to_room': {
                const user = socketToUserMap.get(ws);
      
                if (!user) {
                  console.error(
                    `[WebSocket]: Received command: ${messagePayload.type} from UNKNOWN user}`,
                  );
                  return;
                }
      
                const roomIndex = dataPayload.indexRoom;
                const room = roomMap.get(roomIndex);
                console.log(dataPayload, roomMap, room);
      
                if (!room) {
                  console.error(
                    `[WebSocket]: Received command: ${messagePayload.type} from ${user.getIndex()} join non-existing room: ${roomIndex}`,
                  );
                  return;
                }
      
                room.addUser(user);
                ws_server.clients.forEach((client) => {
                  client.send(toSerializedMessage('update_winners', []));
                  client.send(
                    toSerializedMessage('update_room', Array.from(roomMap.values())),
                  );
                });
                break;
            }
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    ws.on('error', (error) => {
        console.error(`WebSocketServer error: ${error}`);
    });
});

process.on('SIGINT', () => {
    console.log('Shutting down WS server...');
    ws_server.close(() => {
        console.log('WS server closed');
        process.exit(0);
    });
});

export { ws_server }