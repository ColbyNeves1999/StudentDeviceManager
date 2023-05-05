import { Request, Response } from 'express';

import { setStudentDevice } from '../models/studentModel';

async function studentDeviceCheckout(req: Request, res: Response) {

    const { studentID, name, deviceNumber } = req.body as studentComputer;

    await setStudentDevice(deviceNumber, studentID, name);

    res.redirect('/index');
    return;

}

export { studentDeviceCheckout };