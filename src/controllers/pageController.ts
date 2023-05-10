import { Request, Response } from 'express';
import { getStudentVariety } from '../models/studentModel';

import { Student } from '../entities/Student';

async function toStudentDataPage(req: Request, res: Response): Promise<void> {

    const { name, studentID, email } = req.body as studentPage;

    let student = new Student();

    if (name || studentID || email) {

        student = await getStudentVariety(email, studentID, name);

    }

    req.session.curStudent = student;

    res.render('studentData', { student });

}

export { toStudentDataPage };