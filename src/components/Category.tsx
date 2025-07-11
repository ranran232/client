'use client'

import React, { useEffect, useState } from 'react';
import {Camera, ImageIcon, Plus, Upload, Edit, Trash2, AlertTriangle, Edit3, MoveUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/app/store/useUserStore';
import FavoritesCard from './FavoritesCard';

const CardGrid = () => {
    interface Latest{
        category:string,
        image:string,
    }
    
    interface PaginationInfo {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }
    
    const [latest, setLatest] = useState<Latest[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 8,
        hasNextPage: false,
        hasPrevPage: false
    });
    
    const [isNewSet, setIsNewSet] = useState(false);
    const [set, setNewSet] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCat, setSelectedCat] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [tempFieldName, setTempFieldName] = useState('');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [adding, setAdding] = useState(false);
    const {isAdmin} = useUserStore();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const scrollToHash = () => {
            const hash = window.location.hash;
            if (hash) {
                const el = document.querySelector(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        // Wait a bit to ensure everything is mounted
        setTimeout(scrollToHash, 100);
    }, []);

    const getLatest = async (page = 1, limit = 7) => {
        try {
            setLoading(true);
            const res = await fetch(`https://expresso-plum.vercel.app/latest?page=${page}&limit=${limit}`);
            const data = await res.json();
            
            // Handle both old format (direct array) and new format (with pagination)
            if (Array.isArray(data)) {
                // Old format - no pagination
                setLatest(data);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: data.length,
                    itemsPerPage: data.length,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            } else {
                // New format - with pagination
                setLatest(data.data || []);
                setPagination(data.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    itemsPerPage: 7,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLatest();
    }, [])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            getLatest(newPage, pagination.itemsPerPage);
        }
    };

    const handleSaveSet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAdding(true)
        try {
            const res = await fetch('https://expresso-plum.vercel.app/category', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name:set})
            });
            const data = await res.json();
            if (res.status === 200) {
                toast.success(data);
            } else {
                toast.error(data);
            }
            setIsNewSet(false);
            setNewSet('');
            getLatest(1); // Reset to first page after adding
        } catch (error) {
            console.log(error);
            toast.error(String(error))
        } finally {
            setAdding(false);
        }
    }

    const handleIsDelete = (cat: string) => {
        setSelectedCat(cat);
        setIsOpen(true);
    }

    const handleDeleteCat = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`https://expresso-plum.vercel.app/category/${selectedCat}`, {
                method: "DELETE",
            });
            const data = await response.json();
            toast.success(data);
        } catch (error) {
            toast.error(String(error));
        } finally {
            setIsDeleting(false);
            setIsOpen(false);
            getLatest(pagination.currentPage); // Refresh current page
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
        setSelectedCat('');
        setTempFieldName('');
        setIsEditOpen(false);
    }

    const handleIsEdit = (cat: string) => {
        setTempFieldName(cat);
        setSelectedCat(cat);
        setIsEditOpen(true);
    }

    const handleSaveEdit = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`https://expresso-plum.vercel.app/category/${selectedCat}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tempFieldName }),
            });
            const data = await response.json();
            console.log(data);
            toast.success(data.message);
        } catch (error) {
            if (error && typeof error === 'object' && 'error' in error) {
                toast.error(String((error).error));
            } else {
                toast.error(String(error));
            }
        } finally {
            setIsSaving(false);
            setIsEditOpen(false);
            getLatest(pagination.currentPage); // Refresh current page
        }
    }

    const NoImagePlaceholder = () => (
        <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center transition-all duration-500 group">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-6 w-4 h-4 bg-rose-500 rounded-full animate-bounce"></div>
                <div
                    className="absolute bottom-8 left-8 w-6 h-6 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-16 right-4 w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                ></div>
            </div>

            {/* Main Icon */}
            <div className="relative z-10 p-8 rounded-full bg-white/10 backdrop-blur-md shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <ImageIcon className="w-12 h-12 text-white group-hover:text-pink-400 transition-colors duration-300" />
            </div>

            {/* Upload Indicator */}
            <div className="relative z-10 mt-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full shadow-sm group-hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-2 text-white group-hover:text-pink-400 transition-colors duration-300">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">No image yet</span>
                </div>
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-700 group-hover:border-pink-400 transition-colors duration-300 rounded-t-2xl"></div>
        </div>
    );

    return (
        <div id='category' className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-16 px-1 sm:px-4">
            <div className="max-w-[1600px] mx-auto">
                {/* Responsive Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl text-rose-300 font-bold">
                        Albums
                    </h1>
                    {/* Action Button */}
                    {isAdmin && 
                        <button 
                            className="cursor-pointer z-20 w-full sm:w-auto cursor-pointer group border-2 border-rose-300 text-rose-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={() => setIsNewSet(true)}
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span className="text-sm sm:text-base">Create New</span>
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                            </span>
                        </button>
                    }
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="aspect-[4/5] bg-gray-200 rounded mb-4 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Responsive Card Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            <FavoritesCard />
                            {latest.map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.category}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        ) : (
                                            !loading && <NoImagePlaceholder />
                                        )}

                                        {/* Bottom Bar - Always Rendered */}
                                        <div className="absolute bottom-0 left-0 right-0 px-1 md:px-4 py-3 flex items-end justify-between gap-2 text-white text-sm z-10">
                                            {/* Left: Category Name + Edit */}
                                            <div className="flex items-end gap-2 font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                                                <div>
                                                    <span className='text-xs sm:text-base md:text-lg font-thin'>Album</span>
                                                    <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl line-clamp-1">{item.category.length > 6 ? item.category.slice(0, 6) + '...' : item.category}</span>
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleIsEdit(item.category)}
                                                        className="p-1 rounded hover:bg-white/10 transition cursor-pointer"
                                                    >
                                                        <Edit className="w-[15px] h-auto sm:w-6 sm:h-6"/>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Right: View + Delete */}
                                            <div className="flex items-center gap-0 sm:gap-2">
                                                <Link
                                                    href={`cat/${item.category}`}
                                                    className="p-1 rounded hover:bg-white/10 text-white transition"
                                                >
                                                    <MoveUpRight className="w-[17px] h-auto sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                                </Link>

                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleIsDelete(item.category)}
                                                        className="cursor-pointer p-1 rounded hover:bg-white/10 text-white transition"
                                                    >
                                                        <Trash2 className="w-[17px] h-auto sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className=" z-20 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-rose-400 hover:text-rose-600"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                <div className="z-20 flex items-center gap-2">
                                    {[...Array(pagination.totalPages)].map((_, index) => {
                                        const pageNum = index + 1;
                                        const isCurrentPage = pageNum === pagination.currentPage;
                                        
                                        // Show only relevant page numbers for large page counts
                                        if (pagination.totalPages > 7) {
                                            if (pageNum === 1 || pageNum === pagination.totalPages ||
                                                (pageNum >= pagination.currentPage - 2 && pageNum <= pagination.currentPage + 2)) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-10 h-10 rounded-full transition-all duration-300 font-medium ${
                                                            isCurrentPage
                                                                ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                                                                : 'bg-white text-rose-400 hover:bg-rose-50 shadow-md hover:shadow-lg'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (pageNum === pagination.currentPage - 3 || pageNum === pagination.currentPage + 3) {
                                                return <span key={pageNum} className="text-gray-400">...</span>;
                                            }
                                            return null;
                                        } else {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-full transition-all duration-300 font-medium ${
                                                        isCurrentPage
                                                            ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                                                            : 'bg-white text-rose-400 hover:bg-rose-50 shadow-md hover:shadow-lg'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="z-20 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-rose-400 hover:text-rose-600"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Pagination Info */}
                        {pagination.totalItems > 0 && (
                            <div className="text-center mt-4 text-sm text-gray-500">
                                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} items
                            </div>
                        )}
                    </>
                )}

                {/* Empty State Message */}
                {!loading && latest.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No collections yet</h3>
                        <p className="text-gray-500 text-sm sm:text-base mb-6">Create your first collection to get started</p>
                        <button 
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={() => setIsNewSet(true)}
                        >
                            Create Collection
                        </button>
                    </div>
                )}
            </div>

            {/* Dialog for creating new set */}
            <Dialog open={isNewSet} onOpenChange={setIsNewSet}>
                <DialogContent className="p-0 max-w-md overflow-hidden rounded-3xl shadow-2xl">
                    <div className="bg-rose-300/50 px-6 py-5">
                        <DialogHeader className="p-0">
                            <DialogTitle className="text-rose-400 flex items-center gap-2 text-xl font-extrabold tracking-wide">
                                <Plus className="w-6 h-6" />
                                New Set
                            </DialogTitle>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSaveSet} className="bg-white px-6 py-8">
                        <label htmlFor="set" className="block text-sm font-medium text-rose-400 mb-2">
                            Set name
                        </label>
                        <input
                            id="set"
                            name="set"
                            type="text"
                            value={set}
                            required
                            placeholder="e.g. lorem ipsum"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                            onChange={(e) => setNewSet(e.target.value)}
                        />
                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsNewSet(false)}
                                className="cursor-pointer rounded-full px-6 py-3 font-semibold text-gray-600 hover:text-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={adding}
                                type="submit"
                                className={`cursor-pointer group flex items-center gap-2 rounded-full px-8 py-3 font-semibold hover:shadow-xl transform transition-all duration-300 hover:scale-105 text-white ${adding ? 'bg-rose-200' : 'bg-rose-400'}`}
                            >
                                <Camera className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                {adding ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Confirm Deletion
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-600 leading-relaxed">
                            Are you sure you want to delete this item? 
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-6">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteCat}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-md hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[100px]"
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Deleting...
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-white" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Edit Name
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="">
                        <label htmlFor="field-name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            id="field-name"
                            type="text"
                            value={tempFieldName}
                            onChange={(e) => setTempFieldName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                            placeholder="Enter name..."
                            autoFocus
                        />
                    </div>
                    <DialogFooter className="gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            disabled={isSaving || tempFieldName.trim() === '' || tempFieldName.trim() === selectedCat}
                            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-md hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[80px]"
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CardGrid;