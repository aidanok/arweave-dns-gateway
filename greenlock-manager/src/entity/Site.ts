import "reflect-metadata"
import {Entity, Column, ObjectID, ObjectIdColumn} from "typeorm";

@Entity()
export class Site {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    subject: string;

    @Column("simple-array")
    altnames: string[];

    @Column()
    renewAt: number;

    @Column()
    deletedAt: number;
}
