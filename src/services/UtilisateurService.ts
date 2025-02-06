import { Utilisateur } from '../entities/Utilisateur';
import { createHash } from 'crypto';
import {utilisateurRepository} from "../repositories/UtilisateurRepository";
import {utilisateurService} from "../config/services";
import {HistoriqueUtilisateur} from "../entities/HistoriqueUtilisateur";
import {historiqueUtilisateurRepository} from "../repositories/HistoriqueUtilisateurRepository";
import {firestore} from "../config/firebase";

export class UtilisateurService {
    hashPassword(user: Utilisateur): void {
        // @ts-ignore
        const hashedPassword = createHash('sha256').update(user.mdpSimple).digest('hex');
        user.motDePasse = hashedPassword;
    }

    getUpdatedFields(oldUser: Utilisateur, newUser: Utilisateur): string[] {
        const updatedFields: string[] = [];

        if (oldUser.prenom !== newUser.prenom) updatedFields.push('prenom');
        if (oldUser.nom !== newUser.nom) updatedFields.push('nom');
        if (oldUser.dateNaissance !== newUser.dateNaissance) updatedFields.push('dateNaissance');
        if (oldUser.genre !== newUser.genre) updatedFields.push('genre');

        if (newUser.mdpSimple) {
            this.hashPassword(newUser);
            if (oldUser.motDePasse !== newUser.motDePasse) updatedFields.push('mdp');
        }

        return updatedFields;
    }
}

export async function updateUserById(id: number, updates: Partial<Utilisateur>): Promise<string> {
    const user = await utilisateurRepository.findOne({ where: { id } });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }

    const oldUser: Utilisateur = Object.assign({}, user);

    Object.assign(user, updates);

    const updatedFields = utilisateurService.getUpdatedFields(oldUser, user);
    let message = "Aucun changement effectué";

    if (updatedFields.length > 0) {
        await utilisateurRepository.save(user);

        await firestore.collection('utilisateur').doc(String(user.id)).update({
            nom: user.nom,
            prenom: user.prenom,
            dateNaissance: new Date(user.dateNaissance),
            genre: user.genre,
            photoProfile: user.photoProfile,
            mail: user.mail,
            motDePasse: user.motDePasse,
        });

        const historique = new HistoriqueUtilisateur();
        historique.makeFromUser(user, new Date(new Date().getTime() + 3 * 60 * 60 * 1000));
        await historiqueUtilisateurRepository.save(historique);

        message = "Informations de l'utilisateur modifiées avec succès.";
    }

    return message;
}
