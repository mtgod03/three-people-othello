import { io } from 'socket.io-client';
import { EntryNamespaceSocket, GameNamespaceSocket } from '@/types/socket';

export const entrySocket: EntryNamespaceSocket = io('/entry', {
  autoConnect: false,
  reconnectionAttempts: 5,
});

export const gameSocket: GameNamespaceSocket = io('/game', {
  autoConnect: false,
  reconnectionAttempts: 5,
});
