import { io } from 'socket.io-client';
import { EntryNamespaceSocket, GameNamespaceSocket } from '@/types/socket';

const socketServerUrl = `${window.location.protocol}//${window.location.hostname}:3001`;

export const entrySocket: EntryNamespaceSocket = io(`${socketServerUrl}/entry`, {
  autoConnect: false,
  reconnectionAttempts: 5,
});

export const gameSocket: GameNamespaceSocket = io(`${socketServerUrl}/game`, {
  autoConnect: false,
  reconnectionAttempts: 5,
});
