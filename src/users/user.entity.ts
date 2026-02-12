import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @Column({ default: true })
  admin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User: ', this.id);
  }
}
