import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';

import { Student } from './Student';

@Entity()
export class Notes {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ unique: true })
    note: string;

    @ManyToOne(() => Student, (student) => student.studentID)
    studentID: Relation<Student[]>;

}
