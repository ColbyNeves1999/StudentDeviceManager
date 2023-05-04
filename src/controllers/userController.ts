import { Request, Response } from 'express';
import argon2 from 'argon2';

//Imported functions from models
import { getUserByEmail, addUser, addAdmin, getAdmin, setAdminStatus } from '../models/userModel';

async function registerUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as userLoginInfo;
    const user = await getUserByEmail(email);

    if (user) {
        res.sendStatus(404);
        return;
    }

    // IMPORTANT: Hash the password
    const passwordHash = await argon2.hash(password);

    await addUser(email, passwordHash);
    res.sendStatus(200);

}

//Logs the user into the website
async function logIn(req: Request, res: Response): Promise<void> {

    const { email, password } = req.body as userLoginInfo;
    const user = await getUserByEmail(email);

    if (!user) {
        res.sendStatus(404);
        return;
    }

    const { passwordHash } = user;

    if (!(await argon2.verify(passwordHash, password))) {
        res.sendStatus(404); // 404 Not Found
        return;
    }

    req.session.authenticatedUser = {
        email: user.email,
        userId: user.userId,
        isAdmin: user.admin,
    };
    req.session.isLoggedIn = true;

    res.sendStatus(200);
    return;

}

//Creates admins
async function createAdmin(req: Request, res: Response): Promise<void> {

    const { email } = req.body as userLoginInfo;

    const admin = await getAdmin(email);

    if (admin) {
        res.sendStatus(200);
        return;
    }

    await addAdmin(email);

    res.sendStatus(200);
    return;

}

//Sets admin status
async function adminControl(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn) {
        res.sendStatus(404);
        return;
    }

    await setAdminStatus(req.session.authenticatedUser.email);

    const user = await getUserByEmail(req.session.authenticatedUser.email);

    if (user.admin === true) {
        req.session.authenticatedUser.isAdmin = true;
    }

    res.sendStatus(200);
    return;

}

export { registerUser, logIn, createAdmin, adminControl };