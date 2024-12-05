import 'express-session';
import { Student } from '../entities/Student';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Add your app's custom session properties here:
    authenticatedUser: {
      username: string;
      email: string;
      userId: string;
      isAdmin: boolean;
    };
    isLoggedIn: boolean;

  }
}
