import { LoginTentative } from "../entities/LoginTentative";
import { AppDataSource } from "../ormConfig";

export const loginTentativeRepository = AppDataSource.getRepository(LoginTentative).extend( {
    async updateLoginTentative(loginTentative: LoginTentative): Promise<LoginTentative> {
        return await this.save(loginTentative);
    },
    async findById(id: number): Promise<LoginTentative | null> {
        return await this.findOne({ where: { id } });
    },
    async getLastByIdUtilisateur(idUtilisateur: number): Promise<LoginTentative | null> {
        return await this.createQueryBuilder("lt")
            .innerJoin("lt.utilisateur", "u")
            .where("u.id = :idUtilisateur", { idUtilisateur })
            .orderBy("lt.id", "DESC")
            .limit(1)
            .getOne();
    }
});
