import { Config } from "../entities/Config";
import { AppDataSource } from "../ormConfig";

export const configRepository = AppDataSource.getRepository(Config).extend({
    findByNom(nom: string): Promise<Config | null> {
        return this.createQueryBuilder("c")
            .where("c.nom = :nom", { nom })
            .getOne();
    },
    async updateConfig(config: Config): Promise<Config> {
        return await this.save(config);
    }
});
