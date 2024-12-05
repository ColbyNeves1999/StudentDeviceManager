import { Request, Response } from 'express';
import { getStudentVariety } from '../models/studentModel';

async function toStudentDataPage(req: Request, res: Response): Promise<void> {

    const { searchValue } = req.body as studentSearchValue;

    //Searches for a student using the data that was input
    const student = await getStudentVariety(searchValue);

    //If student exists, it brings up their data, otherwise it just returns to search page
    if(student){

        res.render('studentData', { student });

    }else{

        //res.render('', {});

    }

}

export { toStudentDataPage };