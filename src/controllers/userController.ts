import { Request, Response } from 'express';
import argon2 from 'argon2';

//Imported functions from models
import { getUserByEmail, addUser, addAdmin} from '../models/userModel';

//Handles to registration of a new user(s)
//The objective here is to allow for batch user creations if desired
//so changes will be made to accommodate that 
async function registerUser(req: Request, res: Response): Promise<void> {
    
    const { email, password, username } = req.body as userLoginInfo;
    let user = await getUserByEmail(email);

    if (user) {
        res.sendStatus(404);
        return;
    }

    // IMPORTANT: Hash the password
    const passwordHash = await argon2.hash(password);

    await addUser(email, passwordHash, username);

    user = await getUserByEmail(email);

    req.session.authenticatedUser = {
        username: user.username,
        email: user.email,
        userId: user.userId,
        isAdmin: user.admin,
    };
    req.session.isLoggedIn = true;

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
        username: user.username,
        email: user.email,
        userId: user.userId,
        isAdmin: user.admin,
    };
    req.session.isLoggedIn = true;
    

    //Probably not necessary but wanted to keep shenanigans that
    //may be used to access someone's account after they've logged out
    if(req.session.isLoggedIn === true && req.session.authenticatedUser.email === user.email){

        res.render('userHomepage', { user });
        return;

    }else{

        res.redirect("index.html");
        return;

    }

}

//Controller that handles the creation of admins
async function createAdmin(req: Request, res: Response): Promise<void> {

    const { email } = req.body as userLoginInfo;

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

    const user = await getUserByEmail(req.session.authenticatedUser.email);

    if (user.admin === true) {
        req.session.authenticatedUser.isAdmin = true;
    }

    res.redirect('/index');
    return;
    
}

export { registerUser, logIn, createAdmin, adminControl };