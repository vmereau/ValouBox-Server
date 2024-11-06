import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    primaryKeyConstraintName: 'PK_user',
  })
  id: number;

  @Column({ name: 'name', type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  password: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
