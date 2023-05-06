import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Relation } from 'typeorm';

import { Notes } from './Notes';

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @OneToMany(() => Notes, (note) => note.studentID)
    @JoinColumn()
    studentID: Relation<Notes>;

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
