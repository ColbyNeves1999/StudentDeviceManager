import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

}
