import { Turn } from "@/constants/game";

export const useOnlineGameStore = () => {
  const room = useState<string>('room');
  const myTurn = useState<Turn>('myTurn');
  const playerNames = useState<{
    player1: string;
    player2: string;
    player3: string;
  }>('playerNames');
  return { room, myTurn, playerNames };
};
