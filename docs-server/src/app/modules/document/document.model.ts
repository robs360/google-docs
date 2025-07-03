import mongoose, { model, Schema } from "mongoose";
import { IDocument } from "./document.interface";
const DEFAULT_CONTENT = {
    type: "doc",
    content: [
        {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    text: "Start Writing..."
                }
            ]
        }
    ]
};
const documentSchema = new Schema<IDocument>({
    title: { type: String, required: true, default: 'Untitled Document' },
    content: { type: mongoose.Schema.Types.Mixed, required: true, default: DEFAULT_CONTENT },
    owner: { type: String, required: true },
    sharedWith: [
        {
            user: { type: String, required: true },
            role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' },
        }
    ]
}, { timestamps: true });

export const documentModel = model<IDocument>('document', documentSchema)

