"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package, 
  Search,
  Plus,
  Edit,
  Save, 
  X, 
  Eye, 
  EyeOff,
  Play,
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { loadToysData, ToyData } from "@/lib/toys-data";
import { PricingService } from "@/lib/pricing-service";

interface InventoryItem extends ToyData {
  isVisible: boolean;
  isEditing: boolean;
  hasChanges: boolean;
}

export default function InventoryPage() {
  const [toys, setToys] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingToy, setEditingToy] = useState<InventoryItem | null>(null);
  
  // États pour la gestion des prix
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedToyForPricing, setSelectedToyForPricing] = useState<InventoryItem | null>(null);
  const [editedPrices, setEditedPrices] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    deposit: 0,
  });

  // État pour les notifications
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [newToy, setNewToy] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    age: '',
    description: '',
    image: '/toys/placeholders/toy-placeholder.svg',
    hasImage: false,
    isVisible: true,
    isEditing: false,
    hasChanges: false,
    hasVideo: false,
    videoUrl: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  // Fonction pour afficher les notifications
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide après 3 secondes
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadInventory = async () => {
    try {
      const data = await loadToysData();
      const inventoryItems: InventoryItem[] = data.toys.map(toy => ({
        ...toy,
        isVisible: true,
        isEditing: false,
        hasChanges: false
      }));
      setToys(inventoryItems);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l&apos;inventaire:', error);
      setLoading(false);
    }
  };

  const filteredToys = toys.filter(toy => {
    const matchesSearch = toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         toy.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || toy.category?.includes(filterCategory);
    const matchesVisibility = filterVisibility === "all" || 
                             (filterVisibility === "visible" && toy.isVisible) ||
                             (filterVisibility === "hidden" && !toy.isVisible);
    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const toggleVisibility = (toyId: string) => {
    setToys(prev => prev.map(toy => 
      String(toy.id) === toyId ? { ...toy, isVisible: !toy.isVisible } : toy
    ));
  };

  const startEditing = (toy: InventoryItem) => {
    setEditingToy({ ...toy, isEditing: true });
  };

  const saveChanges = (toyId: string, updatedData: Partial<ToyData>) => {
    // Validation pour les vidéos YouTube
    if (updatedData.hasVideo && updatedData.videoUrl && !isValidYouTubeUrl(updatedData.videoUrl)) {
      showNotification('Veuillez entrer une URL YouTube valide ou décocher "Afficher le bouton vidéo"', 'error');
      return;
    }
    
    setToys(prev => prev.map(toy => 
      String(toy.id) === toyId 
        ? { ...toy, ...updatedData, isEditing: false, hasChanges: false }
        : toy
    ));
    setEditingToy(null);
    showNotification('Jouet modifié avec succès !');
  };

  const cancelEditing = () => {
    setEditingToy(null);
  };

  const getCategories = () => {
    const categories = new Set<string>();
    toys.forEach(toy => {
      if (toy.category) {
        toy.category.split(',').forEach(cat => categories.add(cat.trim()));
      }
    });
    return Array.from(categories);
  };

  // Options prédéfinies pour les catégories
  const categoryOptions = [
    'Jeux de construction',
    'Puzzles et casse-têtes',
    'Jeux éducatifs',
    'Jouets électroniques',
    'Jeux de société',
    'Jouets créatifs',
    'Jouets de plein air',
    'Poupées et accessoires',
    'Véhicules et circuits',
    'Instruments de musique',
    'Jeux de rôle',
    'Jouets scientifiques',
    'Autres'
  ];

  // Options prédéfinies pour les âges
  const ageOptions = [
    '0-6 mois',
    '6-12 mois',
    '1-2 ans',
    '2-3 ans',
    '3-4 ans',
    '4-5 ans',
    '5-6 ans',
    '6-8 ans',
    '8-10 ans',
    '10-12 ans',
    '12+ ans',
    'Tous âges'
  ];

  const generateToyId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[ôö]/g, 'o')
      .replace(/[ûüù]/g, 'u')
      .replace(/[ïî]/g, 'i')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 50);
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer un URL temporaire pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      setNewToy({
        ...newToy,
        image: imageUrl,
        hasImage: true
      });
    }
  };


  const handleAddToy = () => {
    if (!newToy.name) {
      showNotification('Veuillez remplir au moins le nom du jouet', 'error');
      return;
    }

    // Validation pour les vidéos YouTube
    if (newToy.hasVideo && newToy.videoUrl && !isValidYouTubeUrl(newToy.videoUrl)) {
      showNotification('Veuillez entrer une URL YouTube valide ou décocher "Afficher le bouton vidéo"', 'error');
      return;
    }

    const toyToAdd: InventoryItem = {
      id: generateToyId(),
      slug: generateSlug(newToy.name),
      name: newToy.name,
      price: 'Prix à définir', // Prix par défaut
      category: newToy.category || '',
      age: newToy.age || '',
      description: newToy.description || '',
      image: newToy.image || '/toys/placeholders/toy-placeholder.svg',
      thumbnail: newToy.image || '/toys/placeholders/toy-placeholder.svg',
      hasImage: newToy.hasImage || false,
      rating: '4',
      stock: '1',
      videoUrl: newToy.videoUrl || '',
      hasVideo: newToy.hasVideo || false,
      source: 'admin',
      isVisible: newToy.isVisible || true,
      isEditing: false,
      hasChanges: false
    };

    setToys(prev => [...prev, toyToAdd]);
    setNewToy({
      name: '',
      category: '',
      age: '',
      description: '',
      image: '/toys/placeholders/toy-placeholder.svg',
      hasImage: false,
      isVisible: true,
      isEditing: false,
      hasChanges: false,
      hasVideo: false,
      videoUrl: '',
    });
    setShowAddForm(false);
    showNotification('Jouet ajouté avec succès !');
  };

  const handleCancelAdd = () => {
    setNewToy({
      name: '',
      category: '',
      age: '',
      description: '',
      image: '/toys/placeholders/toy-placeholder.svg',
      hasImage: false,
      isVisible: true,
      isEditing: false,
      hasChanges: false,
      hasVideo: false,
      videoUrl: '',
    });
    setShowAddForm(false);
  };

  // Fonctions de gestion des prix
  const handleOpenPricingModal = (toy: InventoryItem) => {
    setSelectedToyForPricing(toy);
    
    // Extraire les prix du jouet (simulation - en réalité, ces données viendraient de la base)
    const basePrice = parseFloat(toy.price?.replace(/[^\d.]/g, '') || '25');
    const dailyPrice = basePrice;
    const weeklyPrice = basePrice * 4.8; // 20% de réduction
    const monthlyPrice = basePrice * 15; // 50% de réduction
    
    setEditedPrices({
      daily: dailyPrice,
      weekly: weeklyPrice,
      monthly: monthlyPrice,
      deposit: basePrice * 6, // Caution = 6x le prix journalier
    });

    setShowPricingModal(true);
  };

  const handleClosePricingModal = () => {
    setShowPricingModal(false);
    setSelectedToyForPricing(null);
  };

  const handleSavePricing = () => {
    if (selectedToyForPricing) {
      // Ici, vous feriez l'appel API pour sauvegarder les prix et promotions
      console.log('Sauvegarde des prix pour', selectedToyForPricing.name, ':', editedPrices);
      console.log('Sauvegarde des promotions pour', selectedToyForPricing.name, ':', selectedToyForPricing.promotion);
      
      // Mettre à jour le jouet dans la liste avec les prix et promotions
      setToys(prev => prev.map(toy => 
        String(toy.id) === String(selectedToyForPricing.id)
          ? { 
              ...toy, 
              price: `${editedPrices.weekly.toFixed(0)} MAD/semaine`,
              promotion: selectedToyForPricing.promotion
            }
          : toy
      ));
      
      handleClosePricingModal();
      showNotification('Prix et promotions sauvegardés avec succès !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-mint border-t-transparent"></div>
          <p className="mt-4 text-slate">Chargement de l'inventaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a 
                href="/admin" 
                className="text-sm text-gray-600 hover:text-mint transition-colors"
              >
                ← Dashboard
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-charcoal">Gestion Inventaire</h1>
                <p className="text-sm text-gray-600">Synchronisez et gérez tous les jouets</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {toys.length} jouets • {toys.filter(t => t.isVisible).length} visibles
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 rounded-lg bg-mint px-4 py-2 text-sm font-medium text-white hover:bg-mint/90"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom du jouet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
              >
                <option value="all">Toutes les catégories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
              >
                <option value="all">Tous</option>
                <option value="visible">Visibles</option>
                <option value="hidden">Masqués</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterVisibility("all");
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredToys.map((toy) => (
            <div key={toy.id} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
              {/* Image */}
              <div className="relative h-32 bg-gray-50 rounded-lg mb-3 overflow-hidden">
                {toy.hasImage ? (
                  <Image
                    src={toy.image}
                    alt={toy.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                  {!toy.hasImage && (
                    <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Pas d'image
                    </div>
                  )}
                  {toy.hasVideo && toy.videoUrl && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Vidéo
                    </div>
                  )}
                  {toy.hasVideo && !toy.videoUrl && (
                    <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Vidéo sans URL
                    </div>
                  )}
                  {toy.promotion?.isActive && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span>🎯</span>
                      {toy.promotion.label || 'Promo'}
                    </div>
                  )}
                  {!toy.isVisible && (
                    <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      Masqué
                    </div>
                  )}
                </div>
              </div>

              {/* Toy Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-charcoal text-sm line-clamp-2">{toy.name}</h3>
                
                {toy.category && (
                  <p className="text-xs text-gray-600 line-clamp-1">{toy.category}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mint">{toy.price}</span>
                  <span className="text-xs text-gray-500">{toy.age}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleVisibility(String(toy.id))}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      toy.isVisible 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105'
                    }`}
                  >
                    {toy.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {toy.isVisible ? 'Visible' : 'Masqué'}
                  </button>
                  
                  <button
                    onClick={() => startEditing(toy)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 hover:scale-105"
                  >
                    <Edit className="h-3 w-3" />
                    Modifier
                  </button>
                </div>
                
                <button
                  onClick={() => handleOpenPricingModal(toy)}
                  className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-mint/10 text-mint hover:bg-mint/20 transition-all duration-200 hover:scale-105"
                >
                  <DollarSign className="h-3 w-3" />
                  Gérer les prix
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredToys.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun jouet trouvé</h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || filterCategory !== "all" || filterVisibility !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par ajouter des jouets à votre inventaire"
              }
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingToy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-200 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal">Modifier le jouet</h2>
                <button
                  onClick={cancelEditing}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-6">
                {/* Section Informations de base */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-mint" />
                    Informations de base
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du jouet *</label>
                      <input
                        type="text"
                        value={editingToy.name}
                        onChange={(e) => setEditingToy({...editingToy, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                        placeholder="Ex: Lego Technic"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                      <select
                        value={editingToy.category}
                        onChange={(e) => setEditingToy({...editingToy, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      >
                        {editingToy.category ? (
                          <option value={editingToy.category}>{editingToy.category}</option>
                        ) : (
                          <option value="">Sélectionner une catégorie</option>
                        )}
                        {categoryOptions.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Âge recommandé *</label>
                      <select
                        value={editingToy.age}
                        onChange={(e) => setEditingToy({...editingToy, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      >
                        {editingToy.age ? (
                          <option value={editingToy.age}>{editingToy.age}</option>
                        ) : (
                          <option value="">Sélectionner un âge</option>
                        )}
                        {ageOptions.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix actuel</label>
                      <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                        {editingToy.price}
                        <span className="text-xs text-gray-500 ml-2">(Modifiable via "Gérer les prix")</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image du jouet</label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              alert('Veuillez sélectionner un fichier image valide');
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              alert('L\'image ne doit pas dépasser 5MB');
                              return;
                            }
                            const imageUrl = URL.createObjectURL(file);
                            setEditingToy({...editingToy, image: imageUrl, hasImage: true});
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      />
                      <p className="text-xs text-gray-500">
                        Formats acceptés: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                    
                    {/* Aperçu de l'image actuelle */}
                    {editingToy.image && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu de l'image</label>
                        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <Image
                            src={editingToy.image}
                            alt="Aperçu"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingToy.description}
                      onChange={(e) => setEditingToy({...editingToy, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      placeholder="Description du jouet..."
                    />
                  </div>
                </div>

                {/* Section Visibilité et statut */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Visibilité et statut
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingToy.isVisible}
                        onChange={(e) => setEditingToy({...editingToy, isVisible: e.target.checked})}
                        className="rounded border-gray-300 text-mint focus:ring-mint"
                      />
                      <span className="text-sm text-gray-700">Visible sur le site</span>
                    </label>
                  </div>
                </div>

                {/* Section Vidéo YouTube */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Play className="h-5 w-5 text-red-600" />
                    Vidéo YouTube
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingToy.hasVideo || false}
                        onChange={(e) => setEditingToy({...editingToy, hasVideo: e.target.checked})}
                        className="rounded border-gray-300 text-mint focus:ring-mint"
                      />
                      <span className="text-sm text-gray-700">Afficher le bouton vidéo</span>
                    </label>
                  </div>

                  {editingToy.hasVideo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de la vidéo YouTube</label>
                      <input
                        type="url"
                        value={editingToy.videoUrl || ''}
                        onChange={(e) => setEditingToy({...editingToy, videoUrl: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-mint focus:border-mint ${
                          editingToy.videoUrl && !isValidYouTubeUrl(editingToy.videoUrl) 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {editingToy.videoUrl && !isValidYouTubeUrl(editingToy.videoUrl) && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ URL YouTube invalide. Format attendu: https://www.youtube.com/watch?v=VIDEO_ID
                        </p>
                      )}
                      {editingToy.videoUrl && isValidYouTubeUrl(editingToy.videoUrl) && (
                        <p className="text-xs text-green-600 mt-1">
                          ✅ URL YouTube valide
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Collez l'URL complète de la vidéo YouTube (ex: https://www.youtube.com/watch?v=VIDEO_ID)
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3">
                <button
                  onClick={() => saveChanges(String(editingToy.id), editingToy)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-mint px-4 py-2 font-medium text-white hover:bg-mint/90 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Toy Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-200 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white shadow-xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-charcoal">Ajouter un nouveau jouet</h2>
                <button
                  onClick={handleCancelAdd}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="space-y-6">
                {/* Section Informations de base */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-mint" />
                    Informations de base
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du jouet *</label>
                      <input
                        type="text"
                        value={newToy.name}
                        onChange={(e) => setNewToy({...newToy, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                        placeholder="Ex: Lego Technic"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                      <select
                        value={newToy.category}
                        onChange={(e) => setNewToy({...newToy, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categoryOptions.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Âge recommandé *</label>
                      <select
                        value={newToy.age}
                        onChange={(e) => setNewToy({...newToy, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      >
                        <option value="">Sélectionner un âge</option>
                        {ageOptions.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image du jouet</label>
                      <div className="space-y-2">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      />
                        <p className="text-xs text-gray-500">
                          Formats acceptés: JPG, PNG, GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newToy.description}
                      onChange={(e) => setNewToy({...newToy, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                      placeholder="Description du jouet..."
                    />
                  </div>

                  {/* Aperçu de l'image */}
                  {newToy.hasImage && newToy.image && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aperçu de l'image</label>
                      <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                        <Image
                          src={newToy.image}
                          alt="Aperçu"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Visibilité */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Visibilité
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newToy.isVisible}
                        onChange={(e) => setNewToy({...newToy, isVisible: e.target.checked})}
                        className="rounded border-gray-300 text-mint focus:ring-mint"
                      />
                      <span className="text-sm text-gray-700">Visible sur le site</span>
                    </label>
                </div>

                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note :</strong> Les prix et promotions sont gérés via le bouton "Gérer les prix" dans la liste des jouets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToy}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-mint px-4 py-2 font-medium text-white hover:bg-mint/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter le jouet
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion des prix moderne */}
      {showPricingModal && selectedToyForPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-200 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] rounded-xl bg-white shadow-xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                <h2 className="text-xl font-bold text-charcoal">
                    Gestion des Prix - {selectedToyForPricing.name}
                </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configurez les tarifs journalier, hebdomadaire et mensuel
                  </p>
                </div>
                <button
                  onClick={handleClosePricingModal}
                  className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Gestion des prix */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">
                    Configuration des prix
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-slate mb-2">
                        Prix Journalier (MAD)
                      </label>
                      <input
                        type="number"
                        value={editedPrices.daily}
                        onChange={(e) => setEditedPrices({...editedPrices, daily: Number(e.target.value)})}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate mb-2">
                        Prix Hebdomadaire (MAD)
                      </label>
                      <input
                        type="number"
                        value={editedPrices.weekly}
                        onChange={(e) => setEditedPrices({...editedPrices, weekly: Number(e.target.value)})}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate mb-2">
                        Prix Mensuel (MAD)
                      </label>
                      <input
                        type="number"
                        value={editedPrices.monthly}
                        onChange={(e) => setEditedPrices({...editedPrices, monthly: Number(e.target.value)})}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate mb-2">
                        Caution (MAD)
                      </label>
                      <input
                        type="number"
                        value={editedPrices.deposit}
                        onChange={(e) => setEditedPrices({...editedPrices, deposit: Number(e.target.value)})}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mint focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Gestion des promotions */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <span className="text-green-600">🎯</span>
                    Gestion des promotions
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedToyForPricing?.promotion?.isActive || false}
                          onChange={(e) => {
                            if (selectedToyForPricing) {
                              setSelectedToyForPricing({
                                ...selectedToyForPricing,
                                promotion: {
                                  ...selectedToyForPricing.promotion,
                                  isActive: e.target.checked,
                                  type: selectedToyForPricing.promotion?.type || 'percentage',
                                  value: selectedToyForPricing.promotion?.value || '',
                                  label: selectedToyForPricing.promotion?.label || '',
                                  startDate: selectedToyForPricing.promotion?.startDate || '',
                                  endDate: selectedToyForPricing.promotion?.endDate || ''
                                }
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-mint focus:ring-mint"
                        />
                        <span className="text-sm text-gray-700">Activer la promotion</span>
                      </label>
                    </div>

                    {selectedToyForPricing?.promotion?.isActive && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type de promotion</label>
                            <select
                              value={selectedToyForPricing.promotion?.type || 'percentage'}
                              onChange={(e) => {
                                if (selectedToyForPricing) {
                                  setSelectedToyForPricing({
                                    ...selectedToyForPricing,
                                    promotion: {
                                      isActive: selectedToyForPricing.promotion?.isActive || false,
                                      type: e.target.value as 'percentage' | 'fixed' | 'text',
                                      value: selectedToyForPricing.promotion?.value || '',
                                      label: selectedToyForPricing.promotion?.label || '',
                                      startDate: selectedToyForPricing.promotion?.startDate || '',
                                      endDate: selectedToyForPricing.promotion?.endDate || ''
                                    }
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                            >
                              <option value="percentage">Pourcentage</option>
                              <option value="fixed">Montant fixe</option>
                              <option value="text">Texte personnalisé</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {selectedToyForPricing.promotion?.type === 'percentage' ? 'Pourcentage (%)' : 
                               selectedToyForPricing.promotion?.type === 'fixed' ? 'Montant (MAD)' : 'Texte'}
                            </label>
                            <input
                              type={selectedToyForPricing.promotion?.type === 'percentage' || selectedToyForPricing.promotion?.type === 'fixed' ? 'number' : 'text'}
                              value={selectedToyForPricing.promotion?.value || ''}
                              onChange={(e) => {
                                if (selectedToyForPricing) {
                                  setSelectedToyForPricing({
                                    ...selectedToyForPricing,
                                    promotion: {
                                      isActive: selectedToyForPricing.promotion?.isActive || false,
                                      type: selectedToyForPricing.promotion?.type || 'percentage',
                                      value: e.target.value,
                                      label: selectedToyForPricing.promotion?.label || '',
                                      startDate: selectedToyForPricing.promotion?.startDate || '',
                                      endDate: selectedToyForPricing.promotion?.endDate || ''
                                    }
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                              placeholder={selectedToyForPricing.promotion?.type === 'percentage' ? 'Ex: 20' : 
                                           selectedToyForPricing.promotion?.type === 'fixed' ? 'Ex: 10' : 'Ex: Offre spéciale'}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Label de la promotion</label>
                          <input
                            type="text"
                            value={selectedToyForPricing.promotion?.label || ''}
                            onChange={(e) => {
                              if (selectedToyForPricing) {
                                setSelectedToyForPricing({
                                  ...selectedToyForPricing,
                                  promotion: {
                                    isActive: selectedToyForPricing.promotion?.isActive || false,
                                    type: selectedToyForPricing.promotion?.type || 'percentage',
                                    value: selectedToyForPricing.promotion?.value || '',
                                    label: e.target.value,
                                    startDate: selectedToyForPricing.promotion?.startDate || '',
                                    endDate: selectedToyForPricing.promotion?.endDate || ''
                                  }
                                });
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                            placeholder="Ex: -20% ou Offre limitée"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début (optionnel)</label>
                            <input
                              type="date"
                              value={selectedToyForPricing.promotion?.startDate || ''}
                              onChange={(e) => {
                                if (selectedToyForPricing) {
                                  setSelectedToyForPricing({
                                    ...selectedToyForPricing,
                                    promotion: {
                                      isActive: selectedToyForPricing.promotion?.isActive || false,
                                      type: selectedToyForPricing.promotion?.type || 'percentage',
                                      value: selectedToyForPricing.promotion?.value || '',
                                      label: selectedToyForPricing.promotion?.label || '',
                                      startDate: e.target.value,
                                      endDate: selectedToyForPricing.promotion?.endDate || ''
                                    }
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin (optionnel)</label>
                            <input
                              type="date"
                              value={selectedToyForPricing.promotion?.endDate || ''}
                              onChange={(e) => {
                                if (selectedToyForPricing) {
                                  setSelectedToyForPricing({
                                    ...selectedToyForPricing,
                                    promotion: {
                                      isActive: selectedToyForPricing.promotion?.isActive || false,
                                      type: selectedToyForPricing.promotion?.type || 'percentage',
                                      value: selectedToyForPricing.promotion?.value || '',
                                      label: selectedToyForPricing.promotion?.label || '',
                                      startDate: selectedToyForPricing.promotion?.startDate || '',
                                      endDate: e.target.value
                                    }
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-mint focus:border-mint"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3">
                <button
                  onClick={handleSavePricing}
                  className="flex items-center gap-2 rounded-xl bg-mint px-6 py-3 text-white hover:bg-mint/90 transition"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder les prix
                </button>
                <button
                  onClick={handleClosePricingModal}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <CheckCircle className={`h-5 w-5 ${
              notification.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`} />
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
