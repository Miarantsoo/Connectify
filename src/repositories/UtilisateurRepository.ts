import { AppDataSource } from "../ormConfig";
import { Utilisateur } from "../entities/Utilisateur";

export const utilisateurRepository = AppDataSource.getRepository(Utilisateur).extend({
    findByLogin: async function(mail: string): Promise<Utilisateur | null> {
        return await this.findOne({ where: { mail } });
    },
    findById: async function(id: number): Promise<Utilisateur | null> {
        return await this.findOne({ where: { id } });
    },
    findAll: async function(): Promise<Utilisateur[] | null> {
        return await this.find();
    }
});