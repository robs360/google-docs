'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Pencil, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllDocs } from '@/app/actions/docs';
import { AlertDeleteDiagram } from '../DeleteDialog';

type Doc = {
    _id: string;
    title: string;
    updatedAt: string;
};

export default function AllDocs() {
    const [showType, setShowType] = useState<'owned' | 'shared'>('owned');
    const [docs, setDocs] = useState<{ ownedDocs: Doc[]; sharedDocs: Doc[] }>({ ownedDocs: [], sharedDocs: [] });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            fetchDocs(token);
        }
    }, []);

    const fetchDocs = async (token:string) => {
        const result = await getAllDocs(token);
        console.log(result)
        if (!result.error) {
            setDocs({
                ownedDocs: result.ownedDocs,
                sharedDocs: result.sharedDocs
            });
        }
        setLoading(false);
    };

    const docsToShow = showType === 'owned' ? docs.ownedDocs : docs.sharedDocs;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-[830px] mx-auto to-white">
            <div className="mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    Document Dashboard
                </motion.h1>

                <div className="flex justify-center gap-4 mb-10">
                    {['owned', 'shared'].map((type) => (
                        <motion.button
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                px-6 py-2.5 rounded-full font-medium shadow-md transition-all duration-300
                ${showType === type
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-200'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}
              `}
                            onClick={() => setShowType(type as 'owned' | 'shared')}
                        >
                            {type === 'owned' ? 'My Documents' : 'Shared With Me'}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {docsToShow.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {showType === 'owned' ? 'No documents yet. Create your first one!' : 'No documents have been shared with you.'}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-auto rounded-2xl shadow-sm border border-gray-200 bg-white"
                        >
                            <table className="w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-500 to-purple-500">
                                        <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                                        <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">Last Updated</th>
                                        <th className="py-4 px-6 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {docsToShow.map((doc) => (
                                        <motion.tr
                                            key={doc._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <Link
                                                        href={`/document/${doc._id}`}
                                                        className="bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                                                    >
                                                        <Pencil className="w-4 h-4 text-blue-600" />
                                                    </Link>

                                                    {showType === 'owned' && (
                                                        
                                                            <AlertDeleteDiagram id={doc._id} setDocs={setDocs}></AlertDeleteDiagram>                       
                                                    )}
                                            
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}