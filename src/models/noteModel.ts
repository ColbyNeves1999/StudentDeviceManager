//Controller Calls

//Model Calls
import { AppDataSource } from '../dataSource';

//Entity Calls
import { Student } from '../entities/Student';
import { User } from '../entities/User';
import { Notes } from '../entities/Notes';

//Repository Calls
const noteRepository = AppDataSource.getRepository(Notes);

//.env Calls

async function addNote(noteText: string, student: Student, user: User): Promise<Notes> {

    let newNotes = new Notes();
    newNotes.noteText = noteText;
    newNotes.student = student;
    newNotes.user = user;

    newNotes = await noteRepository.save(newNotes);

    return newNotes;

}

async function getNoteById(noteID: string): Promise<Notes> {

    return await noteRepository.findOne({ where: { noteID } });

}

export { addNote, getNoteById };