import { AppDataSource } from '../dataSource';
import { Student } from '../entities/Student';

const studentRepository = AppDataSource.getRepository(Student);

async function addStudent(studentId: string, name: string, grade: string, email: string, password: string): Promise<Student | null> {

    const student = await getStudentBySID(studentId);

    if (student) {

        return null;

    }

    // Create the new user object and saves data
    let newStudent = new Student();
    newStudent.studentID = studentId;
    newStudent.name = name;
    newStudent.grade = grade;
    newStudent.email = email;
    newStudent.password = password;

    newStudent = await studentRepository.save(newStudent);

    return newStudent;

}

async function getStudentByEmail(email: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { email } });
}

async function getStudentBySID(studentID: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { studentID } });
}

async function getStudentByName(name: string): Promise<Student | null> {
    return await studentRepository.findOne({ relations: ['notes'], where: { name } });
}

async function getStudentVariety(email: string, studentID: string, name: string): Promise<Student | null> {

    let student;

    if (studentID) {

        student = await getStudentBySID(studentID);

    } else if (name) {

        student = await getStudentByName(name);

    } else if (email) {

        student = await getStudentByEmail(email);

    }

    return student;

}

async function setStudentDevice(deviceNumber: string, studentID: string, email: string, name: string): Promise<Student> {

    let student = await getStudentVariety(email, studentID, name);
    if (student) {
        student.computerNumber = deviceNumber;
        await studentRepository.save(student);
    }

    return student;

}

export { addStudent, setStudentDevice, getStudentByName, getStudentByEmail, getStudentBySID, getStudentVariety };