import { Request, Response } from 'express';
import { getStudentVariety, getStudentByComputer } from '../models/studentModel';

import { Student } from '../entities/Student';

async function toStudentDataPage(req: Request, res: Response): Promise<void> {

    const { name, studentID, email } = req.body as studentPage;

    let student = new Student();

    if (name || studentID || email) {

        student = await getStudentVariety(email, studentID, name);

    }

    //Investigate this more. Why did I do this?
    //req.session.curStudent = student;

    res.render('studentData', { student });

}

async function toStudentFromComputer(req: Request, res: Response): Promise<void> {

    const { computerNumber } = req.body as studentPage;

    let student = new Student();

    if (computerNumber) {

        student = await getStudentByComputer(computerNumber);

    }
    
    //Investigate this more. Why did I do this?
    //req.session.curStudent = student;

    res.render('studentData', { student });

}
export { toStudentDataPage, toStudentFromComputer };