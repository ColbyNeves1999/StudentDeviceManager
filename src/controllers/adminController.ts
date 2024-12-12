import { Request, Response } from 'express';

import { firstAdminInitializer } from '../models/userModel';
import customLogger from '../utils/logging';

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