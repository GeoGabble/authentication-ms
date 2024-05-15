import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(["user_id"])
export class Authentication {

    @PrimaryColumn()
    user_id: string;

    @Column()
    token: string;

    @Column()
    status: string;
}