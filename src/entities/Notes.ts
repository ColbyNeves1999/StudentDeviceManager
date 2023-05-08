import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';

import { Student } from './Student';

@Entity()
export class Notes {

    @PrimaryGeneratedColumn('uuid')
    noteID: string;

    @Column({ unique: true })
    noteText: string;

    @ManyToOne(() => Student, (student) => student.notes, { cascade: ['insert', 'update'] })
    student: Relation<Student>;

}
