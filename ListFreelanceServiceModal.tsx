
import React, { useState, useEffect } from 'react';
import { FreelanceServiceListing, FreelanceCategory, MarketplaceRateType, MarketplaceListingType } from '../types';
import { XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ListFreelanceServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FreelanceServiceListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => void;
}

const ListFreelanceServiceModal: React.FC<ListFreelanceServiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [listingType, setListingType] = useState<MarketplaceListingType>(MarketplaceListingType.OFFERING);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FreelanceCategory>(FreelanceCategory.OTHER_GIGS);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [rateType, setRateType] = useState<MarketplaceRateType>(MarketplaceRateType.PER_HOUR);
  const [availability, setAvailability] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setListingType(MarketplaceListingType.OFFERING);
      setTitle('');
      setCategory(FreelanceCategory.OTHER_GIGS);
      setDescription('');
      setSkills('');
      setPortfolioLink('');
      setRate('');
      setRateType(MarketplaceRateType.PER_HOUR);
      setAvailability('');
      setContactInfo('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !contactInfo.trim()) {
      alert('Please fill in Title, Description, and Contact Information.');
      return;
    }
    if (rateType !== MarketplaceRateType.FREE && rateType !== MarketplaceRateType.NEGOTIABLE && rate === '') {
      alert('Please specify a rate or choose Free/Negotiable.');
      return;
    }

    onSubmit({
      listingType,
      title: title.trim(),
      category,
      description: description.trim(),
      skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      portfolioLink: portfolioLink.trim() || undefined,
      rate: (rateType === MarketplaceRateType.FREE || rateType === MarketplaceRateType.NEGOTIABLE || rate === '') ? undefined : Number(rate),
      rateType: (rateType === MarketplaceRateType.FREE || rateType === MarketplaceRateType.NEGOTIABLE || rate === '') ? rateType : rateType,
      availability: availability.trim() || undefined,
      contactInfo: contactInfo.trim(),
    });
    onClose();
  };
  
  const isPaidRateType = rateType !== MarketplaceRateType.FREE && rateType !== MarketplaceRateType.NEGOTIABLE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 flex items-center justify-center p-4 z-[70] transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="list-fl-modal-title">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-xl transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="list-fl-modal-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-yellow-500 dark:text-yellow-400" />
            {listingType === MarketplaceListingType.OFFERING ? 'Offer Freelance Service / Gig' : 'Request Freelance Service / Gig'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Close modal">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="flListingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am...</label>
            <select id="flListingType" value={listingType} onChange={e => setListingType(e.target.value as MarketplaceListingType)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500">
              {Object.values(MarketplaceListingType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="flTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service / Gig Title <span className="text-red-500">*</span></label>
            <input type="text" id="flTitle" value={title} onChange={e => setTitle(e.target.value)} required placeholder={listingType === MarketplaceListingType.OFFERING ? "e.g., Professional Logo Design" : "e.g., Need Wedding Photographer"} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
          </div>

          <div>
            <label htmlFor="flCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category <span className="text-red-500">*</span></label>
            <select id="flCategory" value={category} onChange={e => setCategory(e.target.value as FreelanceCategory)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500">
              {Object.values(FreelanceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="flDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detailed Description <span className="text-red-500">*</span></label>
            <textarea id="flDescription" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" placeholder="Describe your service, experience, what's included, or the specific help you need."></textarea>
          </div>

          <div>
            <label htmlFor="flSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relevant Skills (comma-separated)</label>
            <input type="text" id="flSkills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Adobe Photoshop, Python, Event Planning" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
          </div>

          <div>
            <label htmlFor="flPortfolioLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio/Website Link (Optional)</label>
            <input type="url" id="flPortfolioLink" value={portfolioLink} onChange={e => setPortfolioLink(e.target.value)} placeholder="e.g., https://yourportfolio.com" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="flRateType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate Type</label>
              <select id="flRateType" value={rateType} onChange={e => setRateType(e.target.value as MarketplaceRateType)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500">
                {Object.values(MarketplaceRateType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            {isPaidRateType && (
              <div>
                <label htmlFor="flRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rate (₦) {isPaidRateType ? <span className="text-red-500">*</span> : ''}</label>
                <input type="number" id="flRate" value={rate} onChange={e => setRate(e.target.value === '' ? '' : parseFloat(e.target.value))} required={isPaidRateType} min="0" step="1" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
            )}
             {!isPaidRateType && <div />}
          </div>
          
          <div>
            <label htmlFor="flAvailability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability (Optional)</label>
            <input type="text" id="flAvailability" value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g., Weekends, Evenings, 10 hrs/week" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
          </div>

          <div>
            <label htmlFor="flContactInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Information <span className="text-red-500">*</span></label>
            <input type="text" id="flContactInfo" value={contactInfo} onChange={e => setContactInfo(e.target.value)} required placeholder="e.g., your_email@example.com, Phone, Platform DM" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-md shadow-sm">Submit Listing</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListFreelanceServiceModal;
