import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Student {

    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true, default: "" })
    computerNumber: string;

    @Column({ unique: true })
    studentID: string;

}
