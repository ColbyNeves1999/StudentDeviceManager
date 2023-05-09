import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';

import { User } from './User';
import { Student } from './Student';

@Entity()
export class Notes {

    @PrimaryGeneratedColumn('uuid')
    noteID: string;

    @Column({})
    noteText: string;

    @ManyToOne(() => User, (user) => user.notes, { cascade: ['insert', 'update'] })
    user: Relation<User>;

    @ManyToOne(() => Student, (student) => student.notes, { cascade: ['insert', 'update'] })
    student: Relation<Student>;

}
