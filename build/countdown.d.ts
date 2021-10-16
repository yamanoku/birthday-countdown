declare class CountdownTimer {
    elementID: string;
    birthDay: Date;
    birthdayMessage: string;
    constructor(elementID: string, birthDay: Date, birthdayMessage: string);
    countDown(): void;
}
