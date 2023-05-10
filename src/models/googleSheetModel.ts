import { addStudent } from "./studentModel";
import { getUserByEmail } from "./userModel";

const API_KEY = process.env.API_KEY;

async function grabSheetModel(spreadsheetId: string, range: string, userEmail: string): Promise<void> {

    const user = await getUserByEmail(userEmail);

    let result = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${API_KEY}&access_token=${user.authCode}`, {
        method: 'GET',
    });

    if (!result.ok) {
        return;
    }

    let data = await result.json();

    const { values } = data as studentData;

    if (values) {

        for (let i = 0; i < values.length; i++) {

            await addStudent(values[i][0], values[i][1], values[i][2], values[i][3], values[i][4])

        }

    }

}

export { grabSheetModel };