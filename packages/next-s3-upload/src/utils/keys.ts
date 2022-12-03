import { v4 as uuidv4 } from 'uuid';

export const uuid = () => uuidv4();

const SAFE_CHARACTERS = /[^0-9a-zA-Z!_\\.\\*'\\(\\)\\\-/]/g;
export const sanitizeKey = (value: string) =>
  value.replace(SAFE_CHARACTERS, ' ').replace(/\s+/g, '-');
