import Swal, { SweetAlertResult } from 'sweetalert2';
import { Turn } from '@/constants/game';

const Alert = Swal.mixin({
  customClass: {
    title: 'text-h5 text-teal',
    confirmButton: 'text-button bg-teal elevation-2 rounded mx-4 px-6',
    cancelButton: 'text-button elevation-2 rounded mx-4 px-6',
    popup: 'elevation-24',
  },
  buttonsStyling: false,
  reverseButtons: true,
});

export default Alert;

export const fireResultAlert = (
  playerNames: {
    player1: string;
    player2: string;
    player3: string;
  },
  gameStats: {
    // 同点で1位が2人以上いる場合があるのでfirstPlaceは配列で表される
    firstPlace: Turn[];
    scores: {
      player1: number;
      player2: number;
      player3: number;
    };
  },
): Promise<SweetAlertResult> => {
  let winnerNames = '';
  for (const winner of gameStats.firstPlace) {
    winnerNames += toPlayerName(winner, playerNames) + ' ';
  }

  return Alert.fire({
    title: 'ゲーム終了',
    html: `
      <div class="mb-3">${winnerNames}の勝ち</div>
      <table class="text-body-1 mx-auto">
        <tr>
          <td class="text-left px-6">${playerNames.player1}</td>
          <td class="text-right px-6">${gameStats.scores.player1}</td>
        </tr>
        <tr>
          <td class="text-left px-6">${playerNames.player2}</td>
          <td class="text-right px-6">${gameStats.scores.player3}</td>
        </tr>
        <tr>
          <td class="text-left px-6">${playerNames.player3}</td>
          <td class="text-right px-6">${gameStats.scores.player3}</td>
        </tr>
      </table>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'ホームに戻る',
    cancelButtonText: '閉じる',
    allowOutsideClick: false,
  });
};
