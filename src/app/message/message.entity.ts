import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    primaryKeyConstraintName: 'PK_message',
  })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_message_sender',
  })
  sender: User;

  @Column({ name: 'channel', type: 'text', nullable: true })
  channel: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
