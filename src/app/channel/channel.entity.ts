
import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../user/user.entity";

@Entity({ name: 'channel' })
export class Channel {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    primaryKeyConstraintName: 'PK_channel',
  })
  id: number;

  @Column({ name: 'name', type: 'text', nullable: true })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'creator_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_channel_creator',
  })
  creator: User;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;
}
