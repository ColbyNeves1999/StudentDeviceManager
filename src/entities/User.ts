import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Relation } from 'typeorm';

import { Notes } from './Notes';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    passwordHash: string;

    @Column({ default: false })
    admin: boolean;

    @Column({ default: null })
    authCode: string;

    @Column({ default: null })
    refreshCode: string;

    @ManyToMany(() => Notes, (notes) => notes.user, { cascade: ['insert', 'update'] })
    @JoinTable()
    notes: Relation<Notes>[];

}
