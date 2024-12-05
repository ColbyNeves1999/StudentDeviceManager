import { Request, Response } from 'express';

import { firstAdminInitializer } from '../models/userModel';

async function initializeAdmins(req: Request, res: Response): Promise<void> {

    //Verifies that a user with that email doesn't already exist
    firstAdminInitializer();

    //Redirects to primary drop page
    res.redirect('/index');

}

export { initializeAdmins };