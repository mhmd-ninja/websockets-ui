import { Command } from "../../types";

export const getRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

export const toSerializedMessage = (type: Command, payload: object) => {
    return JSON.stringify({
      type,
      data: JSON.stringify(payload),
      id: 0,
    });
  };