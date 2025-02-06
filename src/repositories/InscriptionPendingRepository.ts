import { Repository } from 'typeorm';
import { InscriptionPending } from '../entities/InscriptionPending';
import {AppDataSource} from "../ormConfig";

export class InscriptionPendingRepository extends Repository<InscriptionPending> {

}

export const inscriptionPendingRepository = AppDataSource.getRepository(InscriptionPending).extend(InscriptionPendingRepository);
