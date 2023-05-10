import { Request, Response } from 'express';
import { grabSheetModel } from '../models/googleSheetModel';

const range = "A2:E";
const spreadsheetId = '1RSfxLHQBe6CRDDRnYgcDF25Lbr2cfQa-YpvJAV0xHUw';

async function grabSheet(req: Request, res: Response): Promise<void> {

    if (!req.session.isLoggedIn || !req.session.authenticatedUser.authToken) {

        res.redirect('/login');
        return;

    }

    await grabSheetModel(spreadsheetId, range, req.session.authenticatedUser.email);

    res.redirect('/index');
    return;

}

export { grabSheet };