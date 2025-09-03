declare module "express-session" {
    interface SessionData {
      userId: string;
    }
  }
  
  interface User {
    email: string;
    password: string;
    googleId?: string;
    secret?: string;
  }