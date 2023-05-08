import { Request, Response } from 'express';
import { addNote } from '../models/noteModel';
import { getStudentByName, getStudentByEmail, getStudentBySID } from '../models/studentModel';

async function makeNote(req: Request, res: Response): Promise<void> {

    const { name, studentID, email } = req.body as noteOptions;

    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
        res.redirect('/login');
        return;
    }

    const { noteText } = req.body as noteOptions;

    let student;
    if (name) {
        student = await getStudentByName(name);
    } else if (studentID) {
        student = await getStudentBySID(studentID);
    } else if (email) {
        student = await getStudentByEmail(email);
    } else {
        res.sendStatus(404);
        return;
    }

    const studentNote = await addNote(noteText, student);
    studentNote.student = undefined;

    res.redirect('/index');
    return;

}

export { makeNote };