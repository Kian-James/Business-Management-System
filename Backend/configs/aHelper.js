// PASSWORD HELPER FUNCTIONS
import bcrypt from "bcryptjs";

// HASH PASSWORD || TAKES PASSWORD, RETURNS HASHED PASSWORD
export const hashPassword = async (password) => {
  try {
    const add = 10;
    const hashPass = await bcrypt.hash(password, add);
    return hashPass;
  } catch (error) {
    console.log(error);
  }
};

// COMPARE PASSWORD || TAKES PLAIN AND HASHED PASSWORD, RETURNS BOOLEAN
export const comparePassword = async (password, hashPass) => {
  return bcrypt.compare(password, hashPass);
};
