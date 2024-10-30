import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    primaryKeyConstraintName: 'PK_user',
  })
  id: number;

  @Column({ name: 'name', type: 'text', nullable: true })
  name: string;
}
