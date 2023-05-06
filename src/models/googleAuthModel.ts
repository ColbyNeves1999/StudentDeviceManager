import { AppDataSource } from '../dataSource';
import querystring from 'querystring';
import { User } from '../entities/User';
import { setUserAuth } from '../models/userModel';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const userRepository = AppDataSource.getRepository(User);

async function refreshTokens(): Promise<void> {

    if (userRepository) {

        const allUsers = await userRepository.find();
        const size = await userRepository.count()

        for (let i = 0; i < size; i++) {

            if (allUsers[i].authCode && allUsers[i].refreshCode) {

                var myObj = {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: allUsers[i].refreshCode,
                }

                var myJSON = querystring.stringify(myObj);

                const fetchResponse = await fetch('https://www.googleapis.com/oauth2/v3/token', {
                    method: 'POST',
                    body: myJSON,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const resJson = await fetchResponse.json();

                const { access_token } = resJson as userGoogleIngo;
                await setUserAuth(allUsers[i].email, access_token, allUsers[i].refreshCode);


            }

        }

    }

}

export { refreshTokens };