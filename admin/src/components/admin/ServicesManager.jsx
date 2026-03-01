import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, GripVertical, FolderPlus, Move, Loader2, RefreshCw, Trash } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ConfirmModal from '../common/ConfirmModel.jsx';
import api from '../../utils/api';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);

    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    
    const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      isDanger: false,
    });

    const [editingService, setEditingService] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        prices: { male: '', female: '' },
        description: '',
        image: '',
        isActive: true
    });

    const [newSubcategory, setNewSubcategory] = useState('');
    const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null); // categoryId
    const [editingSubcategory, setEditingSubcategory] = useState(null); // { catId: '...', oldName: '...', newName: '...' }
    const [loading, setLoading] = useState(true);
    const [reorderedCategories, setReorderedCategories] = useState([]);

    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        image: '',
        subcategories: [],
        order: 0
    });

    const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);

    const closeConfirmModal = () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const initiateServiceToggle = (service) => {
        if (service.isActive) {
            setConfirmModal({
                isOpen: true,
                title: 'Disable Service?',
                message: `Are you sure you want to disable "${service.name}"? It will be hidden from the public menu.`,
                isDanger: true,
                onConfirm: () => handleServiceToggle(service)
            });
        } else {
            handleServiceToggle(service);
        }
    };

    // Extracted ServiceItem component for reuse
    const ServiceItem = ({ service, index, openServiceModal, initiateServiceToggle, formatPrice }) => (
        <Draggable draggableId={service._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group flex items-center gap-4 py-5 px-2 border-b border-brown-200 transition-all ${
                        !service.isActive ? 'bg-red-50/50 grayscale-[0.5]' : 'hover:bg-brown-50/50'
                    } ${snapshot.isDragging ? 'bg-white shadow-xl ring-2 ring-brown-900/10 rounded-xl border-none' : ''}`}
                >
                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-brown-300 hover:text-brown-500">
                        <GripVertical className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h4 className={`text-lg font-medium ${!service.isActive ? 'text-gray-500 line-through' : 'text-brown-900'}`}>
                                {service.name}
                            </h4>
                            {!service.isActive && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    Inactive
                                </span>
                            )}
                        </div>
                        {service.description && (
                            <p className="text-sm text-brown-500 mt-1 line-clamp-1">
                                {service.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <span className="text-lg font-serif text-brown-900 font-medium whitespace-nowrap">
                            {formatPrice(service)}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openServiceModal(service)}
                                className="p-2 text-brown-600 hover:bg-brown-100 rounded-full transition-colors"
                                title='Edit Service'
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => initiateServiceToggle(service)}
                                className={`p-2 rounded-full transition-colors ${
                                    service.isActive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={service.isActive ? "Disable Service" : "Activate Service"}
                            >
                                {service.isActive ? (
                                    <Trash2 className="h-4 w-4" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );

    // Group services by category
    const groupServicesByCategory = (servicesData, categoriesFromDb) => {
        const grouped = {};

        // First, add all categories from database
        categoriesFromDb.forEach(cat => {
            if (!grouped[cat.name]) {
                grouped[cat.name] = {
                    ...cat,
                    services: [],
                };
            }
        });

        // Then, add services to their categories
        servicesData.forEach(service => {
            if (!grouped[service.category]) {
                // If category doesn't exist in DB, create a default one
                grouped[service.category] = {
                    name: service.category,
                    services: [],
                    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
                    order: 999,
                    isActive: true
                };
            }
            grouped[service.category].services.push(service);
        });

        // Convert to array and sort by order
        return Object.values(grouped).sort((a, b) => a.order - b.order);
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const [servicesRes, categoriesRes] = await Promise.all([
                api.services.getAll(),
                api.categories.getAll()
            ]);

            const servicesData = await servicesRes.data;
            const categoriesData = await categoriesRes.data;

            setServices(servicesData);
            setDbCategories(categoriesData);
            setCategories(groupServicesByCategory(servicesData, categoriesData));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert prices to numbers
            const formattedData = {
                ...serviceFormData,
                prices: {
                    male: serviceFormData.prices.male ? Number(serviceFormData.prices.male) : undefined,
                    female: serviceFormData.prices.female ? Number(serviceFormData.prices.female) : undefined
                }
            };

            if (editingService) {
                await api.services.update(editingService._id, formattedData);
            } else {
                await api.services.create(formattedData);
            }
            setIsServiceModalOpen(false);
            setEditingService(null);
            setServiceFormData({
                name: '',
                category: '',
                subcategory: '',
                prices: { male: '', female: '' },
                description: '',
                image: '',
                isActive: true
            });
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleServiceToggle = async (service) => {
        try {
            if (service.isActive) {
                // Soft delete (Disable)
                await api.services.delete(service._id);
            } else {
                // Activate
                await api.services.update(service._id, { isActive: true });
            }
            fetchServices();
            closeConfirmModal();
        } catch (error) {
            console.error('Error toggling service:', error);
            alert('Failed to update service status');
        }
    };

    const initiateCategoryToggle = (category) => {
        if (category.isActive) {
            setConfirmModal({
                isOpen: true,
                title: 'Disable Category?',
                message: `Are you sure you want to disable "${category.name}"? All services within it will be hidden.`,
                isDanger: true,
                onConfirm: () => handleCategoryToggle(category)
            });
        } else {
            handleCategoryToggle(category);
        }
    };

    const handleCategoryToggle = async (category) => {
        try {
            if (category.isActive) {
                await api.categories.delete(category._id); // Soft delete
            } else {
                await api.categories.update(category._id, { isActive: true }); // Restore
            }
            fetchServices();
            closeConfirmModal();
        } catch (error) {
            console.error('Error toggling category:', error);
            alert('Failed to update category status');
        }
    };

    const initiateCategoryDeletePermanent = (categoryId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Permanently Delete Category?',
            message: 'This cannot be undone. All services in this category might be deleted or moved to Uncategorized.',
            isDanger: true,
            onConfirm: () => handleCategoryDeletePermanent(categoryId)
        });
    };

    const handleCategoryDeletePermanent = async (categoryId) => {
        try {
            await api.categories.deletePermanent(categoryId);
            fetchServices();
            closeConfirmModal();
        } catch (error) {
            console.error('Error permanently deleting category:', error);
            alert('Failed to delete category permanently');
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.categories.update(editingCategory._id, categoryFormData);
            } else {
                await api.categories.create(categoryFormData);
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            setCategoryFormData({ name: '', image: '', subcategories: [], order: 0 });
            setNewSubcategory('');
            fetchServices();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error: ' + (error.message || 'Could not save category'));
        }
    };

    const handleSubcategoryRename = async () => {
        if (!editingSubcategory || !editingSubcategory.newName.trim()) return;

        const { catId, oldName, newName } = editingSubcategory;
        if (oldName === newName) {
            setEditingSubcategory(null);
            return;
        }

        try {
            const category = categories.find(c => c._id === catId);
            if (!category) return;

            // Update Category subcategories list
            const updatedSubcategories = category.subcategories.map(s =>
                s.name === oldName ? { ...s, name: newName } : s
            );

            // Update Category
            await api.categories.update(catId, { ...category, subcategories: updatedSubcategories });

            // Update all related services
            const relatedServices = services.filter(s => s.category === category.name && s.subcategory === oldName);
            await Promise.all(relatedServices.map(s =>
                api.services.update(s._id, { subcategory: newName })
            ));

            setEditingSubcategory(null);
            fetchServices();
        } catch (error) {
            console.error('Error renaming subcategory:', error);
            alert('Failed to rename subcategory');
        }
    };

    const initiateSubcategoryDelete = (catId, subName) => {
      setConfirmModal({
        isOpen: true,
        title: `Delete "${subName}"?`,
        message: `Warning: All services inside "${subName}" will be DELETED. This cannot be undone.`,
        isDanger: true,
        onConfirm: () => handleSubcategoryDelete(catId, subName),
      });
    };

    const handleSubcategoryDelete = async (catId, subName) => {
        
        try {
            const category = categories.find(c => c._id === catId);
            if (!category) return;

            const updatedSubcategories = category.subcategories.filter(s => s.name !== subName);
            await api.categories.update(catId, { ...category, subcategories: updatedSubcategories });

            const relatedServices = services.filter(s => s.category === category.name && s.subcategory === subName);
            await Promise.all(relatedServices.map(s =>
                api.services.delete(s._id)
            ));

            fetchServices();
            closeConfirmModal();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            alert('Failed to delete subcategory');
        }
    };

    const handleCreateSubcategory = async (categoryId) => {
        if (!newSubcategory.trim()) return;

        try {
            const category = categories.find(c => c._id === categoryId);
            if (!category) return;

            // Check duplicate
            if (category.subcategories?.some(s => s.name.toLowerCase() === newSubcategory.trim().toLowerCase())) {
                alert('Subcategory already exists');
                return;
            }

            const updatedSubcategories = [...(category.subcategories || []), { name: newSubcategory.trim() }];
            await api.categories.update(categoryId, { ...category, subcategories: updatedSubcategories });

            setNewSubcategory('');
            setAddingSubcategoryTo(null);
            fetchServices();
        } catch (error) {
            console.error('Error creating subcategory:', error);
            alert('Failed to create subcategory');
        }
    };

    const handleReorderCategories = async () => {
        try {
            await Promise.all(reorderedCategories.map((cat, index) =>
                api.categories.update(cat._id, { ...cat, order: index })
            ));
            setIsReorderModalOpen(false);
            fetchServices();
        } catch (error) {
            console.error('Error reordering categories:', error);
            alert('Failed to save order');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        // Handle Category Reordering within Modal
        if (result.source.droppableId === 'reorder-categories') {
            const items = Array.from(reorderedCategories);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            setReorderedCategories(items);
            return;
        }

        const { source, destination, draggableId } = result;

        // Parse droppableIds to get category and subcategory
        // Format: "CategoryName" or "CategoryName::SubcategoryName"
        const [sourceCat, sourceSub] = source.droppableId.split('::');
        const [destCat, destSub] = destination.droppableId.split('::');

        if (sourceCat !== destCat) return;

        // Find the category object
        const categoryIndex = categories.findIndex(c => c.name === sourceCat);
        if (categoryIndex === -1) return;

        const category = categories[categoryIndex];
        const newServices = [...category.services];

        // Find the service in the list
        const serviceIndex = newServices.findIndex(s => s._id === draggableId);
        if (serviceIndex === -1) return;
        const service = newServices[serviceIndex];

        // Changing Subcategory?
        const newSubcategory = destSub || '';
        const oldSubcategory = sourceSub || '';

        // Remove from old position (conceptually, we just re-sort the whole list later or handle indices)
        // Actually, since current `categories` state is just a flat list of services, 
        // dragging between "visual" lists implies changing the `subcategory` field.

        if (newSubcategory !== oldSubcategory) {
            // Update the service locally
            service.subcategory = newSubcategory;

            // Update in Backend
            try {
                await api.services.update(service._id, { subcategory: newSubcategory });
            } catch (err) {
                console.error("Failed to update subcategory on drag", err);
                // Revert would be ideal here but let's assume success or refresh
            }
        }

        // Handling Reordering is tricky because they are in different "visual" lists but one "data" list.
        // For this specific iteration, let's just update the Subcategory and let the list re-render standard sort.
        // If we want precise manual order, we need a global `order` field on services.
        // Assuming we rely on default sort order (which is usually insertion or name), 
        // or we just update the local state to reflect the move.

        const newCategories = [...categories];
        newCategories[categoryIndex].services = newServices; // updated service is inside
        setCategories(newCategories);
    };

    const openServiceModal = (service = null, categoryName = '') => {
        if (service) {
            setEditingService(service);
            setServiceFormData({
                ...service,
                prices: {
                    male: service.prices?.male || '',
                    female: service.prices?.female || ''
                }
            });
        } else {
            setEditingService(null);
            setServiceFormData({
                name: '',
                category: categoryName,
                subcategory: '',
                prices: { male: '', female: '' },
                description: '',
                image: '',
                isActive: true
            });
        }
        setIsServiceModalOpen(true);
    };

    const handleAddSubcategory = () => {
        if (!newSubcategory.trim()) return;
        setCategoryFormData({
            ...categoryFormData,
            subcategories: [...(categoryFormData.subcategories || []), { name: newSubcategory.trim() }]
        });
        setNewSubcategory('');
    };

    const handleRemoveSubcategory = (index) => {
        const updated = [...(categoryFormData.subcategories || [])];
        updated.splice(index, 1);
        setCategoryFormData({ ...categoryFormData, subcategories: updated });
    };

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryFormData({
                name: category.name,
                image: category.image,
                subcategories: category.subcategories || [],
                order: category.order || 0
            });
        } else {
            setEditingCategory(null);
            const maxOrder = dbCategories.reduce((max, cat) => Math.max(max, cat.order || 0), 0);
            setCategoryFormData({ name: '', image: '', subcategories: [], order: maxOrder + 1 });
        }
        setIsCategoryModalOpen(true);
    };

    const formatPrice = (service) => {
        if (service.prices?.male && service.prices?.female) {
            return `₹${service.prices.male} / ₹${service.prices.female}`;
        } else if (service.prices?.male) {
            return `₹${service.prices.male}`;
        } else if (service.prices?.female) {
            return `₹${service.prices.female}`;
        }
        return 'Price not set';
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Global Confirm Modal */}
            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={confirmModal.isDanger}
            />
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-brown-900">Manage Services</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setReorderedCategories(dbCategories);
                            setIsReorderModalOpen(true);
                        }}
                        className="bg-brown-100 text-brown-900 px-6 py-3 rounded-full hover:bg-brown-200 transition-colors flex items-center gap-2"
                    >
                        <Move className="h-5 w-5" />
                        Reorder
                    </button>
                    <button
                        onClick={() => openCategoryModal()}
                        className="flex items-center rounded-full bg-brown-600 px-5 py-2.5 text-sm text-white hover:bg-brown-700 transition-all shadow-md"
                    >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Services grouped by category with drag and drop */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-brown-900" />
                </div>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-col gap-16">
                        {categories.map((category, categoryIdx) => (
                            <section key={categoryIdx} className="scroll-mt-40">
                                {/* Category Header with Image */}
                                <div className="mb-8 rounded-3xl overflow-hidden relative h-48 md:h-56 shadow-xl group">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-8 backdrop-blur-[2px]">
                                        <div>
                                            <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide drop-shadow-lg flex items-center gap-3">
                                                {category.name}
                                                {!category.isActive && (
                                                    <span className="text-xs bg-red-500/80 text-white px-2 py-1 rounded-full font-sans tracking-normal">
                                                        Inactive
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-white/80 text-sm mt-2 drop-shadow">
                                                {category.services.length} {category.services.length === 1 ? 'service' : 'services'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {category.isActive && (
                                                <>
                                                    <button
                                                        onClick={() => openServiceModal(null, category.name)}
                                                        className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                                        title="Add service to this category"
                                                    >
                                                        <Plus className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setAddingSubcategoryTo(category._id)}
                                                        className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                                        title="Add subcategory"
                                                    >
                                                        <FolderPlus className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}

                                            {category._id && (
                                                <>
                                                    <button
                                                        onClick={() => openCategoryModal(category)}
                                                        className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                                        title="Edit category"
                                                    >
                                                        <Edit2 className="h-5 w-5" />
                                                    </button>

                                                    {/* Toggle: Disable / Restore */}
                                                    <button
                                                        onClick={() => initiateCategoryToggle(category)}
                                                        className={`p-3 rounded-full transition-all shadow-lg ${
                                                            category.isActive 
                                                            ? 'bg-white/90 text-red-600 hover:bg-red-50' 
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                        title={category.isActive ? "Disable Category" : "Restore Category"}
                                                    >
                                                        {category.isActive ? <Trash2 className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                                                    </button>

                                                    {/* Permanent Delete (Only shows when disabled) */}
                                                    {!category.isActive && (
                                                        <button
                                                            onClick={() => initiateCategoryDeletePermanent(category._id)}
                                                            className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-lg"
                                                            title="Permanently Delete"
                                                        >
                                                            <Trash className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Sub-Groups */}
                                <div className={`space-y-4 ${!category.isActive ? 'pointer-events-none opacity-50' : ''}`}>
                                    {(() => {
                                        const groups = {};
                                        // Initialize with defined subcategories to ensure order
                                        (category.subcategories || []).forEach(sub => {
                                            groups[sub.name] = [];
                                        });
                                        // Add services to groups
                                        category.services.forEach(service => {
                                            const subName = service.subcategory || '';
                                            if (!groups[subName]) {
                                                groups[subName] = [];
                                            }
                                            groups[subName].push(service);
                                        });

                                        // Determine display order
                                        const definedOrder = (category.subcategories || []).map(s => s.name);
                                        const allGroupNames = Object.keys(groups).filter(name => name !== ''); // Exclude General for now
                                        // Sort: defined ones first (in order), then others alphabetically
                                        const sortedGroupNames = allGroupNames.sort((a, b) => {
                                            const idxA = definedOrder.indexOf(a);
                                            const idxB = definedOrder.indexOf(b);
                                            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                                            if (idxA !== -1) return -1;
                                            if (idxB !== -1) return 1;
                                            return a.localeCompare(b);
                                        });

                                        return (
                                            <>
                                                {/* Add Subcategory Input */}
                                                {addingSubcategoryTo === category._id && (
                                                    <div className="mt-6 mb-8 pl-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                                        <div className="flex items-center gap-2 max-w-md">
                                                            <input
                                                                type="text"
                                                                value={newSubcategory}
                                                                onChange={(e) => setNewSubcategory(e.target.value)}
                                                                className="text-2xl font-serif text-brown-900 bg-transparent border-b-2 border-brown-900 px-0 py-1 w-full focus:outline-none placeholder-brown-300"
                                                                placeholder="New Subcategory Name"
                                                                autoFocus
                                                                onKeyPress={(e) => e.key === 'Enter' && handleCreateSubcategory(category._id)}
                                                            />
                                                            <button
                                                                onClick={() => handleCreateSubcategory(category._id)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                                                title="Create"
                                                            >
                                                                <Plus className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setAddingSubcategoryTo(null);
                                                                    setNewSubcategory('');
                                                                }}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                                title="Cancel"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Subcategories */}
                                                {sortedGroupNames.map(subName => {
                                                    const subcatServices = groups[subName];
                                                    const isEditing = editingSubcategory?.catId === category._id && editingSubcategory?.oldName === subName;

                                                    return (
                                                        <div key={subName} className="mt-6 mb-2 group/sub pl-2">
                                                            <div className="flex items-center justify-between mb-3">
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-2 flex-1">
                                                                        <input
                                                                            type="text"
                                                                            value={editingSubcategory.newName}
                                                                            onChange={(e) => setEditingSubcategory({ ...editingSubcategory, newName: e.target.value })}
                                                                            className="text-2xl font-serif text-brown-900 bg-transparent border-b-2 border-brown-900 px-0 py-1 w-full max-w-sm focus:outline-none"
                                                                            autoFocus
                                                                            onKeyPress={(e) => e.key === 'Enter' && handleSubcategoryRename()}
                                                                        />
                                                                        <button
                                                                            onClick={handleSubcategoryRename}
                                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                                                            title="Save"
                                                                        >
                                                                            <Plus className="h-5 w-5 rotate-45 transform" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingSubcategory(null)}
                                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                                            title="Cancel"
                                                                        >
                                                                            <X className="h-5 w-5" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-2xl font-serif text-brown-900">
                                                                            {subName}
                                                                        </h4>
                                                                        <div className="flex opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                            <button
                                                                                onClick={() => setEditingSubcategory({ catId: category._id, oldName: subName, newName: subName })}
                                                                                className="p-2 text-brown-400 hover:text-brown-600 rounded-full transition-colors"
                                                                                title="Rename subcategory"
                                                                            >
                                                                                <Edit2 className="h-4 w-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => initiateSubcategoryDelete(category._id, subName)}
                                                                                className="p-2 text-red-400 hover:text-red-600 rounded-full transition-colors"
                                                                                title="Delete subcategory"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Droppable droppableId={`${category.name}::${subName}`}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.droppableProps}
                                                                        className={`min-h-[50px] transition-colors pl-6 border-l-2 border-brown-100 ml-2 ${snapshot.isDraggingOver ? 'bg-brown-50/30 rounded-lg' : ''}`}
                                                                    >
                                                                        {subcatServices.length === 0 ? (
                                                                            <div className="text-center py-4 text-brown-300 italic text-sm">
                                                                                <p>No services</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-0">
                                                                                {subcatServices.map((service, index) => (
                                                                                    <ServiceItem
                                                                                        key={service._id}
                                                                                        service={service}
                                                                                        index={index}
                                                                                        openServiceModal={openServiceModal}
                                                                                        initiateServiceToggle={initiateServiceToggle}
                                                                                        formatPrice={formatPrice}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </div>
                                                    );
                                                })}

                                                {/* General / Uncategorized */}
                                                {(() => {
                                                    const generalServices = groups[''] || [];
                                                    // Always show General area if it has services OR if there are no subcategories at all (to allow dropping)
                                                    // OR if the user just wants a "Catch all" area.
                                                    // The image shows a flat list if no subcats.
                                                    // If there ARE subcats, General should be labeled "General" or similar?
                                                    // User wants a TREE. So General services are just siblings to Subcategory Folders? Or separate?
                                                    // Let's create a "General" group at the bottom if needed.

                                                    if (generalServices.length > 0 || sortedGroupNames.length > 0) {
                                                        return (
                                                            <div className="mt-8 pl-2">
                                                                {sortedGroupNames.length > 0 && generalServices.length > 0 && (
                                                                    <h4 className="text-xl font-serif text-brown-800 mb-4 italic opacity-70">
                                                                        General Services
                                                                    </h4>
                                                                )}
                                                                <Droppable droppableId={`${category.name}::`}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.droppableProps}
                                                                            className={`min-h-[50px] transition-colors ${sortedGroupNames.length > 0 ? 'pl-6 border-l-2 border-brown-100 ml-2' : ''} ${snapshot.isDraggingOver ? 'bg-brown-50/30 rounded-lg' : ''}`}
                                                                        >
                                                                            {generalServices.length === 0 ? (
                                                                                <div className="text-center py-6 text-brown-300 italic text-sm">
                                                                                    {sortedGroupNames.length === 0 ? <p>Drop services here</p> : <p>Drop general services here</p>}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="space-y-0">
                                                                                    {generalServices.map((service, index) => (
                                                                                        <ServiceItem
                                                                                            key={service._id}
                                                                                            service={service}
                                                                                            index={index}
                                                                                            openServiceModal={openServiceModal}
                                                                                            initiateServiceToggle={initiateServiceToggle}
                                                                                            formatPrice={formatPrice}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </>
                                        );
                                    })()}
                                </div>
                            </section>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-brown-600 mb-6">No categories yet. Add your first category to get started!</p>
                                <button
                                    onClick={() => openCategoryModal()}
                                    className="bg-brown-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg"
                                >
                                    <FolderPlus className="inline h-5 w-5 mr-2" />
                                    Add First Category
                                </button>
                            </div>
                        )}
                    </div>
                </DragDropContext>
            )}

            {/* Service Modal - Minimal Design */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown-900/40 backdrop-blur-md p-4 transition-all duration-300">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
                        {/* Header */}
                        <div className="p-6 pb-0 flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-brown-500 uppercase tracking-widest mb-1">
                                    {serviceFormData.category}
                                </div>
                                <h3 className="text-2xl font-serif text-brown-900">
                                    {editingService ? 'Edit Service' : 'New Service'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsServiceModalOpen(false)}
                                className="text-brown-400 hover:text-brown-900 transition-colors p-1"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleServiceSubmit} className="p-6 space-y-6">
                            {/* Primary Fields */}
                            <div className="space-y-4">
                                <div className="group relative">
                                    <label className="absolute -top-2 left-4 bg-white px-1 text-[10px] font-bold uppercase tracking-widest text-brown-500">
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Service Name"
                                        className="w-full rounded-xl border border-brown-200 bg-transparent p-3 text-lg font-medium text-brown-900 outline-none focus:border-brown-900 focus:ring-1 focus:ring-brown-900 transition-all placeholder:font-normal placeholder:text-brown-300"
                                        value={serviceFormData.name}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 group relative">
                                        <label className="absolute -top-2 left-4 bg-white px-1 text-[10px] font-bold uppercase tracking-widest text-brown-500">
                                            Male Price
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="₹"
                                            className="w-full rounded-xl border border-brown-200 bg-transparent p-3 text-brown-900 outline-none focus:border-brown-900 focus:ring-1 focus:ring-brown-900 transition-all placeholder:text-brown-300"
                                            value={serviceFormData.prices.male}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, prices: { ...serviceFormData.prices, male: e.target.value } })}
                                        />
                                    </div>
                                    <div className="flex-1 group relative">
                                        <label className="absolute -top-2 left-4 bg-white px-1 text-[10px] font-bold uppercase tracking-widest text-brown-500">
                                            Female Price
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="₹"
                                            className="w-full rounded-xl border border-brown-200 bg-transparent p-3 text-brown-900 outline-none focus:border-brown-900 focus:ring-1 focus:ring-brown-900 transition-all placeholder:text-brown-300"
                                            value={serviceFormData.prices.female}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, prices: { ...serviceFormData.prices, female: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                {/* Subcategory Selection with Create Option */}
                                {serviceFormData.category && (
                                    <div className="group relative">
                                        <label className="absolute -top-2 left-4 bg-white px-1 text-[10px] font-bold uppercase tracking-widest text-brown-500">
                                            Subcategory
                                        </label>
                                        <div className="flex gap-2">
                                            {isCreatingSubcategory ? (
                                                <input
                                                    type="text"
                                                    placeholder="New Subcategory Name"
                                                    className="w-full rounded-xl border border-brown-200 bg-transparent p-3 text-brown-900 outline-none focus:border-brown-900 focus:ring-1 focus:ring-brown-900"
                                                    value={serviceFormData.subcategory}
                                                    onChange={(e) => setServiceFormData({ ...serviceFormData, subcategory: e.target.value })}
                                                    autoFocus
                                                />
                                            ) : (
                                                <select
                                                    className="w-full rounded-xl border border-brown-200 bg-transparent p-3 text-brown-900 outline-none focus:border-brown-900 focus:ring-1 focus:ring-brown-900 transition-all appearance-none"
                                                    value={serviceFormData.subcategory}
                                                    onChange={(e) => setServiceFormData({ ...serviceFormData, subcategory: e.target.value })}
                                                >
                                                    <option value="">No Subcategory</option>
                                                    {(() => {
                                                        {/* console.log('Rendering Dropdown. Service Category:', serviceFormData.category); */}

                                                        // 1. Get explicitly defined subcategories
                                                        const categoryObj = dbCategories.find(c => c.name?.trim().toLowerCase() === serviceFormData.category?.trim().toLowerCase());
                                                        const definedSubs = categoryObj?.subcategories?.map(s => (typeof s === 'string' ? s : s.name)) || [];

                                                        // 2. Discover subcategories used by existing services in this category
                                                        const usedSubs = services
                                                            .filter(s => s.category === serviceFormData.category && s.subcategory)
                                                            .map(s => s.subcategory);

                                                        // 3. Merge and Dedupe
                                                        const allSubs = [...new Set([...definedSubs, ...usedSubs])].sort();

                                                        {/* console.log('Final Available Subcategories:', allSubs); */}

                                                        if (allSubs.length === 0) {
                                                            return <option value="" disabled>No subcategories available</option>;
                                                        }

                                                        return allSubs.map((subName, idx) => (
                                                            <option key={idx} value={subName}>{subName}</option>
                                                        ));
                                                    })()}
                                                </select>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCreatingSubcategory(!isCreatingSubcategory);
                                                    setServiceFormData({ ...serviceFormData, subcategory: '' });
                                                }}
                                                className={`p-3 rounded-xl border transition-all ${isCreatingSubcategory ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-brown-200 text-brown-600 hover:bg-brown-50'}`}
                                                title={isCreatingSubcategory ? "Cancel" : "Add New Subcategory"}
                                            >
                                                {isCreatingSubcategory ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-brown-900 py-3.5 font-bold tracking-wide text-white shadow-lg transition-all hover:bg-brown-800 hover:shadow-xl active:scale-[0.98]"
                            >
                                {editingService ? 'SAVE CHANGES' : 'CREATE SERVICE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
                        {/* Header */}
                        <div className="relative h-32 bg-brown-900 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <h3 className="relative text-3xl font-serif text-white tracking-wider drop-shadow-md">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h3>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="p-8 pt-10 space-y-8">
                            <div className='space-y-6'>
                                <div className="group relative">
                                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold uppercase tracking-widest text-brown-500 transition-all group-focus-within:text-brown-900">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hair Services"
                                        className="w-full rounded-2xl border-2 border-brown-100 bg-transparent p-4 text-lg font-medium text-brown-900 outline-none transition-all placeholder:font-normal placeholder:text-brown-300 hover:border-brown-300 focus:border-brown-900"
                                        value={categoryFormData.name}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                {/* Image URL Input */}
                                <div className="group relative">
                                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold uppercase tracking-widest text-brown-500 transition-all group-focus-within:text-brown-900">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full rounded-2xl border-2 border-brown-100 bg-transparent p-4 text-base text-brown-900 outline-none transition-all placeholder:text-brown-300 hover:border-brown-300 focus:border-brown-900"
                                        value={categoryFormData.image}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                                        required
                                    />
                                    {categoryFormData.image && (
                                        <div className="mt-4 h-32 w-full overflow-hidden rounded-xl border border-brown-100 shadow-inner group relative">
                                            <img
                                                src={categoryFormData.image}
                                                alt="Preview"
                                                className="h-full w-full object-cover opacity-90"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCategoryFormData({ ...categoryFormData, image: '' })}
                                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Subcategories
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Add subcategory"
                                        className="flex-1 rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={newSubcategory}
                                        onChange={(e) => setNewSubcategory(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcategory())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSubcategory}
                                        className="bg-brown-900 text-white px-4 rounded-xl hover:bg-brown-800 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                                    {categoryFormData.subcategories?.map((sub, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-brown-50 p-3 rounded-lg">
                                            <span className="text-brown-900">{sub.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubcategory(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                    value={categoryFormData.order}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order: Number(e.target.value) })}
                                />
                                <p className="text-xs text-brown-600 mt-1">
                                    Lower numbers appear first
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 rounded-xl border-2 border-brown-200 bg-white py-3 font-medium text-brown-900 hover:bg-brown-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-brown-900 py-3 font-medium text-white hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isReorderModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-brown-100 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-brown-900">Reorder Categories</h2>
                            <button
                                onClick={() => setIsReorderModalOpen(false)}
                                className="p-2 hover:bg-brown-50 rounded-full transition-colors"
                            >
                                <X className="h-6 w-6 text-brown-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="reorder-categories">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {reorderedCategories.map((cat, index) => (
                                                <Draggable key={cat._id} draggableId={cat._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`flex items-center gap-4 p-4 bg-white border border-brown-100 rounded-xl shadow-sm ${snapshot.isDragging ? 'shadow-lg ring-2 ring-brown-900/20' : ''
                                                                }`}
                                                        >
                                                            <div {...provided.dragHandleProps} className="text-brown-300 hover:text-brown-600 cursor-grab active:cursor-grabbing">
                                                                <GripVertical className="h-5 w-5" />
                                                            </div>
                                                            <span className="font-medium text-brown-900">{cat.name}</span>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>

                        <div className="p-6 border-t border-brown-100 flex justify-end gap-3 bg-brown-50/50 rounded-b-3xl">
                            <button
                                onClick={() => setIsReorderModalOpen(false)}
                                className="px-6 py-2.5 text-brown-600 font-medium hover:bg-brown-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReorderCategories}
                                className="px-6 py-2.5 bg-brown-900 text-white font-medium rounded-xl hover:bg-brown-800 transition-all shadow-lg shadow-brown-900/10"
                            >
                                Save Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;
