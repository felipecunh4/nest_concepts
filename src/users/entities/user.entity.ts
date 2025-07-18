import { IsEmail } from 'class-validator';
import { ERoutePolicies } from 'src/auth/enums/route-policies.enum';
import { Message } from 'src/message/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, msg => msg.from)
  msgSent: Message[];

  @OneToMany(() => Message, msg => msg.to)
  msgReceived: Message[];

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'simple-array', default: [] })
  roles: ERoutePolicies[];
}
