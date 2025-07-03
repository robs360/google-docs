import express from 'express'
import { documentController } from './document.controller'
import authMiddleware from '../../middleware/auth'

const router=express.Router()

router.post('/create', documentController.createDocument)
router.get('/',authMiddleware,documentController.getAlldocument)
router.get('/:id',authMiddleware,documentController.getSingleDocument)
export const documentRoutes=router