import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { Admin } from '../entities/Admin';
import argon2 from 'argon2';

//Grabs admin data from .env
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

//Grabs to repositories associated with users
const userRepository = AppDataSource.getRepository(User);

//Initial admin creation
async function firstAdminInitializer(): Promise<null> {

    //Hashes the main admin password so that it's not stored openly
    const passwordHash = await argon2.hash(ADMIN_PASS);

    await addUser(ADMIN_EMAIL, passwordHash);
    await addAdmin(ADMIN_EMAIL);

    return null;
}

async function getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findOne({ where: { email } });
}

async function getUserByID(userId: string): Promise<User | null> {
    return userRepository.findOne({ where: { userId } });
}

async function addUser(email: string, passwordHash: string): Promise<User> {

    // Create the new user object and saves data
    let newUser = new User();
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    if(newUser.email == process.env.ADMIN_EMAIL){
        newUser.admin = true;
    }else{
        newUser.admin = false;
    }
    // Then save it to the database
    // NOTES: We reassign to `newUser` so we can access
    // NOTES: the fields the database autogenerates (the id & default columns)
    newUser = await userRepository.save(newUser);

    return newUser;

}

async function addAdmin(email: string): Promise<void> {

    // Create the new user object and saves data
    let newAdmin = new User();
    newAdmin.email = email;

    // Then save it to the database
    // NOTES: We reassign to `newUser` so we can access
    // NOTES: the fields the database autogenerates (the id & default columns)

    return;

}

async function getAdmin(email: string): Promise<Admin | null> {
return;
}

async function setAdminStatus(email: string): Promise<void> {


    const user = await getUserByEmail(email);
    const admin = await getAdmin(email);

    if (!admin && user && user.email != process.env.ADMIN_EMAIL) {

        user.admin = !user.admin;
        await userRepository.save(user);

    }

    return;

}

async function setUserAuth(email: string, auth: string, refresh: string): Promise<User> {

    const user = await getUserByEmail(email);

    user.authCode = auth;
    user.refreshCode = refresh;

    await userRepository.save(user);

    return user;

}

export { getUserByEmail, addUser, addAdmin, getAdmin, setAdminStatus, setUserAuth, getUserByID, firstAdminInitializer };