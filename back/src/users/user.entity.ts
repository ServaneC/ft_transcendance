import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {

    // --------------- //
    //   USER PROFILE  //
    // --------------- //

  @PrimaryColumn( {unique: true} )
  id: number;
  
  @Column({unique: true})
  userName: string;
  
  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  inGame: boolean;

  @Column({nullable: true})
  avatar: string;

    // -------------------- //
    // MATCHES & GAME STATS //
    // -------------------- //

  @Column("int", {nullable: true, default : 1000})
  ladderLevel: number;

  @Column("int", {nullable: true, array: true})
  achievements: number[];

    // --------------- //
    // USERS RELATIONS //
    // --------------- //

  @Column("int", {nullable: true, array: true})
  friends: number[];

  @Column("int", {nullable: true, array: true})
  blockedUsers: number[];

  @Column("bool", { default: false })
  isWebsiteOwner: boolean;

  @Column("bool", { default: false })
  isWebsiteAdmin: boolean;

  @Column("bool", { default: false})
  isPermaBan: boolean;
  
    // -------------------------- //
    // TWO FACTOR AUTHENTICATION  //
    // -------------------------- //

  @Column({ nullable: true })
  twoFAuthSecret?: string;

  @Column({ default: false })
  public isTwoFAuthEnabled: boolean;

}