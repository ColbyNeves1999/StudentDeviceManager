import { Request, Response } from 'express';

import { setStudentDevice } from '../models/studentModel';

async function studentDeviceCheckout(req: Request, res: Response) {

    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {

        res.redirect('/login');
        return;

    }

    const { studentID, email, deviceNumber, name } = req.body as studentComputer;

    await setStudentDevice(deviceNumber, studentID, email, name);

    res.redirect('/index');
    return;

}

export { studentDeviceCheckout };