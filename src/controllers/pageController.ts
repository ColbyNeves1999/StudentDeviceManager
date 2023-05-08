import { Request, Response } from 'express';
import { getStudentByName, getStudentBySID, getStudentByEmail } from '../models/studentModel';

import { Student } from '../entities/Student';

async function toStudentDataPage(req: Request, res: Response): Promise<void> {

    const { name, studentID, email } = req.body as studentPage;

    let student = new Student();

    if (name) {

        student = await getStudentByName(name);

    } else if (studentID) {
        student = await getStudentBySID(studentID);
    } else if (email) {
        student = await getStudentByEmail(email);
    }

    console.log("I'm trying here", student.note.length();

    res.render('studentData', { student });

}

export { toStudentDataPage };