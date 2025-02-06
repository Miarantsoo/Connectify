export enum EmailSubject {
    INSCRIPTION = "Validation de votre profil",
    AUTHENTICATION = "Authentification de votre profil",
    RESET = "Reinitialisation du nombre d'essaie de connexion"
}

export type EmailSubjectType = typeof EmailSubject[keyof typeof EmailSubject];