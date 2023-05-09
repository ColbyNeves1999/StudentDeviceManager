import { Request, Response } from 'express';

import { addNote } from '../models/noteModel';
import { setStudentDevice, getStudentVariety } from '../models/studentModel';
import { getUserByID } from '../models/userModel';

async function studentDeviceCheckout(req: Request, res: Response) {

    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {

        res.redirect('/login');
        return;

    }

    const { studentID, email, deviceNumber, name } = req.body as studentComputer;

    let student = await getStudentVariety(email, studentID, name);
    const user = await getUserByID(req.session.authenticatedUser.userId);

    let checkOut;

    if (!student.computerNumber) {
        checkOut = `Checked out ${deviceNumber}`;
    } else {
        checkOut = `Swapped ${student.computerNumber} with ${deviceNumber}`;
    }

    await setStudentDevice(deviceNumber, studentID, email, name);

    await addNote(checkOut, student, user);

    student = await getStudentVariety(email, studentID, name);

    res.render('studentData', { student });
    return;

}

export { studentDeviceCheckout };