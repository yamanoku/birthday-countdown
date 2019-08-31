declare class CountdownTimer {
    timer: string;
    tl: number;
    today: Date;
    constructor(tl: number);
    countDown(): void;
    addZero(num: number): string;
}
