import { Repository } from 'typeorm';
import { HistoriqueUtilisateur } from '../entities/HistoriqueUtilisateur';
import {AppDataSource} from "../ormConfig";

export class HistoriqueUtilisateurRepository extends Repository<HistoriqueUtilisateur> {

}

export const historiqueUtilisateurRepository = AppDataSource.getRepository(HistoriqueUtilisateur).extend(HistoriqueUtilisateurRepository);
