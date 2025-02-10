import swaggerJsDoc from "swagger-jsdoc";

const swaggerSpecs: swaggerJsDoc.Options = {
    openapi: "3.1.0",
    info: {
        title: "Documentation API pour le fournisseur d'identité projet S5 P16",
        version: "1.0.0"
    },
    servers: [
        {
            "url": "http://localhost:8080"
        }
    ],
    tags: [{
        "name": "Config",
        "description": "Configuration tentative, délais, token"
    },
        {
            "name": "Utilisateur",
            "description": "Opérations sur les utilisateurs"
        }],
    paths: {
        "/config/tentative": {
            "post": {
                "description": "changer le nombre de tentative de connexion",
                "tags": ["Config"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    value: {
                                        type: "number",
                                    },
                                },
                                required: ["tentative"],
                            },
                        },
                    },
                },
            }
        },
        "/config/delais": {
            "post": {
                "description": "changer la durée de validité du code de confirmation",
                "tags": ["Config"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    value: {
                                        type: "number",
                                    },
                                },
                                required: ["tentative"],
                            },
                        },
                    },
                },
            }
        },
        "/config/token": {
            "post": {
                "description": "changer la durée de vie du token",
                "tags": ["Config"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    value: {
                                        type: "number",
                                    },
                                },
                                required: ["tentative"],
                            },
                        },
                    },
                },
            }
        },
        "/utilisateur/signup": {
            "post": {
                "description": "S'inscrire",
                "tags": ["Utilisateur"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    prenom: {
                                        type: "string",
                                    },
                                    nom: {
                                        type: "string",
                                    },
                                    mail: {
                                        type: "string",
                                    },
                                    genre: {
                                        type: "number",
                                    },
                                    dateNaissance: {
                                        type: "string",
                                    },
                                    motDePasse: {
                                        type: "string",
                                    },
                                    verification: {
                                        type: "string",
                                    },
                                },
                                required: ["prenom", "mail", "genre", "dateNaissance", "motDePasse", "verification"],
                            },
                        },
                    },
                },
            }
        },"/utilisateur/signup/verification/:id": {
            "get": {
                "description": "Valider l'inscription",
                "tags": ["Utilisateur"],
            }
        },"/utilisateur/signin": {
            "post": {
                "description": "Se connecter",
                "tags": ["Utilisateur"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                    },
                                    mdp: {
                                        type: "string"
                                    }
                                },
                                required: ["email", "mdp"],
                            },
                        },
                    },
                },
            }
        },"/utilisateur/signin/confirmation/:id": {
            "post": {
                "description": "Confirmer la connexion avec le code de confirmation",
                "tags": ["Utilisateur"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    code: {
                                        type: "number",
                                    },
                                },
                                required: ["code"],
                            },
                        },
                    },
                },
            }
        },"/utilisateur/signin/resetTentative/:id": {
            "get": {
                "description": "Réinitialiser le nombre de tentative de connexion",
                "tags": ["Utilisateur"],
            }
        },"/utilisateur/update/:id": {
            "post": {
                "description": "mettre à jour les informations de l'utilisateur",
                "tags": ["Utilisateur"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    prenom: {
                                        type: "string",
                                    },
                                    nom: {
                                        type: "string",
                                    },
                                    genre: {
                                        type: "number",
                                    },
                                    dateNaissance: {
                                        type: "string",
                                    },
                                    mdpSimple: {
                                        type: "string",
                                    }
                                },
                                required: [],
                            },
                        },
                    },
                },
            }
        },"/utilisateur/get-utilisateur": {
            "get": {
                "description": "Récupérer les informations de l'utilisateur via le token",
                "tags": ["Utilisateur"],
            }
        },"/utilisateur/signin/admin": {
            "post": {
                "description": "changer le nombre de tentative de connexion",
                "tags": ["Utilisateur"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: {
                                        type: "string",
                                    },
                                    mdp: {
                                        type: "string",
                                    }
                                },
                                required: ["email", "mdp"],
                            },
                        },
                    },
                },
            }
        },
    },
};

export default swaggerSpecs