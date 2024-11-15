import { User } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from "../channel/channel.entity";

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    primaryKeyConstraintName: 'PK_message',
  })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'sender_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_message_sender',
  })
  sender: User;

  @ManyToOne(() => Channel)
  @JoinColumn({
    name: 'channel_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_message_channel',
  })
  channel: Channel;

  @Column({ name: 'content', type: 'text', nullable: true })
  content: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
