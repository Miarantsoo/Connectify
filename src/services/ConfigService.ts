import { Config } from '../entities/Config';

export class ConfigService {
    async getTentativeRef(): Promise<string> {
        const config = await Config.findOne({ where: { nom: 'tentative' } });
        return config ? config.valeur : '';
    }

    async getDelaisRef(): Promise<string> {
        const config = await Config.findOne({ where: { nom: 'delais' } });
        return config ? config.valeur : '';
    }

    async getTokenRef(): Promise<string> {
        const config = await Config.findOne({ where: { nom: 'token' } });
        return config ? config.valeur : '';
    }
}