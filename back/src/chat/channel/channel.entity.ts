import { Entity, Column, PrimaryColumn, BeforeInsert, AfterLoad } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class Channel {
	@PrimaryColumn({ unique: true })
	channelName: string;

	@Column({ nullable: true })
	password: string;

	@Column({ default: true })
	isPublic: boolean;

	@Column({ default: false })
	isProtected: boolean;

	@Column("int", {nullable: true})
	owner: number;
	
	@Column("int", {nullable: true, array: true})
	messagesHistory: number[];

	@Column("int", {nullable: true, array: true})
	admins: number[];

	@Column("int", {nullable: true, array: true})
	users: number[];

	@Column("int", {nullable: true, array: true})
	banList: number[];

	@Column("int", {nullable: true, array: true})
	muteList: number[];
	
	@Column("int", {nullable: true, array: true})
	kickList: number[];

   	@BeforeInsert()
   	async hashPassword() {
    	if (this.password)
				this.password = await bcrypt.hash(this.password, 10);
	}
}
