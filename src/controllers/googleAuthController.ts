import { Request, Response } from 'express';
import querystring from 'querystring';
import { getUserByEmail, setUserAuth } from '../models/userModel';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

async function googleAuthorization(req: Request, res: Response): Promise<void> {

    const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    var myObj = {
        scope: scope,
        access_type: 'offline',
        include_granted_scopes: true,
        response_type: 'code',
        state: 'state_parameter_passthrough_value',
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
    }

    const myJSON = querystring.stringify(myObj);

    //Redirects to Google
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?` + myJSON);
    return;

}

async function callBack(req: Request, res: Response): Promise<void> {

    var code = req.query.code as string || null;

    console.log(code);

    let fetchResponse;

    try {

        var myObj = {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
        }

        var myJSON = querystring.stringify(myObj);

        fetchResponse = await fetch('https://www.googleapis.com/oauth2/v3/token', {
            method: 'POST',
            body: myJSON,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    } catch (error) {
        res.sendStatus(409);
        return;
    }

    const resJson = await fetchResponse.json();

    const { access_token, refresh_token } = resJson as userGoogleIngo;

    let user = await getUserByEmail(req.session.authenticatedUser.email);

    await setUserAuth(user.email, access_token, refresh_token);
    req.session.authenticatedUser.authToken = access_token;
    req.session.authenticatedUser.refreshToken = refresh_token;

    console.log(resJson);

    res.redirect('/index');
    return;

}

export { googleAuthorization, callBack };