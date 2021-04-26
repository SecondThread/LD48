
import type {Player} from './Player';

type Room = {
    players: Player[],
    startTime: number,
    endTime: number,
    frogsWon: boolean,
};

export type {Room};