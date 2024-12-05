import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import argon2 from 'argon2';

//Grabs admin data from .env
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

//Grabs to repositories associated with users
const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string, username: string): Promise<User> {

    // Create the new user object and saves data
    let newUser = new User();
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    newUser.username = username;

    //Function that is ran in order to determine admin status
    ///////
    //Admin Classification Function location
    ///////

    // Then save it to the database
    // NOTES: We reassign to `newUser` so we can access
    // NOTES: the fields the database autogenerates (the id & default columns)
    newUser = await userRepository.save(newUser);

    return newUser;

}

async function getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findOne({ where: { email } });
}

async function getUserByID(userId: string): Promise<User | null> {
    return userRepository.findOne({ where: { userId } });
}

//Initial admin creation
async function firstAdminInitializer(): Promise<null> {

    //Hashes the main admin password so that it's not stored openly
    if(!(await getUserByEmail(ADMIN_EMAIL))){

        const passwordHash = await argon2.hash(ADMIN_PASS);

        await addUser(ADMIN_EMAIL, passwordHash, ADMIN_USER);

    }
    return null;
}

async function addAdmin(email: string): Promise<null>{

    await getUserByEmail(email);

    return null;

}

export { addUser, firstAdminInitializer, getUserByEmail, getUserByID, addAdmin };