import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn} from 'typeorm';
import { Utilisateur } from './Utilisateur';

@Entity()
export class DoubleAuthentification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Utilisateur, utilisateur => utilisateur.doubleAuth, { nullable: true })
    @JoinColumn({ name: "utilisateurId" })
    utilisateur!: Utilisateur | null;

    @Column('int')
    code!: number;

    @Column()
    daty!: Date;

    getId(): number {
        return this.id;
    }

    setId(id: number): this {
        this.id = id;
        return this;
    }

    getUtilisateur(): Utilisateur | null {
        return this.utilisateur;
    }

    setUtilisateur(utilisateur: Utilisateur | null): this {
        this.utilisateur = utilisateur;
        return this;
    }

    getCode(): number {
        return this.code;
    }

    setCode(code: number): this {
        this.code = code;
        return this;
    }

    getDaty(): Date {
        return this.daty;
    }

    setDaty(daty: Date): this {
        this.daty = daty;
        return this;
    }
}