import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact
router.post('/contact', submitContact);

export default router;
