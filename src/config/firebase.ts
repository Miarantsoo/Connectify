import * as admin from 'firebase-admin';
// @ts-ignore
import * as serviceAccount from './../../service-account.json';
import {updateUserById} from "../services/UtilisateurService";
import {Utilisateur} from "../entities/Utilisateur";
import {Timestamp} from "firebase-admin/firestore";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


export const firestore = admin.firestore();

const db =admin.firestore()

const processTimestamps = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate();
    }

    if (Array.isArray(data)) {
        return data.map(processTimestamps);
    }

    if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, processTimestamps(value)])
        );
    }

    return data;
};

export const setupFirestoreListeners = () => {
    db.collection('utilisateur').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach( async (change) => {
            if (change.type === 'modified') {
                const id: number = Number(change.doc.id);
                const afterData = change.doc.exists ? processTimestamps(change.doc.data()) as Partial<Utilisateur> : null;

                console.log(afterData)

                try {
                    if (afterData) {

                        const message = await updateUserById(id, afterData);
                        console.log(`User ${id} updated: ${message}`);
                    }
                } catch (error) {
                    console.error(`Error updating user ${id} from Firestore:`, error);
                }
            }
        });
    });
};