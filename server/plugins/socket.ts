import { Server } from 'socket.io';
import { EntryNamespace, GameNamespace } from '@/types/socket';
import { Turn } from '@/constants/game';

export default defineNitroPlugin(() => {
  const io = new Server(3001, {
    cors: {
      origin: '*',
    },
  });

  const entryNamespace: EntryNamespace = io.of('/entry');
  const gameNamespace: GameNamespace = io.of('game');

  entryNamespace.on('connection', (socket) => {
    console.log('connecteed');  // test
    socket.on('enter', (room, playerName) => {
      if (gameNamespace.adapter.rooms.has(room)) {
        socket.emit('existentRoom');
        return;
      }

      socket.join(room);
      socket.data.playerName = playerName;

      if (entryNamespace.adapter.rooms.get(room)!.size === 3) {
        const roomMemberIds = [...entryNamespace.adapter.rooms.get(room)!];
        const playerNames = {
          player1: entryNamespace.sockets.get(roomMemberIds[0])!.data.playerName!,
          player2: entryNamespace.sockets.get(roomMemberIds[1])!.data.playerName!,
          player3: entryNamespace.sockets.get(roomMemberIds[2])!.data.playerName!,
        };
        
        entryNamespace.to(roomMemberIds[0]).emit('ready', Turn.PLAYER_1, playerNames);
        entryNamespace.to(roomMemberIds[1]).emit('ready', Turn.PLAYER_2, playerNames);
        entryNamespace.to(roomMemberIds[2]).emit('ready', Turn.PLAYER_3, playerNames);
      }
    });
  });

  gameNamespace.on('connection', (socket) => {
    socket.on('enter', (room) => {
      socket.join(room);
    });

    socket.on('move', (move) => {
      gameNamespace.to([...socket.rooms]).emit('move', move);
    });
  });
});
