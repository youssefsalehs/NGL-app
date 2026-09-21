import bcrypt from "bcrypt";
export const hashPassword = async (password) => bcrypt.hash(password, 12);
export const matchPassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);
