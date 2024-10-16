import { Request, Response } from 'express';
import argon2 from 'argon2';

import { getUserByEmail, addUser} from '../models/userModel';

const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function initializeAdmins(req: Request, res: Response): Promise<void> {

    //Grabs email for the primary admin user
    const user_exists = await getUserByEmail(ADMIN_EMAIL);
  
    if (!user_exists) {
        await addUser(ADMIN_EMAIL, await argon2.hash(ADMIN_PASS));
    }

    res.redirect('/index');

}

export { initializeAdmins };