import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, MapPin, AlertCircle, Sparkles } from 'lucide-react';

// Simulated AI image analysis function - maps filename to category key
function analyzeImage(fileName) {
  const lowerName = fileName.toLowerCase();
  
  // Map filename keywords to category keys
  if (lowerName.includes('smoke') || lowerName.includes('fire')) {
    return { category: 'CONTAMINATED_WATER', confidence: 80 };
  }
  if (lowerName.includes('water') || lowerName.includes('flood') || lowerName.includes('wet')) {
    return { category: 'CONTAMINATED_WATER', confidence: 80 };
  }
  if (lowerName.includes('dirty') || lowerName.includes('contamination')) {
    return { category: 'CONTAMINATED_WATER', confidence: 85 };
  }
  if (lowerName.includes('drain') || lowerName.includes('sewage')) {
    return { category: 'OPEN_DRAINAGE', confidence: 80 };
  }
  if (lowerName.includes('crack') || lowerName.includes('damage') || lowerName.includes('break')) {
    return { category: 'BROKEN_FACILITY', confidence: 75 };
  }
  if (lowerName.includes('soap') || lowerName.includes('hygiene')) {
    return { category: 'LACK_SOAP', confidence: 70 };
  }
  if (lowerName.includes('accident') || lowerName.includes('crash')) {
    return { category: 'OTHER', confidence: 65 };
  }
  
  return null; // No detection
}

// Get display info for detected category
function getCategoryDisplay(categoryKey) {
  const icons = {
    'CONTAMINATED_WATER': '💧',
    'BROKEN_FACILITY': '🚽',
    'OPEN_DRAINAGE': '🕳️',
    'LACK_SOAP': '🧼',
    'OTHER': '⚠️'
  };
  const names = {
    'CONTAMINATED_WATER': 'Contaminated Water',
    'BROKEN_FACILITY': 'Broken Facility',
    'OPEN_DRAINAGE': 'Open Drainage',
    'LACK_SOAP': 'Lack of Soap',
    'OTHER': 'Other Issue'
  };
  return { icon: icons[categoryKey] || '🤖', name: names[categoryKey] || categoryKey };
}

export default function ReportForm() {
  const { addReport, CATEGORIES } = useApp();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [aiDetection, setAiDetection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPhotoName(file.name);
        
        // Run AI analysis simulation
        const detection = analyzeImage(file.name);
        setAiDetection(detection);
        
        // Auto-select the detected category if one was found
        if (detection && !category) {
          setCategory(detection.category);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Get random coordinates near a default location (New Delhi)
    const latitude = 28.6139 + (Math.random() - 0.5) * 0.2;
    const longitude = 77.2090 + (Math.random() - 0.5) * 0.2;

    addReport({
      category,
      description,
      address,
      photoUrl: photo,
      latitude,
      longitude,
    });

    // Reset form
    setCategory('');
    setDescription('');
    setAddress('');
    setPhoto(null);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <AlertCircle className="text-primary-600" />
          Report an Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Issue Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category === key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline mr-2" size={16} />
              Location
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter the location of the issue"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="inline mr-2" size={16} />
              Photo Evidence (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
            >
              {photo ? (
                <img
                  src={photo}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              ) : (
                <>
                  <Camera className="mx-auto text-gray-400 mb-2" size={40} />
                  <p className="text-gray-600">Tap to take or upload photo</p>
                </>
              )}
            </div>
            
            {/* AI Detection Result */}
            {aiDetection && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 flex items-center gap-3">
                <Sparkles className="text-purple-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-purple-800">
                    🤖 AI detected: {getCategoryDisplay(aiDetection.category).name} (confidence {aiDetection.confidence}%)
                  </p>
                  <p className="text-xl">{getCategoryDisplay(aiDetection.category).icon}</p>
                  {!category && <p className="text-xs text-purple-600 mt-1">Category auto-selected</p>}
                  {category === aiDetection.category && <p className="text-xs text-green-600 mt-1">✓ Category selected</p>}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
