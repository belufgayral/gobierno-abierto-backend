import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { File } from '../../file/entities/file.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => File, (file) => file.category)
  files: File[];
}