import { DoubleAuthentification } from "../entities/DoubleAuthentification";
import { AppDataSource } from "../ormConfig";


export const doubleAuthRepository = AppDataSource.getRepository(DoubleAuthentification).extend({
    saveDoubleAuthentification(doubleAuth: DoubleAuthentification): Promise<DoubleAuthentification> {
        return this.save(doubleAuth); // No flush needed
    },
    findValidCodeByUtilisateur(idUtilisateur: number, validDuration: number): Promise<DoubleAuthentification | null> {
        const validSince = new Date(Date.now() - validDuration * 1000);

        return this.createQueryBuilder("da")
            .innerJoin("da.utilisateur", "u")
            .where("u.id = :idUtilisateur", { idUtilisateur })
            .andWhere("da.daty >= :validSince", { validSince })
            .getOne();
    }
});
