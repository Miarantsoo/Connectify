import { ConfigService } from './../services/ConfigService';
import { UtilisateurService } from './../services/UtilisateurService';
import { JwtTokenManager } from './../services/JwtTokenManager';

export const configService = new ConfigService();
export const utilisateurService = new UtilisateurService();
export const jwtTokenManager = new JwtTokenManager(process.env.JWT_SECRET!);