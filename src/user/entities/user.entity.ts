import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    /** 'admin' | 'super_admin' — default para cuentas existentes al sincronizar */
    @Column({ type: 'varchar', length: 32, default: 'admin' })
    role: string;
}
