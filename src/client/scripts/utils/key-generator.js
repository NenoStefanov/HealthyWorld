export class KeyGenerator {
    constructor(length = 20) {
        this._chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@()_-1234567890';
        this._timestampLength = 13;
        this._length = length - this._timestampLength;
    }

    _getRandomNumber(min = 0, max = Number.MAX_VALUE) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generate() {
        let timestamp = (+new Date).toString();

        let key = timestamp;

        for (let i = 0; i < this._length; i += 1) {
            let index = this._getRandomNumber(0, this._chars.length),
                char = this._chars[index];
            key += char;
        }

        return key;
    }
}