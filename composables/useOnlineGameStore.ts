import { Turn } from "@/constants/game";

export const useOnlineGameStore = () => {
  const room = useState<string>('room');
  const myTurn = useState<Turn>('myTurn');
  const playerNames = useState(
    'playerNames',
    () => ({ player1: '', player2: '', player3: '' })
  );
  return { room, myTurn, playerNames };
};
