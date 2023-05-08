import { AppDataSource } from '../dataSource';
import { Student } from '../entities/Student';
import { Notes } from '../entities/Notes';

const noteRepository = AppDataSource.getRepository(Notes);

async function addNote(noteText: string, student: Student): Promise<Notes> {

    let newNotes = new Notes();
    newNotes.noteText = noteText;
    newNotes.student = student;

    newNotes = await noteRepository.save(newNotes);

    return newNotes;

}

export { addNote };