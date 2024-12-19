import { AppDataSource } from '../dataSource';
import { Student } from '../entities/Student';
import { dataEncrypt } from './securityModel';
import argon2 from 'argon2';
import customLogger from '../utils/logging';

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
//
//Searches for a student using the previously declared functions and their resulting data
async function getStudentVariety(searchValue: string): Promise<Student | null> {

    const expectedValue = await argon2.hash(searchValue);

    try{

        //Returns whichever data ends up matching first using 
        return await Promise.any([

            await getStudentByName(expectedValue),
            await getStudentByEmail(expectedValue),
            await getStudentBySID(expectedValue),
            await getStudentByComputer(expectedValue) 

        ]);

    } catch {

        //If a student isn't found, then a null is returned and the failed search is logged
        customLogger.log('information', "Student not found using: " + expectedValue);
        return null

    }

}

//Creates a new student and adds them to the database
async function addStudent(studentId: string, name: string, grade: string, email: string): Promise<Student | null> {

    //Hashes student data that is going to be stored to make searching easier
    const sIDhash = await argon2.hash(studentId);
    const sNhash = await argon2.hash(name);
    const sGhash = await argon2.hash(grade);
    const sEhash = await argon2.hash(email);

    //Verifies that a student doesn't get created if they already exist.
    const student = await getStudentBySID(studentId);

    //If the student exists, the function is ended early and its logged that a duplicate was attempted to be made
    if (student) {

        return student;

    }

    // Create the new user object and saves data through hashing and encryption
    let newStudent = new Student();
    newStudent.studentID = dataEncrypt(studentId);
    newStudent.studentIDHash = sIDhash;
    newStudent.name = dataEncrypt(name);
    newStudent.nameHash = sNhash;
    newStudent.grade = dataEncrypt(grade);
    newStudent.gradeHash = sGhash;
    newStudent.email = dataEncrypt(email);
    newStudent.emailHash = sEhash;

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