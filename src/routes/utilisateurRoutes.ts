import { Router } from "express";
import { UtilisateurController } from "../controllers/UtilisateurController";

const router = Router();

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 */
// @ts-ignore
router.post("/signup", UtilisateurController.signup);

/**
 * @openapi
 * /signup/verification/{id}:
 *   get:
 *     summary: Verify user signup
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User verified successfully
 */
// @ts-ignore
router.get("/signup/verification/:id", UtilisateurController.signupValidation);

/**
 * @openapi
 * /signin:
 *   post:
 *     summary: Signin a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 */
// @ts-ignore
router.post("/signin", UtilisateurController.login);

/**
 * @openapi
 * /signin/confirmation/{id}:
 *   post:
 *     summary: Confirm user signin
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signin confirmed successfully
 */
router.post("/signin/confirmation/:id",
    // @ts-ignore
    UtilisateurController.checkPin);

/**
 * @openapi
 * /update/{id}:
 *   post:
 *     summary: Update user information
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 */
// @ts-ignore
router.post("/update/:id", UtilisateurController.updateUser);

/**
 * @openapi
 * /signin/resetTentative/{id}:
 *   get:
 *     summary: Reset user signin attempts
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User signin attempts reset successfully
 */
// @ts-ignore
router.get("/signin/resetTentative/:id", UtilisateurController.resetTentative);

/**
 * @openapi
 * /get-utilisateur:
 *   get:
 *     summary: Get user by token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
// @ts-ignore
router.get("/get-utilisateur", UtilisateurController.getUserByToken);

/**
 * @openapi
 * /all:
 *   get:
 *     summary: Get all users in database
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
// @ts-ignore
router.get("/all", UtilisateurController.getAllUtilisateurs);

/**
 * @openapi
 * /all:
 *   get:
 *     summary: Get all users in database
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
// @ts-ignore
router.get("/by-id/:id", UtilisateurController.getUtilisateurById);

export default router;