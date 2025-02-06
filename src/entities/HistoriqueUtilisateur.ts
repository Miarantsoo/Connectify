import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
} from 'typeorm';
import { Utilisateur } from './Utilisateur';

@Entity()
export class HistoriqueUtilisateur extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    prenom!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    nom!: string | null;

    @Column({ type: 'timestamp' })
    dateNaissance!: Date;

    @Column({ type: 'int' })
    genre!: number;

    @Column({ type: 'varchar', length: 255 })
    photoProfile!: string

    @Column({ type: 'varchar', length: 255 })
    motDePasse!: string;

    @Column({ type: 'timestamp' })
    updatedAt!: Date;

    getId(): number {
        return this.id;
    }

    setId(id: number): this {
        this.id = id;
        return this;
    }

    getPrenom(): string {
        return this.prenom;
    }

    setPrenom(prenom: string): this {
        this.prenom = prenom;
        return this;
    }

    getNom(): string | null {
        return this.nom;
    }

    setNom(nom: string | null): this {
        this.nom = nom;
        return this;
    }

    getDateNaissance(): Date {
        return this.dateNaissance;
    }

    setDateNaissance(dateNaissance: Date): this {
        this.dateNaissance = dateNaissance;
        return this;
    }

    getGenre(): number {
        return this.genre;
    }

    setGenre(genre: number): this {
        this.genre = genre;
        return this;
    }

    getMotDePasse(): string {
        return this.motDePasse;
    }

    setMotDePasse(motDePasse: string): this {
        this.motDePasse = motDePasse;
        return this;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt: Date): this {
        this.updatedAt = updatedAt;
        return this;
    }

    makeFromUser(utilisateur: Utilisateur, date: Date): this {
        this.id = utilisateur.id;
        this.prenom = utilisateur.prenom;
        this.nom = utilisateur.nom;
        this.dateNaissance = utilisateur.dateNaissance;
        this.genre = utilisateur.genre;
        this.photoProfile = utilisateur.photoProfile;
        this.motDePasse = utilisateur.motDePasse;
        this.updatedAt = date;
        return this;
    }
}