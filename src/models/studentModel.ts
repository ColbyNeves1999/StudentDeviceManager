import { AppDataSource } from '../dataSource';
import { Student } from '../entities/Student';

const studentRepository = AppDataSource.getRepository(Student);

async function addStudent(studentId: string, name: string, grade: string, email: string, password: string) {

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
    return studentRepository.findOne({ where: { email } });
}

async function getStudentBySID(studentID: string): Promise<Student | null> {
    return studentRepository.findOne({ where: { studentID } });
}

async function setStudentDevice(deviceNumber: string, studentID: string, email: string): Promise<void> {

    let student;

    if (studentID) {

        student = await getStudentBySID(studentID);
        student.computerNumber = deviceNumber;
        await studentRepository.save(student);

    } else if (email) {

        student = await getStudentByEmail(email);
        student.computerNumber = deviceNumber;
        await studentRepository.save(student);
    }

}

export { addStudent, setStudentDevice };