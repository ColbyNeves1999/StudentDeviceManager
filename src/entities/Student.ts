import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ unique: true })
    studentID: string;

    @Column({ default: null })
    name: string;

    @Column({ default: null })
    grade: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    password: string;


    @Column({ default: null, unique: true })
    computerNumber: string;

}
