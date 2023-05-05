import { Request, Response } from 'express';

const API_KEY = process.env.API_KEY;
const range = process.env.RANGE;
const spreadsheetId = process.env.SPREADSHEETID;

async function grabSheet(req: Request, res: Response): Promise<void> {



    let result = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}&access_token=${req.session.authenticatedUser.authToken}`, {
        method: 'GET',
    });

    if (!result.ok) {
        console.log(res.status);
    }

    let data = await result.json();

    console.log(data);

    res.sendStatus(200);
    return;

}

export { grabSheet };