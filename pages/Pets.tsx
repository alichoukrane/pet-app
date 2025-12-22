
import React, { useState, useRef } from 'react';
import { usePetContext } from '../context/PetContext';
import PetCard from '../components/PetCard';
import { Pet, Species, Sex } from '../types';
import { Plus, X, Camera, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GeminiService } from '../services/geminiService';

const getPhotoForSpecies = (species: Species) => {
  const images: Record<string, string[]> = {
    Dog: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&h=400&q=80'
    ],
    Cat: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1495360019602-e0019216adfe?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&h=400&q=80'
    ],
    Bird: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb8?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1452570053594-1b985d6ea218?auto=format&fit=crop&w=400&h=400&q=80'
    ],
    Rabbit: [
      'https://images.unsplash.com/photo-1585110396067-2759889e57e6?auto=format&fit=crop&w=400&h=400&q=80',
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=400&h=400&q=80'
    ],
    Fish: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&h=400&q=80',
    ],
    Reptile: [
      'https://images.unsplash.com/photo-1506655110441-68a5d87181aa?auto=format&fit=crop&w=400&h=400&q=80',
    ],
    Other: [
      'https://images.unsplash.com/photo-1525672746312-13c43168ba2d?auto=format&fit=crop&w=400&h=400&q=80'
    ]
  };

  // Fallback to 'Other' if species not found, though keys match Species type
  const pool = images[species] || images['Other'];
  return pool[Math.floor(Math.random() * pool.length)];
};

const Pets: React.FC = () => {
  const { t } = useTranslation();
  const { pets, addPet, updatePet, removePet, addReminder } = usePetContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('Dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState<Sex>('Male');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (pet: Pet) => {
    setEditingId(pet.id);
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed);
    setSex(pet.sex);
    setDob(pet.dob ? new Date(pet.dob).toISOString().split('T')[0] : '');
    setWeight(pet.weight.toString());
    setNotes(pet.notes || '');
    setPhotoUrl(pet.photoUrl || '');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine final photo
    const finalPhoto = photoUrl || getPhotoForSpecies(species);

    if (editingId) {
        // Update existing
        const updatedPet: Pet = {
            id: editingId,
            name,
            species,
            breed,
            sex,
            dob,
            weight: parseFloat(weight),
            photoUrl: finalPhoto,
            notes
        };
        updatePet(updatedPet);
        setIsModalOpen(false);
        resetForm();
    } else {
        // Create new
        const newPet: Pet = {
          id: Date.now().toString(),
          name,
          species,
          breed,
          sex,
          dob,
          weight: parseFloat(weight),
          photoUrl: finalPhoto,
          notes
        };

        addPet(newPet);
        
        // Auto-generate reminders if confirmed
        if (confirm(t('pets.modal.generating') + " Would you like AI to generate a care schedule?")) {
            setIsGenerating(true);
            const reminders = await GeminiService.getSuggestedSchedule(newPet);
            reminders.forEach((r: any) => {
                addReminder({
                    id: Math.random().toString(36).substr(2, 9),
                    petId: newPet.id,
                    title: r.title,
                    type: r.type,
                    dateTime: new Date().toISOString(), // Default to today
                    recurrence: r.recurrence,
                    completed: false,
                    notes: r.note
                });
            });
            setIsGenerating(false);
            alert(t('pets.modal.addedSchedule', { name: newPet.name }));
        }

        setIsModalOpen(false);
        resetForm();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSpecies('Dog');
    setBreed('');
    setSex('Male');
    setDob('');
    setWeight('');
    setNotes('');
    setPhotoUrl('');
  };

  const handleClose = () => {
      setIsModalOpen(false);
      resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('pets.title')}</h1>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-2xl font-medium shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> {t('pets.addPet')}
        </button>
      </div>

      {isGenerating && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl animate-pulse">
              {t('pets.modal.generating')}
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pets.map(pet => (
          <PetCard 
            key={pet.id} 
            pet={pet} 
            onDelete={removePet}
            onEdit={handleEdit}
          />
        ))}
        {pets.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 text-lg">{t('pets.noPets')}</p>
            </div>
        )}
      </div>

      {/* Add/Edit Pet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? t('petCard.edit') : t('pets.modal.title')}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Photo Upload */}
              <div className="flex justify-center mb-2">
                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-500 transition-colors flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={32} className="text-gray-400" />
                        )}
                     </div>
                     <div className="absolute bottom-0 right-0 bg-teal-500 text-white p-1.5 rounded-full shadow-md">
                        <Upload size={12} />
                     </div>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                     />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.name')}</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white" placeholder="Pet's Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.species')}</label>
                    <select value={species} onChange={e => setSpecies(e.target.value as Species)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white">
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Fish">Fish</option>
                        <option value="Reptile">Reptile</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.sex')}</label>
                    <select value={sex} onChange={e => setSex(e.target.value as Sex)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.breed')}</label>
                <input required type="text" value={breed} onChange={e => setBreed(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white" placeholder="e.g. Golden Retriever" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.dob')}</label>
                     <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pets.modal.weight')}</label>
                     <input required type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white" placeholder="0.0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea 
                    rows={3}
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    className="w-full rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 outline-none dark:text-white resize-none" 
                    placeholder="Allergies, microchip ID, etc." 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    {t('taskModal.cancel')}
                </button>
                <button type="submit" className="flex-[2] bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-teal-500/30 transition-all">
                    {editingId ? t('taskModal.save') : t('pets.modal.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;
    