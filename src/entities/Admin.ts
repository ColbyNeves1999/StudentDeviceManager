import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Admin {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ unique: true })
    email: string;

}
