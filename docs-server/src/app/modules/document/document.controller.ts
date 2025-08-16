import { RequestHandler } from "express";
import { documentServices } from "./document.services";
import { documentModel } from "./document.model";

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

const getAlldocument = async (req: any, res: any) => {

    try {
        const ownedDocs = await documentModel.find({ owner: req.user.email });
        const sharedDocs = await documentModel.find({ 'sharedWith.user': req.user.email });
        res.json({ ownedDocs, sharedDocs });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}


const getSingleDocument = async (req: any, res: any) => {
    try {
        const doc = await documentModel.findById(req.params.id);

        if (!doc) res.status(404).json({ error: 'Document not found' });

        else {

            const isOwner = doc.owner === req.user.email
            const sharedUser: any = doc.sharedWith.find(sw => sw.user === req.user.email);

            if (!isOwner && !sharedUser) {
                res.status(403).json({ error: 'Access denied' });
            }

            else {
                res.status(200).json({ document: doc, role: isOwner ? 'owner' : sharedUser.role });
            }

        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

const updateDocument = async (req: any, res: any) => {
    try {
        const doc = await documentModel.findById(req.params.id);
        if (!doc) res.status(404).json({ error: 'Document not found' });

        else {
            const isOwner = doc.owner === req.user.email;
            const sharedUser = doc.sharedWith.find(sw => sw.user === req.user.email);

            if (!isOwner && (!sharedUser || sharedUser.role !== 'editor')) {
                res.status(403).json({ error: 'No permission to edit' });
            }

            else {
                const { content } = req.body;
                if (content !== undefined) doc.content = content;
                await doc.save();
                res.status(200).json(doc);

            }
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

const updateTitle = async (req: any, res: any) => {
    try {
        const doc = await documentModel.findById(req.params.id);
        if (!doc) res.status(404).json({ error: 'Document not found' });

        else {
            const isOwner = doc.owner === req.user.email;
            const sharedUser = doc.sharedWith.find(sw => sw.user === req.user.email);

            if (!isOwner && (!sharedUser || sharedUser.role !== 'editor')) {
                res.status(403).json({ error: 'No permission to edit' });
            }

            else {

                const { title } = req.body;
                if (title !== undefined) doc.title = title;
                await doc.save();
                res.status(200).json(doc);

            }
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}
const shareDocument = async (req: any, res: any) => {
    const { user, role } = req.body;
    const { id } = req.params;

    if (!user || !role) {

        res.status(400).json({ error: 'Email and role are required' });
    }
    else {
        if (!['viewer', 'editor'].includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
        }

        else {
            try {
                const doc = await documentModel.findById(id);
                if (!doc) res.status(404).json({ error: 'Document not found' });
                else {
                    if (doc.owner !== req.user.email) {
                        res.status(403).json({ error: 'Only owner can share this document' });
                    }

                    else {
                        const alreadyShared = doc.sharedWith.find(sw => sw.user === user);
                        if (alreadyShared) {
                            alreadyShared.role = role;
                        } else {

                            doc.sharedWith.push({ user: user, role });
                        }

                        await doc.save();
                        res.json({ message: 'Document shared successfully', sharedWith: doc.sharedWith });
                    }
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
            }
        }
    }
}


export const documentController = {
    createDocument, deleteDocument,
    getAlldocument, getSingleDocument,
    updateDocument, shareDocument, updateTitle
}