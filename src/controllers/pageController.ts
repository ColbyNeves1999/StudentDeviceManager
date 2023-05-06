import { Request, Response } from 'express';
import { getStudentByName } from '../models/studentModel';

import { Student } from '../entities/Student';

async function toStudentDataPage(req: Request, res: Response): Promise<void> {

    const { name } = req.body as studentPage;

    let student = new Student();

    if (name) {

        student = await getStudentByName(name);

    }

    res.render('studentData', { student });

}

export { toStudentDataPage };