import express from 'express';
import { ConfigController } from './../controllers/ConfigController';

const router = express.Router();

// @ts-ignore
router.post('/tentative', ConfigController.updateTentative);
// @ts-ignore
router.post('/delais', ConfigController.updateDelais);
// @ts-ignore
router.post('/token', ConfigController.updateTokenValidity);

export default router;