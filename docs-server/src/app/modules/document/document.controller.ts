import { RequestHandler } from "express";
import { documentServices } from "./document.services";

const createDocument: RequestHandler = async (req, res) => {
    try {
        const documentData = req.body

        const result = await documentServices.createDocumentIntoDB(documentData)
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteDocument: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const result = await documentServices.deleteDocumentFromDB(id)
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const documentController = {
    createDocument, deleteDocument
}