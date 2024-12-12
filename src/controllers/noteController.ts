import { Request, Response } from 'express';
import { addNote } from '../models/noteModel';
import { getStudentVariety } from '../models/studentModel';
import { getUserByID } from '../models/userModel';

import customLogger from '../utils/logging';

async function makeNote(req: Request, res: Response): Promise<void> {

    //Verifies that the user is logged in
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
        res.redirect('/login');
        return;
    }

    //Grabs the student search value and note text from call for use
    const { searchValue, noteText } = req.body as noteOptions;

    //Identifies the user and student in order to link the note
    const user = await getUserByID(req.session.authenticatedUser.userId);
    const student = await getStudentVariety(searchValue);
    
    try{

        //Adds the note to the database and associates it with a student and
        //the user who wrote the note.
        await addNote(noteText, student, user);

    }catch(error){

        customLogger.log('error', error);

    }

    //Returns user to note section
    //res.redirect('/');
    return;

}

export { makeNote };