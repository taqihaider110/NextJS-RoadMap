import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });

  return token;
};
