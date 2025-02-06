import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class InscriptionPending extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ length: 255 })
    prenom!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    nom!: string | null;

    @Column('timestamp')
    dateNaissance!: Date;

    @Column()
    genre!: number;

    @Column({ length: 255 })
    mail!: string;

    @Column({ length: 255 })
    motDePasse!: string;

}