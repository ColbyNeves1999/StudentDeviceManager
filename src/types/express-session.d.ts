import 'express-session';
import { Student } from '../entities/Student';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Add your app's custom session properties here:
    authenticatedUser: {
      email: string;
      userId: string;
      isAdmin: boolean;
      authToken: string;
      refreshToken: string;
    };
    isLoggedIn: boolean;
    curStudent: Student;

  }
}
