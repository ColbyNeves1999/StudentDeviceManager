import { AppDataSource } from '../dataSource';
import { Student } from '../entities/Student';

const studentRepository = AppDataSource.getRepository(Student);

//Grabs Student Data by Email
async function getStudentByEmail(email: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { email } });
}

//Grabs Student Data by Student ID
async function getStudentBySID(studentID: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { studentID } });
}

//Grabs Student Data by their Name
async function getStudentByName(name: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { name } });
}

//Grabs Student Data by Computer Number
async function getStudentByComputer(computerNumber: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { computerNumber } });
}

//Searches for a student using the previously declared functions and their resulting data
async function getStudentVariety(searchValue: string): Promise<Student | null> {

    //Returns whichever data ends up being the most accurate
    return (

         await getStudentByName(searchValue) 
      || await getStudentByEmail(searchValue) 
      || await getStudentBySID(searchValue) 
      || await getStudentByComputer(searchValue) 
      || null

    );

}

//Creates a new student and adds them to the database
async function addStudent(studentId: string, name: string, grade: string, email: string): Promise<Student | null> {

    //Verifies that a student doesn't get created if they already exist.
    const student = await getStudentBySID(studentId);

    //If the student exists, the function is ended early
    if (student) {

        return student;

    }

    // Create the new user object and saves data
    let newStudent = new Student();
    newStudent.studentID = studentId;
    newStudent.name = name;
    newStudent.grade = grade;
    newStudent.email = email;

    newStudent = await studentRepository.save(newStudent);

    //Returns the new student's object
    return newStudent;

}

//Assigns the device number to a student
async function setStudentDevice(deviceNumber: string, searchValue: string): Promise<null> {

    //Looks for a student
    let student = await getStudentVariety(searchValue);
    
    //If the student exists then their computer is assigned to them and saved
    if (student) {
        student.computerNumber = deviceNumber;
        await studentRepository.save(student);
    }

    return null;

}

export { addStudent, setStudentDevice, getStudentByName, getStudentByEmail, getStudentBySID, getStudentVariety, getStudentByComputer };