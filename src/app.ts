import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormConfig";
import utilisateurRoutes from "./routes/utilisateurRoutes";
import configRoutes from "./routes/configRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger";
import * as functions from "firebase-functions/v1";
import {utilisateurRepository} from "./repositories/UtilisateurRepository";
import {setupFirestoreListeners} from "./config/firebase";

const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())

setupFirestoreListeners()

const PORT = Number(process.env.PORT) || 8080;
console.log(swaggerSpecs)

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log("Error:", error));

app.use("/utilisateur", utilisateurRoutes);
app.use("/config", configRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const firestoreFunctions = functions.firestore;

export const onUserUpdate = firestoreFunctions
    .document('utilisateur/{id}')
    .onWrite(async (
        change: functions.Change<functions.firestore.DocumentSnapshot>,
        context: functions.EventContext
    ) => {
        console.log("MISY MANOVA ZANY LEAZA")
        const id: number = Number(context.params.id);
        const afterData = change.after.exists ? change.after.data() : null;
        const beforeData = change.before.exists ? change.before.data() : null;

        try {
            if (!afterData) {
                await utilisateurRepository.delete({ id: id });
            } else if (!beforeData) {
                const newUser = utilisateurRepository.create({ id: id, ...afterData });
                await utilisateurRepository.save(newUser);
            } else {
                await utilisateurRepository.update({ id: id }, afterData);
            }
        } catch (error) {
            console.error('Error syncing Firestore -> PG:', error);
        }
    });