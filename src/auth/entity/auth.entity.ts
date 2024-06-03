import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
export class Authentication {

    @PrimaryColumn('string')
    user_id: string;

    @Column('string')
    token: string;

    @Column('string')
    status: string;
}