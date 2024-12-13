import { Request, Response } from 'express';
import argon2 from 'argon2';

import customLogger from '../utils/logging';

//Imported functions from models
import { getUserByEmail, addUser, changeAdminStatus} from '../models/userModel';

//Handles to registration of a new user(s)
//The objective here is to allow for batch user creations if desired
//so changes will eventually be made to accommodate that 
async function registerUser(req: Request, res: Response): Promise<void> {
    
    const { email, password, username, adminStatus } = req.body as userLoginInfo;
    let user = await getUserByEmail(email);

    if (user) {
        customLogger.log('information', "User already exists.");
        return;
    }

    // IMPORTANT: Hash the password
    const passwordHash = await argon2.hash(password);

    await addUser(email, passwordHash, username, adminStatus );

    user = await getUserByEmail(email);

    if (user) {

        customLogger.log('success', "User now exists.");
        
    }
    else{

        customLogger.log('error', "User wasn't created");
        return;

    }

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

    //Grab's the attempted login data and looks for a user with that information
    const { email, password } = req.body as userLoginInfo;
    const user = await getUserByEmail(email);

    //A check to see if the user exists
    if (!user) {

        //If the user doesn't exist, then the user is just returned to login
        res.redirect("/index");
        return;

    }

    //Grabs the hash of the user that was found
    const { passwordHash } = user;

    //A check to see if the user's password was wrong
    if (!(await argon2.verify(passwordHash, password))) {
        
        //If password was wrong, then the user is just returned to login
        res.redirect("/index");
        return;

    }

    //Stores session data for the user currently logging in
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

        //Renders the homepage of the user that is logged in
        res.render("userHomepage", { user });
        return;

    }else{

        //Extra check to see if the user doesn't exist so they just get sent back to the login page
        res.redirect("/index");
        return;

    }

}

//Logs the user into the website
async function logOut(req: Request, res: Response): Promise<void> {

    await req.session.clearSession();

    res.redirect('index.html');

}


//Refreshes the data for the user's current session
async function sessionRefresh(req: Request, res: Response): Promise<void>{

    let user = await getUserByEmail(req.session.authenticatedUser.email);

    req.session.authenticatedUser = {
        username: user.username,
        email: user.email,
        userId: user.userId,
        isAdmin: user.admin,
    };
    req.session.isLoggedIn = true;

    res.render("userHomepage", { user });

}

//Controller that handles the creation of admins
async function adminStatusManagment(req: Request, res: Response): Promise<void> {

    //Grabs the email of the user that is having their status changed
    const { email } = req.body as userLoginInfo;

    //Calls on status change function
    await changeAdminStatus(email);

    //This Will be changed to refresh the user's page when their admin choices are made
    ///////
    location.reload();
    return;
    ///////

}

export { registerUser, logIn, logOut, adminStatusManagment, sessionRefresh };