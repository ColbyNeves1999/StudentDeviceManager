import { Request, Response } from 'express';
import { addStudent } from '../models/studentModel';

const API_KEY = process.env.API_KEY;
const range = "A2:E";
const spreadsheetId = '1RSfxLHQBe6CRDDRnYgcDF25Lbr2cfQa-YpvJAV0xHUw';

async function grabSheet(req: Request, res: Response): Promise<void> {

    let result = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}&access_token=${req.session.authenticatedUser.authToken}`, {
        method: 'GET',
    });

    if (!result.ok) {
        console.log(res.status);
    }

    let data = await result.json();

    const { values } = data as studentData;
    //console.log(values[0][0]);

    for (let i = 0; i < values.length; i++) {

        await addStudent(values[i][0], values[i][1], values[i][2], values[i][3], values[i][4])

    }

    //console.log(data);

    res.redirect('/index');
    return;

}

export { grabSheet };