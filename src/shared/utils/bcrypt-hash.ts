import { genSaltSync, compareSync } from 'bcryptjs';

export const genSalt = async (): Promise<string> => {
  return genSaltSync(10);
};

export const compare = async (text: string, hash: string): Promise<boolean> => {
  return compareSync(text, hash);
};
