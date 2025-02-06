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
export class TokenUtilisateur extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Utilisateur, (utilisateur) => utilisateur.tokenUtilisateur, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn()
    utilisateur!: Utilisateur | null;

    @Column({ type: 'varchar', length: 255 })
    token!: string;

    @Column({ type: 'timestamp' })
    updatedAt!: Date;

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

    getToken(): string {
        return this.token;
    }

    setToken(token: string): this {
        this.token = token;
        return this;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt: Date): this {
        this.updatedAt = updatedAt;
        return this;
    }
}