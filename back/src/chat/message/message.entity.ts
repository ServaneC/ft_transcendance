import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	channelName: string;

	@Column("int")
	owner: number;

	@Column("varchar")
	message: string;

	// @Column("timestamp") // ca bugge pour l'instant mais il faut le garder
	// date: number;

	@Column("varchar")   // pas lisible, ca donne juste le nb de millisec passées depuis 1970
	dateStr: string;
}
