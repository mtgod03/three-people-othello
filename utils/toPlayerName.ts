import { Turn } from '@/constants/game';

const toPlayerName = (
  turn: Turn,
  playerNames: { player1: string; player2: string; player3: string },
): string => {
  if (turn === Turn.PLAYER_1) {
    return playerNames.player1;
  } else if (turn === Turn.PLAYER_2) {
    return playerNames.player2;
  } else {
    return playerNames.player3;
  }
};

export default toPlayerName;
