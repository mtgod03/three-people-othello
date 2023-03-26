import { Namespace } from 'socket.io';
import { Socket } from 'socket.io-client';
import { Turn } from '@/constants/game';
import { CellPosition } from './game';

// EntryNamespaceの型
interface EntryNamespaceServerToClientEvents {
  ready(myTurn: Turn, playerNames: { player1: string; player2: string; player3: string }): void;
  existentRoom(): void;
}

interface EntryNamespaceClientToServerEvents {
  enter(room: string, playerName: string): void;
}

interface EntryNamespaceInterServerEvents {}

interface EntryNamespaceSocketData {
  playerName: string;
}

export type EntryNamespace = Namespace<
  EntryNamespaceClientToServerEvents,
  EntryNamespaceServerToClientEvents,
  EntryNamespaceInterServerEvents,
  EntryNamespaceSocketData
>;

export type EntryNamespaceSocket = Socket<
  EntryNamespaceServerToClientEvents,
  EntryNamespaceClientToServerEvents
>;

// GameNamespaceの型
interface GameNamespaceServerToCloentEvents {
  move(move: CellPosition): void;
}

interface GameNamespaceClientToServerEvents {
  enter(room: string): void;
  move(move: CellPosition): void;
}

interface GameNamespaceInterServerEvents {}

interface GameNamespaceSocketData {}

export type GameNamespace = Namespace<
  GameNamespaceClientToServerEvents,
  GameNamespaceServerToCloentEvents,
  GameNamespaceInterServerEvents,
  GameNamespaceSocketData
>;

export type GameNamespaceSocket = Socket<
  GameNamespaceServerToCloentEvents,
  GameNamespaceClientToServerEvents
>;
