import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
  } from 'typeorm';
  import { Category } from '../../category/entities/category.entity';

  export enum FileType {
    PDF = 'pdf',
    IMAGE = 'image',
    DOC = 'doc',
    OTHER = 'other',
  }
  
  @Entity('files')
  @Index(['category', 'createdAt'])
  @Index(['type'])
  export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    filePath: string;
  
    //tipo de archivo
    @Column({
      type: 'enum',
      enum: FileType,
      default: FileType.OTHER,
    })
    type: FileType;
  
    //opcional pero MUY útil
    @Column({ nullable: true })
    mimeType?: string;
  
    //opcional pero recomendado
    @Column({ nullable: true })
    size?: number; // bytes
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => Category, (category) => category.files, {
      nullable: false,
      onDelete: 'CASCADE',
    })
    category: Category;
  }