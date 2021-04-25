
type Player = {
    _id: string,
    isShark: boolean,
    timeUpdated: number,
    lastTimeDied: number;
    username: string,
    x: number;
    y: number;
    xVel: number;
    yVel: number;
};

export type {Player};