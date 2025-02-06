import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { DoubleAuthentification } from './DoubleAuthentification';
import { LoginTentative } from './LoginTentative';
import {TokenUtilisateur} from "./TokenUtilisateur";

@Entity()
export class Utilisateur extends BaseEntity {
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
    mail!: string;

    @Column({ type: 'varchar', length: 255 })
    motDePasse!: string;

    mdpSimple!: string | null;

    tentative!: LoginTentative | null;

    @OneToMany(
        () => DoubleAuthentification,
        (doubleAuth) => doubleAuth.utilisateur,
    )
    doubleAuth!: DoubleAuthentification[];

    @OneToOne(() => TokenUtilisateur, (token) => token.utilisateur)
    tokenUtilisateur!: TokenUtilisateur | null;

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

    getMail(): string {
        return this.mail;
    }

    setMail(mail: string): this {
        this.mail = mail;
        return this;
    }

    getMotDePasse(): string {
        return this.motDePasse;
    }

    setMotDePasse(motDePasse: string): this {
        this.motDePasse = motDePasse;
        return this;
    }

    getMdpSimple(): string | null {
        return this.mdpSimple;
    }

    setMdpSimple(mdpSimple: string | null): this {
        this.mdpSimple = mdpSimple;
        return this;
    }

    getPassword(): string {
        return this.motDePasse;
    }

    getTentative(): LoginTentative | null {
        return this.tentative;
    }

    setTentative(tentative: LoginTentative): this {
        if (tentative.utilisateur !== this) {
            tentative.utilisateur = this;
        }
        this.tentative = tentative;
        return this;
    }

    getDoubleAuth(): DoubleAuthentification[] {
        return this.doubleAuth;
    }

    addDoubleAuth(doubleAuth: DoubleAuthentification): this {
        if (!this.doubleAuth.includes(doubleAuth)) {
            this.doubleAuth.push(doubleAuth);
            doubleAuth.utilisateur = this;
        }
        return this;
    }

    removeDoubleAuth(doubleAuth: DoubleAuthentification): this {
        const index = this.doubleAuth.indexOf(doubleAuth);
        if (index !== -1) {
            this.doubleAuth.splice(index, 1);
            if (doubleAuth.utilisateur === this) {
                doubleAuth.utilisateur = null;
            }
        }
        return this;
    }

    copy(): Utilisateur {
        const newUser = new Utilisateur();
        newUser.id = this.id;
        newUser.prenom = this.prenom;
        newUser.nom = this.nom;
        newUser.dateNaissance = this.dateNaissance;
        newUser.genre = this.genre;
        newUser.mail = this.mail;
        newUser.motDePasse = this.motDePasse;
        return newUser;
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            nom: this.nom,
            prenom: this.prenom,
            dateNaissance: this.dateNaissance,
            genre: this.genre,
            photoProfile: this.photoProfile,
            mail: this.mail,
        };
    }
}