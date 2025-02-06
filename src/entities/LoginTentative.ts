import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { Utilisateur } from './Utilisateur';

@Entity()
export class LoginTentative extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Utilisateur, (utilisateur) => utilisateur.tentative, {
        cascade: true,
        nullable: false,
    })
    @JoinColumn()
    utilisateur!: Utilisateur;

    @Column({ type: 'int' })
    tentative!: number;

    getId(): number {
        return this.id;
    }

    setId(id: number): this {
        this.id = id;
        return this;
    }

    getUtilisateur(): Utilisateur {
        return this.utilisateur;
    }

    setUtilisateur(utilisateur: Utilisateur): this {
        this.utilisateur = utilisateur;
        return this;
    }

    getTentative(): number {
        return this.tentative;
    }

    setTentative(tentative: number): this {
        this.tentative = tentative;
        return this;
    }
}