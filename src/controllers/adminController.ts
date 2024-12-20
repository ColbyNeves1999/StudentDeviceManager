//Controller Calls

//Model Calls
import { Request, Response } from 'express';
import { firstAdminInitializer } from '../models/userModel';
import customLogger from '../utils/logging';

//Entity Calls

//Repository Calls

//.env Calls

async function initializeAdmins(req: Request, res: Response): Promise<void> {

    //Calls for the creation of an admin on server startup
    try{

        firstAdminInitializer();

    }catch(error){

        //Logs a failed call
        customLogger.log('error', error);

    }
}

export { initializeAdmins };