import { Request, Response } from 'express';

import { firstAdminInitializer } from '../models/userModel';

async function initializeAdmins(req: Request, res: Response): Promise<void> {

    //Calls for the creation of an admin on server startup
    firstAdminInitializer();

}

export { initializeAdmins };