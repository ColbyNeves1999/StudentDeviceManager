//Controller Calls

//Model Calls
import { AppDataSource } from '../dataSource';
import argon2 from 'argon2';
import fs from 'fs';
import { dataEncrypt } from './securityModel';

//Entity Calls
import { User } from '../entities/User';

//Repository calls
const userRepository = AppDataSource.getRepository(User);

//.env Calls
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

//Finds a user in the database using their email
async function getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findOne({ where: { email } });
}

//Finds a user in the database using their user ID
async function getUserByID(userId: string): Promise<User | null> {
    return userRepository.findOne({ where: { userId } });
}

//Primary function used for creating new users
async function addUser(email: string, passwordHash: string, username: string, adminStatus: boolean): Promise<User | null> {
    
    if(!(await getUserByEmail(email))){

        // Create the new user object and saves initial data
        let newUser = new User();
        newUser.email = email;
        newUser.passwordHash = passwordHash;
        newUser.username = username;
        newUser.admin = adminStatus;

        //Saves the new user to the database so that they are properly stored
        newUser = await userRepository.save(newUser);

        //Returns the new user database data for use after function ends
        return newUser;

    }

    return null;

}

//Initial admin creation
async function firstAdminInitializer(): Promise<void> {

    //Verifies that the admin doesn't already exist
    if(!(await getUserByEmail(ADMIN_EMAIL))){

        //Hashes the main admin password so that it's not stored openly
        const passwordHash = await argon2.hash(ADMIN_PASS);

        //Adds the admin user to the database
        await addUser(ADMIN_EMAIL, passwordHash, ADMIN_USER, true);

    }

    if(!await fs.existsSync(process.env.ENCRYPDATA)){

        await dataEncrypt(process.env.FILETOENCRYPT);
        await fs.unlinkSync(process.env.FILETOENCRYPT);

    }

}

//Makes it so that a user's admin status can be changed
async function changeAdminStatus(email: string): Promise<void>{

    //Grabs the user by their email from database
    let user = await getUserByEmail(email);

    //Verifies that the user that is being modified isn't the primary admin
    if(!(user.email === ADMIN_EMAIL)){

        //Sets the user's admin status to the oposite of their current admin status
        user.admin == !user.admin;

    }

    //Saves any user changes that were made
    user = await userRepository.save(user);

    return;

}

export { addUser, firstAdminInitializer, getUserByEmail, getUserByID, changeAdminStatus };