import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
export class Authentication {

    @PrimaryColumn()
    user_id: string;

    @Column()
    token: string;

    @Column()
    status: string;
}
