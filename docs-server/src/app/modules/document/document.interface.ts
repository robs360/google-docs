interface SharedWith {
    user: string;
    role: 'viewer' | 'editor';
}

export interface IDocument {
    title: string;
    content: string;
    owner: string;
    sharedWith: SharedWith[];
}