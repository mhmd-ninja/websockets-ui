import { getRandomId } from "../utils";

export class User {
    private name: string;
    private index: string;

    constructor(name: string) {
        this.name = name;
        this.index = `user-${getRandomId()}`
    }

    getIndex() {
        return this.index;
    }

    getName() {
        return this.name;
    }
}

export const userMap = new Map<string, User>();