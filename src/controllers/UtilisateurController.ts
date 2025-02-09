import { Request, Response } from "express";
import { utilisateurRepository } from "../repositories/UtilisateurRepository";
import { inscriptionPendingRepository } from "../repositories/InscriptionPendingRepository";
import { historiqueUtilisateurRepository } from "../repositories/HistoriqueUtilisateurRepository";
import { loginTentativeRepository } from "../repositories/LoginTentativeRepository";
import { tokenUtilisateurRepository } from "../repositories/TokenUtilisateurRepository";
import { doubleAuthRepository } from "../repositories/DoubleAuthentificationRepository";
import {EmailService} from "../services/EmailService";
import {EmailSubject} from "../enum/EnumSubject";
import {InscriptionPending} from "../entities/InscriptionPending";
import { createHash } from 'crypto';
import {ResponseService} from "../services/ResponseService";
import { TokenUtilisateur } from "../entities/TokenUtilisateur";
import { Utilisateur } from "../entities/Utilisateur";
import {HistoriqueUtilisateur} from "../entities/HistoriqueUtilisateur";
import { LoginTentative } from "../entities/LoginTentative";
import {
    configService,
    utilisateurService,
    jwtTokenManager
} from '../config/services';
import { firestore } from "../config/firebase";
import {updateUserById} from "../services/UtilisateurService";

export class UtilisateurController {


    static async signup(req: Request, res: Response): Promise<object> {
        try {
            const { prenom, nom, mail, genre, dateNaissance, motDePasse, verification } = req.body;

            const verifUser = await inscriptionPendingRepository.findOne({ where: { mail } });
            if (verifUser) {
                const json: object = { message: "Email déjà inscrit" };
                return res.status(500).json(ResponseService.getJSONTemplate("error", json));
            }

            if (motDePasse !== verification) {
                const json: object = {message: "Veuillez bien vérifier votre mot de passe" }
                return res.status(500).json(ResponseService.getJSONTemplate('error', json));
            }

            const hashedPassword = createHash('sha256').update(motDePasse).digest('hex');

            const user = new InscriptionPending();
            user.prenom = prenom;
            user.nom = nom;
            user.mail = mail;
            user.genre = genre;
            user.dateNaissance = new Date(dateNaissance);
            user.motDePasse = hashedPassword;

            await inscriptionPendingRepository.save(user);

            const email: EmailService = new EmailService();
            await email.createMail(mail, EmailSubject.INSCRIPTION, user.id);

            const json: object = { message: "Veuillez confirmer votre inscription dans votre boîte mail" }
            return res.json(ResponseService.getJSONTemplate('success', json));
        } catch (error) {
            const json: object = { message: "Une erreur s'est produite durant le processus, veuillez réessayer"+error }
            return res.status(500).json(ResponseService.getJSONTemplate('error', json));
        }
    }

