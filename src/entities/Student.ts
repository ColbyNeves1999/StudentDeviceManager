import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';

import { Notes } from './Notes';

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

    //Hashes exist to make student searching more reliable
    @Column({ unique: true })
    studentIDHash: string;

    @Column({ default: null })
    nameHash: string;

    @Column({ default: null })
    gradeHash: string;

    @Column({ unique: true })
    emailHash: string;

    @Column({ default: null, unique: true })
    computerNumber: string;

    @OneToMany(() => Notes, (notes) => notes.student, { cascade: ['insert', 'update'] })
    notes: Relation<Notes>[];

}
