declare module "express-session" {
    interface SessionData {
      userId: string;
    }
  }
  
export interface User {
    email: string;
    password: string;
    googleId?: string;
    secret?: string;
  }