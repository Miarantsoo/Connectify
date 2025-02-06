import { Request, Response } from "express";
import { configRepository } from "../repositories/ConfigRepository";
import { ResponseService } from "../services/ResponseService";
import { Config } from "../entities/Config";

export class ConfigController {

    static async updateTentative(req: Request, res: Response) {
        try {
            const { value } = req.body;
            const config = await configRepository.findByNom("tentative");

            if(!config) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Configuration 'tentative' non trouvée"
                }));
            }

            config.valeur = value.toString();
            await configRepository.updateConfig(config);

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Nombre de tentative de connexion changée avec succès"
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la mise à jour: " + error
            }));
        }
    }

    static async updateDelais(req: Request, res: Response) {
        try {
            const { value } = req.body;
            const config = await configRepository.findByNom("delais");

            if(!config) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Configuration 'delais' non trouvée"
                }));
            }

            config.valeur = value.toString();
            await configRepository.updateConfig(config);

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Délais de l'authentification changé avec succès"
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la mise à jour: " + error
            }));
        }
    }

    static async updateTokenValidity(req: Request, res: Response) {
        try {
            const { value } = req.body;
            const config = await configRepository.findByNom("token");

            if(!config) {
                return res.status(404).json(ResponseService.getJSONTemplate("error", {
                    message: "Configuration 'token' non trouvée"
                }));
            }

            config.valeur = value.toString();
            await configRepository.updateConfig(config);

            return res.json(ResponseService.getJSONTemplate("success", {
                message: "Délais du token changé avec succès"
            }));

        } catch (error) {
            return res.status(500).json(ResponseService.getJSONTemplate("error", {
                message: "Erreur lors de la mise à jour: " + error
            }));
        }
    }
}