import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Config extends BaseEntity {
    @PrimaryGeneratedColumn() id!: number;

    @Column({ length: 255 }) nom!: string;

    @Column({ length: 255 }) valeur!: string;

}