import { TokenUtilisateur } from '../entities/TokenUtilisateur';
import {AppDataSource} from "../ormConfig";

export const tokenUtilisateurRepository = AppDataSource.getRepository(TokenUtilisateur).extend({
    async findValidCodeByUtilisateur(token: string, validDuration: number): Promise<TokenUtilisateur | null> {
        const now = new Date();
        const validSince = new Date(now.getTime() - validDuration * 1000);

        return this.createQueryBuilder('tu')
            .where('tu.token = :token', { token })
            .andWhere('tu.updated_at >= :validSince', { validSince })
            .getOne();
    }});
