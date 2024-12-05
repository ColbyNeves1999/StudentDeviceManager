import { Request, Response } from 'express';
import { addNote, deleteNodeModel } from '../models/noteModel';
import { getStudentByName, getStudentByEmail, getStudentBySID } from '../models/studentModel';
import { getUserByID } from '../models/userModel';

async function makeNote(req: Request, res: Response): Promise<void> {

    const { name, studentID, email } = req.body as noteOptions;

    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
        res.redirect('/login');
        return;
    }

    const user = await getUserByID(req.session.authenticatedUser.userId);
    const { noteText } = req.body as noteOptions;

    let student;
    if (name) {
        student = await getStudentByName(name);
    } else if (studentID) {
        student = await getStudentBySID(studentID);
    } else if (email) {
        student = await getStudentByEmail(email);
    } else {
        res.redirect('/index');
        return;
    }

    const notes = await addNote(noteText, student, user);
    notes.user = undefined;

    res.redirect('/index');
    return;

}

async function deleteNote(req: Request, res: Response): Promise<void> {

    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        res.sendStatus(401); // 401 Unauthorized
        return;
    }

    const { noteID } = req.body as studentPage;

    await deleteNodeModel(noteID);

    //Investigate this more. Why did I do this?
    ///////
    //req.session.curStudent = await getStudentBySID(req.session.curStudent.studentID);

    //let student = await req.session.curStudent;

    //res.render('studentData', { student });
    ///////

    return;
}

export { makeNote, deleteNote };