    static async signupValidation(req: Request, res: Response): Promise<object> {
        try {
            const { id } = req.params;
            const inscriptionPending = await inscriptionPendingRepository.findOne({ where: { id: Number(id) } });

            if (!inscriptionPending) {
                return res.status(400).json(ResponseService.getJSONTemplate("error", {
                    message: "Inscription inexistant, veuillez bien verifier votre lien"
                }));
            }

            const existingUser = await utilisateurRepository.findOne({ where: { mail: inscriptionPending.mail } });
            if (existingUser) {
                return res.status(400).json(ResponseService.getJSONTemplate("error", {
                    message: "Utilisateur déjà inscrit, votre lien n'est plus valide"
                }));
            }

            const newUser = new Utilisateur();
            newUser.nom = inscriptionPending.nom;
            newUser.prenom = inscriptionPending.prenom;
            newUser.dateNaissance = inscriptionPending.dateNaissance;
            newUser.genre = inscriptionPending.genre;
            newUser.photoProfile = 'blank-profile_dshuxw';
            newUser.mail = inscriptionPending.mail;
            newUser.motDePasse = inscriptionPending.motDePasse;
            await utilisateurRepository.save(newUser);
            
            console.log("zioefh");

            await firestore.collection('utilisateur').doc(String(newUser.id)).set({
                nom: newUser.nom,
                prenom: newUser.prenom,
                dateNaissance: newUser.dateNaissance,
                genre: newUser.genre,
                photoProfile: newUser.photoProfile,
                mail: newUser.mail,
                motDePasse: newUser.motDePasse,
            });

            const historique = new HistoriqueUtilisateur();
            historique.makeFromUser(newUser, new Date());
            await historiqueUtilisateurRepository.save(historique);

            const tentative = new LoginTentative();
            tentative.utilisateur = newUser;
            tentative.tentative = 3;
            await loginTentativeRepository.save(tentative);

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Inscription validée, bienvenue parmis nous. veuillez vous connectez"
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la validation de l'inscription: " + error
            }));
        }
    }

    static async login(req: Request, res: Response): Promise<object> {
        try {
            const { email, mdp } = req.body;
            const user = await utilisateurRepository.findByLogin(email);

            if (!user) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Utilisateur inexistant"
                }));
            }

            const hashMdp = createHash('sha256').update(mdp).digest('hex');
            const tentative = await loginTentativeRepository.getLastByIdUtilisateur(user.id);

            // @ts-ignore
            if (user.motDePasse === hashMdp && tentative.tentative > 1) {
                const existingCode = await doubleAuthRepository.findValidCodeByUtilisateur(
                    user.id,
                    Number(await configService.getDelaisRef())
                );

                if (!existingCode) {
                    const emailService = new EmailService();
                    await emailService.createMail(user.mail, EmailSubject.AUTHENTICATION, user.id);

                    return res.json(ResponseService.getJSONTemplate("success", {
                        message: "Un email de confirmation a été envoyé",
                        data: user.id
                    }));
                }

                return res.status(400).json(ResponseService.getJSONTemplate("error", {
                    message: "Le code envoyé précédement est encore valide"
                }));
            }

            // @ts-ignore
            if (tentative.tentative === 1) {
                const emailService = new EmailService();
                await emailService.createMail(user.mail, EmailSubject.RESET, user.id);

                return res.status(400).json(ResponseService.getJSONTemplate("error", {
                    message: "Un email de réinitialisation a été envoyé ou encore non confirmé"
                }));
            }

            // @ts-ignore
            tentative.tentative--;
            // @ts-ignore
            await loginTentativeRepository.save(tentative);

            return res.status(400).json(ResponseService.getJSONTemplate("error", {
                // @ts-ignore
                message: `Mot de passe Incorrecte. Tentative restante: ${tentative.tentative}`
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la connexion: " + error
            }));
        }
    }

    static async checkPin(req: Request, res: Response): Promise<object> {
        try {
            const { id } = req.params;
            const { code } = req.body;

            const doubleAuth = await doubleAuthRepository.findValidCodeByUtilisateur(
                Number(id),
                Number(await configService.getDelaisRef())
            );

            const tentative = await loginTentativeRepository.getLastByIdUtilisateur(Number(id));
            const user = await utilisateurRepository.findById(Number(id));

            // @ts-ignore
            if (doubleAuth?.code === Number(code) && tentative.tentative > 0) {
                // @ts-ignore
                tentative.tentative = Number(await configService.getTentativeRef());
                // @ts-ignore
                await loginTentativeRepository.save(tentative);

                const token = jwtTokenManager.createToken({}, 3600);
                let tokenUtilisateur = await tokenUtilisateurRepository.findOne({
                    // @ts-ignore
                    where: { utilisateur: { id: user.id } }
                });

                if (!tokenUtilisateur) {
                    tokenUtilisateur = new TokenUtilisateur();
                    tokenUtilisateur.utilisateur = user;
                }

                tokenUtilisateur.token = token;
                tokenUtilisateur.updatedAt = new Date();
                await tokenUtilisateurRepository.save(tokenUtilisateur);
                // @ts-ignore
                const lastCode = await doubleAuthRepository.findLastValidCodeByUtilisateur(user.id)
                if (lastCode){
                    console.log(lastCode)
                    lastCode.daty = new Date(2020, 0, 1);
                    await doubleAuthRepository.update({ id: lastCode.id }, lastCode);
                }

                return res.json(ResponseService.getJSONTemplate("success", {
                    message: "Connecté(e) avec succès",
                    data: token
                }));
            }

            // @ts-ignore
            if (tentative.tentative === 1) {
                const emailService = new EmailService();
                // @ts-ignore
                await emailService.createMail(user.mail, EmailSubject.RESET, user.id);
                // @ts-ignore
                const lastCode = await doubleAuthRepository.findLastValidCodeByUtilisateur(user.id)
                if (lastCode){
                    console.log(lastCode)
                    lastCode.daty = new Date(2020, 0, 1);
                    await doubleAuthRepository.update({ id: lastCode.id }, lastCode);
                }
                return res.status(400).json(ResponseService.getJSONTemplate("error", {
                    message: "Un email de réinitialisation a été envoyé"
                }));
            }

            // @ts-ignore
            tentative.tentative--;
            // @ts-ignore
            await loginTentativeRepository.save(tentative);

            return res.status(400).json(ResponseService.getJSONTemplate("error", {
                // @ts-ignore
                message: `Code PIN invalide. Tentative restante: ${tentative.tentative}`
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la vérification du code: " + error
            }));
        }
    }

    static async updateUser(req: Request, res: Response): Promise<object> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const message = await updateUserById(Number(id), updates);

            return res.json(ResponseService.getJSONTemplate("success", { message }));
        } catch (error: any) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la mise à jour: " + error.message
            }));
        }
    }

    static async resetTentative(req: Request, res: Response): Promise<object> {
        try {
            const { id } = req.params;
            const tentative = await loginTentativeRepository.getLastByIdUtilisateur(Number(id));

            if (!tentative) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Tentative non trouvée"
                }));
            }

            tentative.tentative = Number(await configService.getTentativeRef());
            await loginTentativeRepository.save(tentative);

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Nombre de tentatives réinitialisé avec succès"
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la réinitialisation: " + error
            }));
        }
    }

    static async getUserByToken(req: Request, res: Response): Promise<object> {
        try {
            const token = jwtTokenManager.extractTokenFromRequest(req);
            if (!token) {
                return res.status(401).json(ResponseService.getJSONTemplate("error", {
                    message: "Token non fourni"
                }));
            }
            const validate=await tokenUtilisateurRepository.findValidCodeByUtilisateur(
                token,
                Number(await configService.getTokenRef())
            );
            if (validate?.token === undefined) {
                return res.status(401).json(ResponseService.getJSONTemplate("error", {
                    message: "Votre token n'est plus valide"
                }));
            }
            const tokenUtilisateur = await tokenUtilisateurRepository.findOne({
                where: { token },
                relations: ["utilisateur"]
            });

            if (!tokenUtilisateur?.utilisateur) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Utilisateur non trouvé"
                }));
            }

            console.log(tokenUtilisateur.utilisateur)
            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Identification réussie",
                data: tokenUtilisateur.utilisateur
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la récupération: " + error
            }));
        }
    }

    static getAllUtilisateurs = async (req: Request, res: Response) => {
        try {
            const utilisateurs = await utilisateurRepository.find();
            res.json(utilisateurs);
        } catch (error) {
            console.error("Error fetching utilisateurs:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static getUtilisateurById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const utilisateur = await utilisateurRepository.findOneBy({ id: parseInt(id) });
            
            if (!utilisateur) {
                return res.status(404).json({ message: "Utilisateur not found" });
            }
            
            res.json(utilisateur);
        } catch (error) {
            console.error("Error fetching utilisateur:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static async getUserById(req: Request, res: Response): Promise<object> {
        try {
            const { id } = req.params;
            const user = await utilisateurRepository.findById(Number(id));

            if (!user) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Utilisateur non trouvé"
                }));
            }

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Utilisateur trouvé",
                data: user
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la récupération: " + error
            }));
        }
    }

    static async identifyAdmin(req: Request, res: Response) {
        try {
            const { email, mdp } = req.body;
            console.log(`Email: ${email}, Mdp: ${mdp}`);
            if (email == "admin" && mdp == "admin") {
                return res.status(200).json(ResponseService.getJSONTemplate("success", {
                    message: "Admin identifié avec succès",
                }));
            } else {
                return res.status(500).json(ResponseService.getJSONTemplate("error", {
                    message: "Identifiant ou mot de passe incorrect"
                }));
            }
        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors du login admin: " + error
            }));
        }
    }
}