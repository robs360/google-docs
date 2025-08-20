'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Pencil, Loader2, Clock, User, Share2 } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl"
                >
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-600 font-medium">Loading your documents...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 lg:mb-12"
                >
                    <motion.h1
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                    >
                        Document Dashboard
                    </motion.h1>
                    <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                        Manage and organize all your documents in one place
                    </p>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 lg:mb-12"
                >
                    {[
                        { key: 'owned', label: 'My Documents', icon: User, count: docs.ownedDocs.length },
                        { key: 'shared', label: 'Shared With Me', icon: Share2, count: docs.sharedDocs.length }
                    ].map(({ key, label, icon: Icon, count }) => (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base
                                shadow-lg transition-all duration-300 flex items-center gap-3 min-w-0
                                ${showType === key
                                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-blue-200 transform -translate-y-1'
                                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-xl border border-gray-200/50'}
                            `}
                            onClick={() => setShowType(key as 'owned' | 'shared')}
                        >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="truncate">{label}</span>
                            <span className={`
                                px-2 py-1 rounded-full text-xs font-bold flex-shrink-0
                                ${showType === key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}
                            `}>
                                {count}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    {docsToShow.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="text-center py-16 lg:py-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="relative mb-6"
                            >
                                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                            </motion.div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                {showType === 'owned' ? 'No documents yet' : 'No shared documents'}
                            </h3>
                            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                                {showType === 'owned' 
                                    ? 'Create your first document to get started on your journey' 
                                    : 'No documents have been shared with you yet'}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                        >
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-hidden rounded-3xl shadow-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600">
                                            <th className="py-6 px-8 text-left text-sm font-bold text-white uppercase tracking-wider">Type</th>
                                            <th className="py-6 px-8 text-left text-sm font-bold text-white uppercase tracking-wider">Document Title</th>
                                            <th className="py-6 px-8 text-left text-sm font-bold text-white uppercase tracking-wider">Last Modified</th>
                                            <th className="py-6 px-8 text-center text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {docsToShow.map((doc, index) => (
                                            <motion.tr
                                                key={doc._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group"
                                            >
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                                                            <FileText className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                                        {doc.title}
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Link
                                                            href={`/document/${doc._id}`}
                                                            className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200 hover:scale-110 transition-all duration-300 group/edit"
                                                        >
                                                            <Pencil className="w-4 h-4 text-blue-600 group-hover/edit:text-blue-700" />
                                                        </Link>
                                                        {showType === 'owned' && (
                                                            <AlertDeleteDiagram id={doc._id} setDocs={setDocs} />
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {docsToShow.map((doc, index) => (
                                    <motion.div
                                        key={doc._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex-shrink-0">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate">
                                                    {doc.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                                    <span>
                                                        {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/document/${doc._id}`}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                    {showType === 'owned' && (
                                                        <AlertDeleteDiagram id={doc._id} setDocs={setDocs} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}