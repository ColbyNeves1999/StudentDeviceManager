import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { Admin } from '../entities/Admin';

const userRepository = AppDataSource.getRepository(User);
const adminRepositoy = AppDataSource.getRepository(Admin);

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
    newAdmin = await adminRepositoy.save(newAdmin);

    return;

}

async function getAdmin(email: string): Promise<Admin | null> {
    return await adminRepositoy.findOne({ where: { email } });
}

async function setAdminStatus(email: string): Promise<void> {


    const user = await getUserByEmail(email);
    const admin = await getAdmin(email);

    if (admin && user) {

        user.admin = true;
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

export { getUserByEmail, addUser, addAdmin, getAdmin, setAdminStatus, setUserAuth, getUserByID };