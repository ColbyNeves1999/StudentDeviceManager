import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, JoinColumn } from 'typeorm';

import { Student } from './Student';

@Entity()
export class Notes {

    @PrimaryGeneratedColumn('uuid')
    noteID: string;

    @Column({ unique: true })
    noteText: string;

    @ManyToOne(() => Student, (student) => student, { cascade: ['insert', 'update'] })
    @JoinColumn()
    student: Relation<Student>;

}
