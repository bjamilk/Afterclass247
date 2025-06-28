import React, { useState, useMemo, useEffect } from 'react';
import {
  BuildingStorefrontIcon, AcademicCapIcon, BookOpenIcon, UsersIcon, ComputerDesktopIcon, DocumentMagnifyingGlassIcon,
  MegaphoneIcon, TicketIcon, ShoppingBagIcon, SparklesIcon, TruckIcon, HomeIcon, CurrencyDollarIcon,
  WrenchScrewdriverIcon, MusicalNoteIcon, VideoCameraIcon, ShareIcon, LightBulbIcon, ChatBubbleLeftRightIcon,
  ShieldCheckIcon, AdjustmentsHorizontalIcon, BellAlertIcon, HeartIcon, MagnifyingGlassIcon, MapPinIcon,
  CreditCardIcon, LifebuoyIcon, PuzzlePieceIcon, ArrowTrendingUpIcon, IdentificationIcon, GlobeAltIcon,
  BriefcaseIcon, SwatchIcon, TableCellsIcon, ClipboardDocumentListIcon, ArrowPathIcon, BanknotesIcon, CameraIcon, PaintBrushIcon, PlayCircleIcon, SignalIcon, UserCircleIcon, CakeIcon, DevicePhoneMobileIcon, TvIcon, ArchiveBoxIcon, PlusCircleIcon, TagIcon, ArrowUturnLeftIcon, InformationCircleIcon, FunnelIcon, XMarkIcon, CalendarDaysIcon, ClockIcon, CheckBadgeIcon, QuestionMarkCircleIcon, ChatBubbleBottomCenterTextIcon, PencilSquareIcon, ChatBubbleLeftEllipsisIcon, BoltIcon, FlagIcon, LinkIcon, UserPlusIcon, HomeModernIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid, NoSymbolIcon } from '@heroicons/react/24/solid';
import { 
    TextbookListing, TextbookCondition, 
    StudyGroupListing, MeetingPreference, 
    TutorListing, TutoringSubjectProficiency, TutoringDeliveryMethod, MarketplaceRateType,
    LostAndFoundItem, LostAndFoundCategory, LostAndFoundStatus, 
    PeerReviewServiceListing, PeerReviewServiceType, MarketplaceListingType,
    ThesisSupportListing, ThesisSupportType,
    ClubProfile, ClubType, MembershipTier,
    EventTicketListing, CampusEventType,
    MerchandiseItem, MerchandiseCategory,
    FreelanceServiceListing, FreelanceCategory,
    RentalListing, EquipmentCategory,
    RideShareListing, RideShareType, RideRecurrence,
    BikeScooterListing, BikeScooterListingType, BikeScooterType, BikeScooterCondition,
    SubletListing, FurnishedStatus, 
    RoommateListing, RoommateListingType,
    FoodListing, FoodCategory, DietaryInfo,
    SecondHandGood, SecondHandCategory,
    User 
} from '../types'; 
import ListTextbookModal from './ListTextbookModal';
import ListStudyGroupModal from './ListStudyGroupModal'; 
import ListTutorModal from './ListTutorModal'; 
import ListLostAndFoundItemModal from './ListLostAndFoundItemModal';
import ListPeerReviewModal from './ListPeerReviewModal'; 
import ListThesisSupportModal from './ListThesisSupportModal'; 
import ListClubProfileModal from './ListClubProfileModal';
import ListEventTicketModal from './ListEventTicketModal';
import ListMerchandiseItemModal from './ListMerchandiseItemModal';
import ListFreelanceServiceModal from './ListFreelanceServiceModal';
import ListRentalItemModal from './ListRentalItemModal';
import ListRideShareModal from './ListRideShareModal';
import ListBikeScooterModal from './ListBikeScooterModal';
import ListSubletModal from './ListSubletModal';
import ListRoommateModal from './ListRoommateModal';
import ListFoodModal from './ListFoodModal';
import ListSecondHandGoodModal from './ListSecondHandGoodModal';

interface MarketplaceScreenProps {
  currentUser: User;
  onPurchase: (item: any, itemType: string) => { success: boolean, itemId: string, itemType: string } | undefined;
}

const MOCK_CURRENT_USER_MARKETPLACE: Pick<User, 'id' | 'name'> = {
  id: 'user1',
  name: 'You',
};


interface Feature {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  details?: string[];
  action?: () => void; 
}

interface Section {
  id: string;
  title: string;
  features: Feature[];
}

const MOCK_TEXTBOOKS_INITIAL: TextbookListing[] = [
  { id: 'tb1', title: 'Organic Chemistry, 10th Edition', author: 'Paula Yurkanis Bruice', isbn: '978-0134042282', course: 'CHEM201', price: 7500, condition: TextbookCondition.GOOD, sellerName: 'Alice W.', sellerId: 'user2', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), imageUrl: 'https://picsum.photos/seed/book1/200/300' },
  { id: 'tb2', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', course: 'MATH150', price: 9000, condition: TextbookCondition.LIKE_NEW, sellerName: 'Bob B.', sellerId: 'user3', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), imageUrl: 'https://picsum.photos/seed/book2/200/300' },
  { id: 'tb3', title: 'Biology, 12th Edition', author: 'Sylvia Mader, Michael Windelspecht', isbn: '978-1259824906', course: 'BIO101', price: 6000, condition: TextbookCondition.FAIR, sellerName: 'Alice W.', sellerId: 'user2', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), description: 'Some highlighting in first few chapters.' },
  { id: 'tb4', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', course: 'CS310', price: 11000, condition: TextbookCondition.NEW, sellerName: 'You', sellerId: 'user1', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), imageUrl: 'https://picsum.photos/seed/book3/200/300' },
];

const MOCK_STUDY_GROUPS_INITIAL: StudyGroupListing[] = [
  { id: 'sg1', groupName: 'CS101 Midterm Cram', course: 'CS101', topic: 'Midterm Exam Prep', description: 'Intensive review sessions for the upcoming CS101 midterm. Covering all topics from week 1-7.', meetingPreference: MeetingPreference.ONLINE, contactInfo: 'Discord: CS101Cram#1234', maxSize: 10, currentSize: 3, listedBy: 'Alice W.', listedById: 'user2', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), tags: ['midterm', 'exam review', 'programming'], meetingTime: "Mon & Wed 7-9 PM", rating: 4.8, reviewCount: 5 },
  { id: 'sg2', groupName: 'BIO202 Photosynthesis Experts', course: 'BIO202', topic: 'Photosynthesis Deep Dive', description: 'Weekly discussions and problem-solving focused on understanding photosynthesis mechanisms.', meetingPreference: MeetingPreference.OFFLINE, contactInfo: 'Meet at Library Room 3B', maxSize: 5, currentSize: 5, listedBy: 'Bob B.', listedById: 'user3', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), tags: ['biology', 'photosynthesis', 'problem-solving'], location: "Library Room 3B", meetingTime: "Thursdays 3 PM", rating: 5.0, reviewCount: 2},
  { id: 'sg3', groupName: 'Calculus Study Buddies', course: 'MATH150', topic: 'Homework & Concepts', description: 'Casual group to work on homework problems and clarify calculus concepts together.', meetingPreference: MeetingPreference.HYBRID, contactInfo: 'GroupMe link available on request', listedBy: 'You', listedById: 'user1', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 2), tags: ['homework help', 'calculus', 'peer learning'], meetingTime: "Flexible / Online Check-ins", rating: 4.5, reviewCount: 8 },
];

const MOCK_TUTORS_INITIAL: TutorListing[] = [
    { id: 'tutor1', tutorName: 'Dr. Emily Carter', tutorId: 'user4', subjects: ['Physics I & II', 'Advanced Mechanics'], courses: ['PHYS101', 'PHYS102', 'PHYS301'], overallProficiency: TutoringSubjectProficiency.EXPERT, rate: 45000, rateType: MarketplaceRateType.PER_HOUR, deliveryMethod: TutoringDeliveryMethod.ONLINE, availability: 'Mon, Wed 6-9 PM ET', bio: 'PhD in Physics with 5+ years of teaching experience. Passionate about making physics understandable.', contactInfo: 'emily.carter.tutor@example.com', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), avatarUrl: 'https://picsum.photos/seed/tutor1/100/100', schoolOfStudy: 'MIT', rating: 4.9, reviewCount: 34 },
    { id: 'tutor2', tutorName: 'John Davis', tutorId: 'user5', subjects: ['Calculus I', 'Linear Algebra', 'Statistics'], courses: ['MATH150', 'MATH220', 'STAT200'], overallProficiency: TutoringSubjectProficiency.ADVANCED, rate: 30000, rateType: MarketplaceRateType.PER_HOUR, deliveryMethod: TutoringDeliveryMethod.IN_PERSON, availability: 'Tues, Thurs afternoons; Sat mornings', bio: 'Math Masters student, A+ in all listed courses. Friendly and patient.', contactInfo: 'Text (555) 123-4567', listedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), avatarUrl: 'https://picsum.photos/seed/tutor2/100/100', location: "Campus Library Study Rooms, Unilag", schoolOfStudy: "University of Lagos", rating: 4.7, reviewCount: 19 },
];

const MOCK_LOST_FOUND_ITEMS_INITIAL: LostAndFoundItem[] = [
  { id: 'lf1', itemName: 'Black iPhone 12', description: 'Lost near the main library entrance. Has a small scratch on the top right corner. Lock screen is a picture of a cat.', category: LostAndFoundCategory.ELECTRONICS, status: LostAndFoundStatus.LOST, dateLostOrFound: new Date(Date.now() - 1000 * 60 * 60 * 48), locationLostOrFound: 'Main Library Entrance', contactInfo: 'you@example.com (Poster)', postedByUserId: 'user1', postedByUserName: 'You', postedDate: new Date(Date.now() - 1000 * 60 * 60 * 47), imageUrl: 'https://picsum.photos/seed/iphone/200/200', isResolved: false },
  { id: 'lf2', itemName: 'Found: Set of Keys', description: 'Found a set of keys on a blue lanyard in the Student Union cafeteria. Has a small Eiffel Tower keychain.', category: LostAndFoundCategory.KEYS, status: LostAndFoundStatus.FOUND, dateLostOrFound: new Date(Date.now() - 1000 * 60 * 60 * 24), locationLostOrFound: 'Student Union Cafeteria', contactInfo: 'Contact Admin Office, Ref #F102', postedByUserId: 'user2', postedByUserName: 'Alice W.', postedDate: new Date(Date.now() - 1000 * 60 * 60 * 23), isResolved: false },
];

const MOCK_PEER_REVIEW_LISTINGS_INITIAL: PeerReviewServiceListing[] = [
    { id: 'pr1', listingType: MarketplaceListingType.OFFERING, serviceType: PeerReviewServiceType.PROOFREADING, title: "Quick Proofreading for Essays (Humanities)", description: "Offering proofreading services for humanities essays up to 3000 words. Focus on grammar, spelling, and punctuation. Quick turnaround.", subjectsOrSkills: ["Essay Writing", "Humanities", "English", "History"], rate: 5000, rateType: MarketplaceRateType.PER_ITEM, turnaroundTime: "24-48 hours", contactInfo: "you@example.com", postedByUserId: "user1", postedByUserName: "You", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), rating: 5.0, reviewCount: 12 },
    { id: 'pr2', listingType: MarketplaceListingType.REQUESTING, serviceType: PeerReviewServiceType.CONTENT_REVIEW, title: "Need Content Review for CS Project Report", description: "Looking for someone to review my final year project report (Computer Science) for clarity, structure, and completeness of arguments. Approx 20 pages.", subjectsOrSkills: ["Computer Science", "Technical Writing", "Software Engineering"], rateType: MarketplaceRateType.NEGOTIABLE, contactInfo: "alice.w@example.com", postedByUserId: "user2", postedByUserName: "Alice W.", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) },
];

const MOCK_THESIS_SUPPORT_LISTINGS_INITIAL: ThesisSupportListing[] = [
    { id: 'ts1', listingType: MarketplaceListingType.OFFERING, supportType: ThesisSupportType.DATA_ANALYSIS_INTERPRETATION, title: "SPSS & R Data Analysis for Social Sciences Thesis", description: "Experienced in quantitative data analysis using SPSS and R. Can help with study design, analysis, and interpretation of results for undergraduate or Master's theses.", fieldOfStudy: ["Sociology", "Psychology", "Political Science"], specificSkills: ["SPSS", "R", "Quantitative Analysis", "Survey Design"], rate: 15000, rateType: MarketplaceRateType.PER_HOUR, availability: "Evenings and Weekends", contactInfo: "bob.b.consult@example.com", postedByUserId: "user3", postedByUserName: "Bob B.", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), rating: 4.8, reviewCount: 7 },
    { id: 'ts2', listingType: MarketplaceListingType.REQUESTING, supportType: ThesisSupportType.LITERATURE_REVIEW, title: "Help Needed: Literature Review for Biology Thesis", description: "Struggling to find and synthesize literature for my honors biology thesis on marine plastic pollution. Need guidance on search strategies and structuring the review. ", fieldOfStudy: ["Biology", "Marine Science", "Environmental Science"], rateType: MarketplaceRateType.PER_SESSION, contactInfo: "you.student@example.com", postedByUserId: "user1", postedByUserName: "You", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 3) },
];

const MOCK_CLUB_PROFILES_INITIAL: ClubProfile[] = [
  { id: 'club1', clubName: 'Tech Innovators Club', clubType: ClubType.TECHNOLOGY_INNOVATION, description: 'Exploring new tech, coding workshops, and guest speakers from the industry.', contactEmail: 'techclub@campus.edu', logoUrl: 'https://picsum.photos/seed/techclub/100/100', meetingInfo: 'Wednesdays 6 PM, Eng. Building Rm 101', membershipTiers: [{ id: 't1', name: 'Annual Member', price: 2000, duration: 'Annual', benefits: ['Full access to workshops', 'Voting rights', 'Club T-shirt'] }], listedByUserId: 'user2', listedByUserName: 'Alice W.', listedDate: new Date(Date.now() - 1000*60*60*24*7), rating: 4.6, reviewCount: 42 },
  { id: 'club2', clubName: 'Campus Film Society', clubType: ClubType.ARTS_CULTURE, description: 'Weekly movie screenings, discussions, and filmmaking workshops.', contactEmail: 'filmsoc@campus.edu', logoUrl: 'https://picsum.photos/seed/filmclub/100/100', meetingInfo: 'Fridays 7 PM, Arts Hall Theatre', membershipTiers: [{id: 't2a', name: 'Semester Pass', price: 1000, duration: 'Semester', benefits: ['Free entry to all screenings', 'Workshop discounts']}, {id: 't2b', name: 'Day Pass (Non-member)', price: 200, duration: 'One-Time', benefits: ['Entry to one screening']}], listedByUserId: 'user3', listedByUserName: 'Bob B.', listedDate: new Date(Date.now() - 1000*60*60*24*3), rating: 4.8, reviewCount: 89 },
];

const MOCK_EVENT_TICKETS_INITIAL: EventTicketListing[] = [
  { id: 'evt1', eventName: 'Spring Music Fest', eventType: CampusEventType.CONCERT_PERFORMANCE, eventDate: new Date(new Date().setDate(new Date().getDate() + 14)), location: 'Main Campus Green', description: 'Annual music festival featuring local bands and student performers.', sellingPrice: 1500, quantityAvailable: 50, ticketType: 'General Admission', isResale: false, sellerName: 'Student Union Board', sellerId: 'club_SUB', sellerContact: 'sub_events@campus.edu', postedDate: new Date(Date.now() - 1000*60*60*24*2), eventImageUrl: 'https://picsum.photos/seed/musicfest/300/200' },
  { id: 'evt2', eventName: 'Resale: Guest Lecture Ticket - Dr. Anya Sharma', eventType: CampusEventType.GUEST_LECTURE, eventDate: new Date(new Date().setDate(new Date().getDate() + 5)), location: 'Science Auditorium', description: 'Unable to attend. Selling one ticket to the talk by renowned astrophysicist Dr. Anya Sharma.', originalPrice: 500, sellingPrice: 400, quantityAvailable: 1, ticketType: 'Student Ticket', isResale: true, sellerName: 'You', sellerId: 'user1', sellerContact: 'you@example.com', postedDate: new Date(Date.now() - 1000*60*30), eventImageUrl: 'https://picsum.photos/seed/lecture/300/200' },
];

const MOCK_MERCHANDISE_ITEMS_INITIAL: MerchandiseItem[] = [
  { id: 'merch1', itemName: 'Official Campus Hoodie (Blue)', category: MerchandiseCategory.APPAREL, description: 'Comfortable cotton-blend hoodie with official campus logo. Available in various sizes.', price: 3500, sellerInfo: 'Campus Bookstore', images: ['https://picsum.photos/seed/hoodie1/200/200', 'https://picsum.photos/seed/hoodie2/200/200'], availableSizes: ['S', 'M', 'L', 'XL'], stockQuantity: 100, contactForPurchase: 'Visit Campus Bookstore or online store.', postedByUserId: 'dept_Bookstore', postedByUserName: 'Bookstore Admin', postedDate: new Date(Date.now() - 1000*60*60*24*10), rating: 4.5, reviewCount: 112 },
  { id: 'merch2', itemName: 'Debate Club Limited Edition Mug', category: MerchandiseCategory.HOME_DECOR_DORM, description: 'Collector\'s edition mug for the Debate Club. Great for coffee or tea!', price: 1200, sellerInfo: 'Debate Club', images: ['https://picsum.photos/seed/mug1/200/200'], stockQuantity: 25, contactForPurchase: 'DM @DebateClub on CampusNet', postedByUserId: 'club_Debate', postedByUserName: 'Debate Club Admin', postedDate: new Date(Date.now() - 1000*60*60*24*1), rating: 4.9, reviewCount: 21 },
];

const MOCK_FREELANCE_LISTINGS_INITIAL: FreelanceServiceListing[] = [
  { id: 'fl1', listingType: MarketplaceListingType.OFFERING, title: "Event Photography Services", category: FreelanceCategory.PHOTOGRAPHY_VIDEOGRAPHY, description: "Experienced photographer available for campus events, portraits, and society functions. High-quality images guaranteed.", skills: ["Event Photography", "Portraiture", "Lightroom", "Photoshop"], portfolioLink: "https://myportfolio.example.com/alicephoto", rate: 20000, rateType: MarketplaceRateType.PER_HOUR, availability: "Weekends, Weekday evenings", contactInfo: "alice.photo@example.com", postedByUserId: "user2", postedByUserName: "Alice W.", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), rating: 4.8, reviewCount: 15 },
  { id: 'fl2', listingType: MarketplaceListingType.REQUESTING, title: "Need Python Tutor for Data Science Project", category: FreelanceCategory.SKILL_TUTORING_NON_ACADEMIC, description: "Looking for a skilled Python tutor to help with a data science project. Specifically need assistance with Pandas and Matplotlib. Budget is negotiable.", skills: ["Python", "Pandas", "Matplotlib", "Data Visualization"], rateType: MarketplaceRateType.NEGOTIABLE, contactInfo: "bob.needs.help@example.com", postedByUserId: "user3", postedByUserName: "Bob B.", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 2) },
];

const MOCK_RENTAL_LISTINGS_INITIAL: RentalListing[] = [
  { id: 'rl1', itemName: "DJ Controller - Pioneer DDJ-400", category: EquipmentCategory.EVENT_SUPPLIES_PARTY_RENTALS, description: "Pioneer DDJ-400 DJ controller for rent. Perfect for parties and small events. Comes with USB cable. Rekordbox compatible.", images: ["https://picsum.photos/seed/djcontroller/200/200"], rentalRate: 5000, rentalRateType: MarketplaceRateType.PER_DAY, depositRequired: 10000, availabilityInfo: "Most weekends, book in advance.", pickupLocation: "Hall 3, Room B05", contactInfo: "you@example.com", postedByUserId: "user1", postedByUserName: "You", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) },
  { id: 'rl2', itemName: "Professional DSLR Camera - Canon 5D Mark IV", category: EquipmentCategory.CAMERA_VIDEO_PHOTO_GEAR, description: "Canon 5D Mark IV with 24-70mm f/2.8L lens for rent. Ideal for professional photography or videography projects. Includes 2 batteries and charger.", images: ["https://picsum.photos/seed/canon5d/200/200"], rentalRate: 15000, rentalRateType: MarketplaceRateType.PER_DAY, depositRequired: 50000, availabilityInfo: "Check calendar: link.to.calendar", pickupLocation: "Photography Department Office", contactInfo: "photodept@campus.edu", postedByUserId: "dept_Photo", postedByUserName: "Photography Dept.", postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8) },
];

const MOCK_RIDE_SHARE_LISTINGS_INITIAL: RideShareListing[] = [
  { id: 'rs1', listingType: RideShareType.OFFERING_RIDE, departureLocation: 'Campus Main Gate', destinationLocation: 'Downtown City Center', departureDateTime: new Date(new Date().setDate(new Date().getDate() + 2)), availableSeats: 3, recurrence: RideRecurrence.ONE_TIME, costContribution: 2000, vehicleInfo: 'Toyota Camry, Blue', contactInfo: 'You@example.com', postedByUserId: 'user1', postedByUserName: 'You', postedDate: new Date(Date.now() - 1000 * 60 * 30), luggageSpace: 'Medium' },
  { id: 'rs2', listingType: RideShareType.REQUESTING_RIDE, departureLocation: 'Campus Library', destinationLocation: 'Airport (LOS)', departureDateTime: new Date(new Date().setDate(new Date().getDate() + 7)), passengersNeeded: 1, recurrence: RideRecurrence.ONE_TIME, contactInfo: 'alice.w@example.com', postedByUserId: 'user2', postedByUserName: 'Alice W.', postedDate: new Date(Date.now() - 1000 * 60 * 60 * 5), notes: "Need to arrive by 3 PM for flight." },
];

const MOCK_BIKE_SCOOTER_LISTINGS_INITIAL: BikeScooterListing[] = [
  { id: 'bs1', listingType: BikeScooterListingType.FOR_SALE, itemType: BikeScooterType.BICYCLE_HYBRID_COMMUTER, brandModel: 'Giant Escape 3', condition: BikeScooterCondition.GOOD, description: 'Well-maintained hybrid bike, perfect for campus commuting. Size M. Recently serviced.', price: 35000, images: ['https://picsum.photos/seed/bike1/200/200'], location: 'Student Hostel B', contactInfo: 'bob.b@example.com', postedByUserId: 'user3', postedByUserName: 'Bob B.', postedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
  { id: 'bs2', listingType: BikeScooterListingType.FOR_RENT, itemType: BikeScooterType.SCOOTER_E, brandModel: 'Xiaomi M365', condition: BikeScooterCondition.LIKE_NEW, description: 'Electric scooter for daily or weekly rental. Comes with charger. Good battery life.', rentalRate: 1000, rentalRateType: MarketplaceRateType.PER_DAY, images: ['https://picsum.photos/seed/scooter1/200/200'], location: 'Tech Hub (Basement)', contactInfo: 'you@example.com', postedByUserId: 'user1', postedByUserName: 'You', postedDate: new Date(Date.now() - 1000 * 60 * 60 * 2) },
];

const MOCK_SUBLET_LISTINGS_INITIAL: SubletListing[] = [
  { id: 'sub1', title: 'Summer Sublet in 2BR Apt near North Campus', location: '123 University Ave, Apt 4B', rent: 80000, rentFrequency: 'per month', availableFrom: new Date('2024-06-01'), availableTo: new Date('2024-08-31'), bedrooms: 1, bathrooms: 1, furnishedStatus: FurnishedStatus.FURNISHED, description: 'Subletting one room in a 2-bedroom apartment. You will have one roommate (male, engineering student). Quiet and clean building with a gym. Utilities included.', images: ['https://picsum.photos/seed/sublet1/400/300', 'https://picsum.photos/seed/sublet2/400/300'], amenities: ['In-unit laundry', 'Gym', 'Parking', 'A/C'], contactInfo: 'bob.b@example.com', postedByUserId: 'user3', postedByUserName: 'Bob B.', postedDate: new Date(Date.now() - 1000*60*60*24*6) },
  { id: 'sub2', title: 'Entire 1BR Apt available for December', location: '456 College Town Rd', rent: 120000, rentFrequency: 'total for period', availableFrom: new Date('2024-12-01'), availableTo: new Date('2024-12-31'), bedrooms: 1, bathrooms: 1, furnishedStatus: FurnishedStatus.FURNISHED, description: 'My entire 1-bedroom apartment is available for the month of December while I am away. Perfect for a quiet student. No parties. Close to bus stop.', images: ['https://picsum.photos/seed/sublet3/400/300'], amenities: ['Wifi included', 'Full Kitchen'], contactInfo: 'alice.w@example.com', postedByUserId: 'user2', postedByUserName: 'Alice W.', postedDate: new Date(Date.now() - 1000*60*60*24*1), isSold: true },
];

const MOCK_ROOMMATE_LISTINGS_INITIAL: RoommateListing[] = [
  { id: 'rm1', listingType: RoommateListingType.SEEKING_PLACE, title: 'Quiet CS student looking for a room', postedByUserId: 'user1', postedByUserName: 'You', age: 21, gender: 'Male', schoolProgram: 'Computer Science, 3rd Year', bio: 'I am a quiet and focused student looking for a room for the next academic year. I enjoy gaming and hiking in my free time.', habits: ['Quiet', 'Clean', 'Non-smoker', 'Early bird'], location: 'Within 15-min walk to campus', rent: 75000, moveInDate: new Date('2024-09-01'), leaseLength: '1 Year', lookingFor: 'Looking for other clean and respectful students. Preferably undergraduates or grad students.', contactInfo: 'you@example.com', postedDate: new Date(Date.now() - 1000*60*60*24*2), profileImageUrl: 'https://ui-avatars.com/api/?name=You&background=random&color=fff&size=100' },
  { id: 'rm2', listingType: RoommateListingType.SEEKING_ROOMMATE, title: 'One room available in 3BR house', postedByUserId: 'user3', postedByUserName: 'Bob B.', age: 22, gender: 'Male', schoolProgram: 'Business, 4th Year', bio: 'We are two friendly business students looking for a third roommate for our house. We enjoy watching sports and are pretty social on weekends.', habits: ['Social', 'Average cleanliness', 'Okay with smokers'], location: '789 Fraternity Row', rent: 65000, moveInDate: new Date('2024-08-15'), leaseLength: '1 Year', lookingFor: 'Looking for a social and easygoing roommate. Must be okay with occasional guests.', contactInfo: 'bob.b@example.com', postedDate: new Date(Date.now() - 1000*60*60*24*8), profileImageUrl: 'https://ui-avatars.com/api/?name=Bob+B&background=random&color=fff&size=100' },
];

const MOCK_FOOD_LISTINGS_INITIAL: FoodListing[] = [
  { id: 'food1', title: 'Homemade Jollof Rice (Large Portion)', description: 'Delicious party-style jollof rice with chicken. Made it for a party and have extra!', category: FoodCategory.HOMEMADE_MEAL, price: 1500, portionsAvailable: 4, dietaryInfo: [DietaryInfo.HALAL], pickupDetails: 'Pickup from Hall C Lobby, 6-8 PM tonight.', images: ['https://picsum.photos/seed/jollof/200/200'], postedByUserId: 'user2', postedByUserName: 'Alice W.', postedDate: new Date(Date.now() - 1000*60*60*3) },
  { id: 'food2', title: '2 Meal Swipes for Trade', description: 'I have 2 extra meal swipes for this week. Looking to trade for cash or snacks.', category: FoodCategory.MEAL_SWIPE_EXCHANGE, swipeEquivalent: 2, price: 1000, portionsAvailable: 1, pickupDetails: 'Meet at Main Cafeteria entrance.', postedByUserId: 'user3', postedByUserName: 'Bob B.', postedDate: new Date(Date.now() - 1000*60*60*24*1) },
];

const MOCK_SECOND_HAND_GOODS_INITIAL: SecondHandGood[] = [
  { id: 'shg1', itemName: 'Mini Fridge - Perfect for Dorms', description: 'Used for one year, works perfectly. A few minor scratches on the side. Cleaned and ready to go.', category: SecondHandCategory.ELECTRONICS, condition: TextbookCondition.GOOD, price: 12000, images: ['https://picsum.photos/seed/fridge/200/200'], location: 'Hall A, Room 201', postedByUserId: 'user1', postedByUserName: 'You', postedDate: new Date(Date.now() - 1000*60*60*24*5) },
  { id: 'shg2', itemName: 'Barely Used IKEA Desk', description: 'LAGKAPTEN / ADILS desk, white, 120x60 cm. Like new, no scratches. Assembled but can be disassembled for pickup.', category: SecondHandCategory.FURNITURE, condition: TextbookCondition.LIKE_NEW, price: 8000, images: ['https://picsum.photos/seed/desk/200/200'], location: 'Off-campus, 5-min walk from main gate', postedByUserId: 'user2', postedByUserName: 'Alice W.', postedDate: new Date(Date.now() - 1000*60*60*24*2) },
];


const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ currentUser, onPurchase }) => {
  const [activeTab, setActiveTab] = useState<'academic' | 'extraCurricular'>('academic');
  const [activeSubFeature, setActiveSubFeature] = useState<{ sectionId: string; featureId: string } | null>(null);
  
  // Favorites State
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => ({
    'tutor1': true,
    'merch2': true,
    'sg1': true,
    'pr1': true,
    'club2': true,
    'bs2': true,
    'fl1': true,
    'rl2': true,
    'sub1': true,
    'rm2': true,
    'food1': true,
    'shg2': true,
  }));

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Textbook states
  const [isListTextbookModalOpen, setIsListTextbookModalOpen] = useState(false);
  const [textbookListings, setTextbookListings] = useState<TextbookListing[]>(MOCK_TEXTBOOKS_INITIAL);
  const [searchTermInput, setSearchTermInput] = useState('');
  const [courseFilterInput, setCourseFilterInput] = useState('');
  const [conditionFilterInput, setConditionFilterInput] = useState<TextbookCondition | ''>('');
  const [showFavoriteTextbooks, setShowFavoriteTextbooks] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{ term: string; course: string; condition: TextbookCondition | '' }>({ term: '', course: '', condition: '' });

  // Study Group states
  const [isListStudyGroupModalOpen, setIsListStudyGroupModalOpen] = useState(false);
  const [studyGroupListings, setStudyGroupListings] = useState<StudyGroupListing[]>(MOCK_STUDY_GROUPS_INITIAL);
  const [sgSearchTermInput, setSgSearchTermInput] = useState('');
  const [sgCourseFilterInput, setSgCourseFilterInput] = useState('');
  const [sgMeetingPrefInput, setSgMeetingPrefInput] = useState<MeetingPreference | ''>('');
  const [showFavoriteStudyGroups, setShowFavoriteStudyGroups] = useState(false);
  const [appliedSgFilters, setAppliedSgFilters] = useState<{ term: string; course: string; meetingPreference: MeetingPreference | '' }>({ term: '', course: '', meetingPreference: '' });

  // Tutor states
  const [isListTutorModalOpen, setIsListTutorModalOpen] = useState(false);
  const [tutorListings, setTutorListings] = useState<TutorListing[]>(MOCK_TUTORS_INITIAL);
  const [tutorSearchTermInput, setTutorSearchTermInput] = useState(''); 
  const [tutorSubjectCourseInput, setTutorSubjectCourseInput] = useState('');
  const [tutorDeliveryMethodInput, setTutorDeliveryMethodInput] = useState<TutoringDeliveryMethod | ''>('');
  const [tutorProficiencyInput, setTutorProficiencyInput] = useState<TutoringSubjectProficiency | ''>('');
  const [tutorLocationInput, setTutorLocationInput] = useState('');
  const [tutorSchoolInput, setTutorSchoolInput] = useState('');
  const [showFavoriteTutors, setShowFavoriteTutors] = useState(false);
  const [appliedTutorFilters, setAppliedTutorFilters] = useState<{
    term: string; 
    subjectCourse: string;
    deliveryMethod: TutoringDeliveryMethod | '';
    proficiency: TutoringSubjectProficiency | '';
    location: string;
    school: string;
  }>({ term: '', subjectCourse: '', deliveryMethod: '', proficiency: '', location: '', school: '' });

  // Lost & Found states
  const [isListLostFoundItemModalOpen, setIsListLostFoundItemModalOpen] = useState(false);
  const [lostAndFoundItems, setLostAndFoundItems] = useState<LostAndFoundItem[]>(MOCK_LOST_FOUND_ITEMS_INITIAL);
  const [lfSearchTermInput, setLfSearchTermInput] = useState('');
  const [lfCategoryFilterInput, setLfCategoryFilterInput] = useState<LostAndFoundCategory | ''>('');
  const [lfStatusFilterInput, setLfStatusFilterInput] = useState<LostAndFoundStatus | ''>('');
  const [showFavoriteLostFound, setShowFavoriteLostFound] = useState(false);
  const [appliedLfFilters, setAppliedLfFilters] = useState<{ term: string; category: LostAndFoundCategory | ''; status: LostAndFoundStatus | '' }>({ term: '', category: '', status: '' });
  const [showResolvedLfItems, setShowResolvedLfItems] = useState(false);

  // Peer Review states
  const [isListPeerReviewModalOpen, setIsListPeerReviewModalOpen] = useState(false);
  const [peerReviewListings, setPeerReviewListings] = useState<PeerReviewServiceListing[]>(MOCK_PEER_REVIEW_LISTINGS_INITIAL);
  const [prSearchTermInput, setPrSearchTermInput] = useState('');
  const [prServiceTypeFilterInput, setPrServiceTypeFilterInput] = useState<PeerReviewServiceType | ''>('');
  const [prListingTypeFilterInput, setPrListingTypeFilterInput] = useState<MarketplaceListingType | ''>('');
  const [showFavoritePeerReview, setShowFavoritePeerReview] = useState(false);
  const [appliedPrFilters, setAppliedPrFilters] = useState<{ term: string; serviceType: PeerReviewServiceType | ''; listingType: MarketplaceListingType | '' }>({ term: '', serviceType: '', listingType: '' });

  // Thesis Support states
  const [isListThesisSupportModalOpen, setIsListThesisSupportModalOpen] = useState(false);
  const [thesisSupportListings, setThesisSupportListings] = useState<ThesisSupportListing[]>(MOCK_THESIS_SUPPORT_LISTINGS_INITIAL);
  const [tsSearchTermInput, setTsSearchTermInput] = useState('');
  const [tsSupportTypeFilterInput, setTsSupportTypeFilterInput] = useState<ThesisSupportType | ''>('');
  const [tsFieldOfStudyFilterInput, setTsFieldOfStudyFilterInput] = useState('');
  const [tsListingTypeFilterInput, setTsListingTypeFilterInput] = useState<MarketplaceListingType | ''>('');
  const [showFavoriteThesisSupport, setShowFavoriteThesisSupport] = useState(false);
  const [appliedTsFilters, setAppliedTsFilters] = useState<{ term: string; supportType: ThesisSupportType | ''; fieldOfStudy: string; listingType: MarketplaceListingType | '' }>({ term: '', supportType: '', fieldOfStudy: '', listingType: '' });

  // Club Profile States
  const [isListClubProfileModalOpen, setIsListClubProfileModalOpen] = useState(false);
  const [clubProfiles, setClubProfiles] = useState<ClubProfile[]>(MOCK_CLUB_PROFILES_INITIAL);
  const [cpSearchTermInput, setCpSearchTermInput] = useState('');
  const [cpClubTypeFilterInput, setCpClubTypeFilterInput] = useState<ClubType | ''>('');
  const [showFavoriteClubs, setShowFavoriteClubs] = useState(false);
  const [appliedCpFilters, setAppliedCpFilters] = useState<{ term: string; clubType: ClubType | '' }>({ term: '', clubType: '' });

  // Event Ticket States
  const [isListEventTicketModalOpen, setIsListEventTicketModalOpen] = useState(false);
  const [eventTicketListings, setEventTicketListings] = useState<EventTicketListing[]>(MOCK_EVENT_TICKETS_INITIAL);
  const [etSearchTermInput, setEtSearchTermInput] = useState('');
  const [etEventTypeFilterInput, setEtEventTypeFilterInput] = useState<CampusEventType | ''>('');
  const [etDateFilterInput, setEtDateFilterInput] = useState(''); 
  const [etIsResaleFilterInput, setEtIsResaleFilterInput] = useState<boolean | null>(null);
  const [showFavoriteTickets, setShowFavoriteTickets] = useState(false);
  const [appliedEtFilters, setAppliedEtFilters] = useState<{term: string; eventType: CampusEventType | ''; date: string; isResale: boolean | null}>({ term: '', eventType: '', date: '', isResale: null });

  // Merchandise States
  const [isListMerchandiseModalOpen, setIsListMerchandiseModalOpen] = useState(false);
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>(MOCK_MERCHANDISE_ITEMS_INITIAL);
  const [miSearchTermInput, setMiSearchTermInput] = useState('');
  const [miCategoryFilterInput, setMiCategoryFilterInput] = useState<MerchandiseCategory | ''>('');
  const [miSellerFilterInput, setMiSellerFilterInput] = useState('');
  const [showFavoriteMerch, setShowFavoriteMerch] = useState(false);
  const [appliedMiFilters, setAppliedMiFilters] = useState<{term: string; category: MerchandiseCategory | ''; seller: string}>({ term: '', category: '', seller: '' });

  // Freelance/Gig States
  const [isListFreelanceServiceModalOpen, setIsListFreelanceServiceModalOpen] = useState(false);
  const [freelanceListings, setFreelanceListings] = useState<FreelanceServiceListing[]>(MOCK_FREELANCE_LISTINGS_INITIAL);
  const [flSearchTermInput, setFlSearchTermInput] = useState('');
  const [flCategoryFilterInput, setFlCategoryFilterInput] = useState<FreelanceCategory | ''>('');
  const [flListingTypeFilterInput, setFlListingTypeFilterInput] = useState<MarketplaceListingType | ''>('');
  const [showFavoriteFreelance, setShowFavoriteFreelance] = useState(false);
  const [appliedFlFilters, setAppliedFlFilters] = useState<{term: string; category: FreelanceCategory | ''; listingType: MarketplaceListingType | ''}>({ term: '', category: '', listingType: '' });

  // Equipment Rental States
  const [isListRentalItemModalOpen, setIsListRentalItemModalOpen] = useState(false);
  const [rentalListings, setRentalListings] = useState<RentalListing[]>(MOCK_RENTAL_LISTINGS_INITIAL);
  const [rlSearchTermInput, setRlSearchTermInput] = useState('');
  const [rlCategoryFilterInput, setRlCategoryFilterInput] = useState<EquipmentCategory | ''>('');
  const [rlLocationFilterInput, setRlLocationFilterInput] = useState('');
  const [showFavoriteRentals, setShowFavoriteRentals] = useState(false);
  const [appliedRlFilters, setAppliedRlFilters] = useState<{term: string; category: EquipmentCategory | ''; location: string}>({ term: '', category: '', location: '' });

  // Ride Share States
  const [isListRideShareModalOpen, setIsListRideShareModalOpen] = useState(false);
  const [rideShareListings, setRideShareListings] = useState<RideShareListing[]>(MOCK_RIDE_SHARE_LISTINGS_INITIAL);
  const [rsSearchTermInput, setRsSearchTermInput] = useState('');
  const [rsDateFilterInput, setRsDateFilterInput] = useState('');
  const [rsListingTypeFilterInput, setRsListingTypeFilterInput] = useState<RideShareType | ''>('');
  const [showFavoriteRideShares, setShowFavoriteRideShares] = useState(false);
  const [appliedRsFilters, setAppliedRsFilters] = useState<{ term: string; date: string; listingType: RideShareType | '' }>({ term: '', date: '', listingType: '' });

  // Bike/Scooter Exchange States
  const [isListBikeScooterModalOpen, setIsListBikeScooterModalOpen] = useState(false);
  const [bikeScooterListings, setBikeScooterListings] = useState<BikeScooterListing[]>(MOCK_BIKE_SCOOTER_LISTINGS_INITIAL);
  const [bsSearchTermInput, setBsSearchTermInput] = useState('');
  const [bsItemTypeFilterInput, setBsItemTypeFilterInput] = useState<BikeScooterType | ''>('');
  const [bsListingTypeFilterInput, setBsListingTypeFilterInput] = useState<BikeScooterListingType | ''>('');
  const [bsConditionFilterInput, setBsConditionFilterInput] = useState<BikeScooterCondition | ''>('');
  const [showFavoriteBikeScooter, setShowFavoriteBikeScooter] = useState(false);
  const [appliedBsFilters, setAppliedBsFilters] = useState<{ term: string; itemType: BikeScooterType | ''; listingType: BikeScooterListingType | ''; condition: BikeScooterCondition | '' }>({ term: '', itemType: '', listingType: '', condition: '' });

  // Housing & Accommodation States
  const [isListSubletModalOpen, setIsListSubletModalOpen] = useState(false);
  const [subletListings, setSubletListings] = useState<SubletListing[]>(MOCK_SUBLET_LISTINGS_INITIAL);
  const [isListRoommateModalOpen, setIsListRoommateModalOpen] = useState(false);
  const [roommateListings, setRoommateListings] = useState<RoommateListing[]>(MOCK_ROOMMATE_LISTINGS_INITIAL);

  // Personal Services & Exchange States
  const [isListFoodModalOpen, setIsListFoodModalOpen] = useState(false);
  const [foodListings, setFoodListings] = useState<FoodListing[]>(MOCK_FOOD_LISTINGS_INITIAL);
  const [isListSecondHandGoodModalOpen, setIsListSecondHandGoodModalOpen] = useState(false);
  const [secondHandGoods, setSecondHandGoods] = useState<SecondHandGood[]>(MOCK_SECOND_HAND_GOODS_INITIAL);


  useEffect(() => {
    if (activeSubFeature) {
        const currentSectionSource = activeTab === 'academic' ? academicSections : extraCurricularSections;
        const currentSection = currentSectionSource.find(s => s.id === activeSubFeature.sectionId);
        if (!currentSection || !currentSection.features.find(f => f.id === activeSubFeature.featureId)) {
            setActiveSubFeature(null);
        }
    }
  }, [activeTab, activeSubFeature]);

  const handlePurchase = (item: any, itemType: string) => {
    const result = onPurchase(item, itemType);
    if (result?.success) {
        // Find the correct state array and update the item
        switch (result.itemType) {
            case 'textbook':
                setTextbookListings(prev => prev.map(i => i.id === result.itemId ? { ...i, isSold: true } : i));
                break;
            case 'secondHandGood':
                setSecondHandGoods(prev => prev.map(i => i.id === result.itemId ? { ...i, isSold: true } : i));
                break;
            case 'food':
                setFoodListings(prev => prev.map(i => i.id === result.itemId ? { ...i, isSold: true } : i));
                break;
            case 'bikeScooter':
                setBikeScooterListings(prev => prev.map(i => i.id === result.itemId ? { ...i, isSold: true } : i));
                break;
            // Add other cases for different item types here
        }
    }
  };


  const displayedTextbooks = useMemo(() => {
    let items = textbookListings;
    if (showFavoriteTextbooks) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedFilters.term && !appliedFilters.course && !appliedFilters.condition) {
      return items;
    }
    return items.filter(book => {
      const termMatch = appliedFilters.term
        ? book.title.toLowerCase().includes(appliedFilters.term.toLowerCase()) ||
          book.author.toLowerCase().includes(appliedFilters.term.toLowerCase()) ||
          (book.isbn && book.isbn.toLowerCase().includes(appliedFilters.term.toLowerCase()))
        : true;
      const courseMatch = appliedFilters.course ? book.course === appliedFilters.course : true;
      const conditionMatch = appliedFilters.condition ? book.condition === appliedFilters.condition : true;
      return termMatch && courseMatch && conditionMatch;
    });
  }, [textbookListings, appliedFilters, favorites, showFavoriteTextbooks]);

  const displayedStudyGroups = useMemo(() => {
    let items = studyGroupListings;
    if (showFavoriteStudyGroups) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedSgFilters.term && !appliedSgFilters.course && !appliedSgFilters.meetingPreference) {
      return items;
    }
    return items.filter(group => {
      const termMatch = appliedSgFilters.term
        ? group.groupName.toLowerCase().includes(appliedSgFilters.term.toLowerCase()) ||
          group.course.toLowerCase().includes(appliedSgFilters.term.toLowerCase()) ||
          group.topic.toLowerCase().includes(appliedSgFilters.term.toLowerCase()) ||
          group.description.toLowerCase().includes(appliedSgFilters.term.toLowerCase())
        : true;
      const courseMatch = appliedSgFilters.course ? group.course === appliedSgFilters.course : true;
      const meetingPrefMatch = appliedSgFilters.meetingPreference ? group.meetingPreference === appliedSgFilters.meetingPreference : true;
      return termMatch && courseMatch && meetingPrefMatch;
    });
  }, [studyGroupListings, appliedSgFilters, favorites, showFavoriteStudyGroups]);

  const displayedTutors = useMemo(() => {
    let items = tutorListings;
    if (showFavoriteTutors) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedTutorFilters.term && !appliedTutorFilters.subjectCourse && !appliedTutorFilters.deliveryMethod && !appliedTutorFilters.proficiency && !appliedTutorFilters.location && !appliedTutorFilters.school) {
      return items;
    }
    return items.filter(tutor => {
      const termMatch = appliedTutorFilters.term 
        ? tutor.tutorName.toLowerCase().includes(appliedTutorFilters.term.toLowerCase())
        : true;
      const subjectCourseMatch = appliedTutorFilters.subjectCourse
        ? tutor.subjects.some(s => s.toLowerCase().includes(appliedTutorFilters.subjectCourse.toLowerCase())) ||
          (tutor.courses && tutor.courses.some(c => c.toLowerCase().includes(appliedTutorFilters.subjectCourse.toLowerCase())))
        : true;
      const deliveryMatch = appliedTutorFilters.deliveryMethod ? tutor.deliveryMethod === appliedTutorFilters.deliveryMethod : true;
      const proficiencyMatch = appliedTutorFilters.proficiency ? tutor.overallProficiency === appliedTutorFilters.proficiency : true;
      const locationMatch = appliedTutorFilters.location
        ? tutor.location && tutor.location.toLowerCase().includes(appliedTutorFilters.location.toLowerCase())
        : true;
      const schoolMatch = appliedTutorFilters.school
        ? tutor.schoolOfStudy && tutor.schoolOfStudy.toLowerCase().includes(appliedTutorFilters.school.toLowerCase())
        : true;
      return termMatch && subjectCourseMatch && deliveryMatch && proficiencyMatch && locationMatch && schoolMatch;
    });
  }, [tutorListings, appliedTutorFilters, favorites, showFavoriteTutors]);

  const displayedLostAndFoundItems = useMemo(() => {
    let items = lostAndFoundItems;
    if (showFavoriteLostFound) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!showResolvedLfItems) {
      items = items.filter(item => !item.isResolved);
    }
    if (!appliedLfFilters.term && !appliedLfFilters.category && !appliedLfFilters.status) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(item => {
      const termMatch = appliedLfFilters.term
        ? item.itemName.toLowerCase().includes(appliedLfFilters.term.toLowerCase()) ||
          item.description.toLowerCase().includes(appliedLfFilters.term.toLowerCase()) ||
          item.locationLostOrFound.toLowerCase().includes(appliedLfFilters.term.toLowerCase())
        : true;
      const categoryMatch = appliedLfFilters.category ? item.category === appliedLfFilters.category : true;
      const statusMatch = appliedLfFilters.status ? item.status === appliedLfFilters.status : true;
      return termMatch && categoryMatch && statusMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [lostAndFoundItems, appliedLfFilters, showResolvedLfItems, favorites, showFavoriteLostFound]);

  const displayedPeerReviewListings = useMemo(() => {
    let items = peerReviewListings;
    if (showFavoritePeerReview) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedPrFilters.term && !appliedPrFilters.serviceType && !appliedPrFilters.listingType) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedPrFilters.term
        ? listing.title.toLowerCase().includes(appliedPrFilters.term.toLowerCase()) ||
          listing.description.toLowerCase().includes(appliedPrFilters.term.toLowerCase()) ||
          listing.subjectsOrSkills.some(s => s.toLowerCase().includes(appliedPrFilters.term.toLowerCase()))
        : true;
      const serviceTypeMatch = appliedPrFilters.serviceType ? listing.serviceType === appliedPrFilters.serviceType : true;
      const listingTypeMatch = appliedPrFilters.listingType ? listing.listingType === appliedPrFilters.listingType : true;
      return termMatch && serviceTypeMatch && listingTypeMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [peerReviewListings, appliedPrFilters, favorites, showFavoritePeerReview]);

  const displayedThesisSupportListings = useMemo(() => {
    let items = thesisSupportListings;
    if (showFavoriteThesisSupport) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedTsFilters.term && !appliedTsFilters.supportType && !appliedTsFilters.fieldOfStudy && !appliedTsFilters.listingType) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedTsFilters.term
        ? listing.title.toLowerCase().includes(appliedTsFilters.term.toLowerCase()) ||
          listing.description.toLowerCase().includes(appliedTsFilters.term.toLowerCase()) ||
          (listing.specificSkills && listing.specificSkills.some(s => s.toLowerCase().includes(appliedTsFilters.term.toLowerCase())))
        : true;
      const supportTypeMatch = appliedTsFilters.supportType ? listing.supportType === appliedTsFilters.supportType : true;
      const fieldOfStudyMatch = appliedTsFilters.fieldOfStudy
        ? listing.fieldOfStudy.some(fos => fos.toLowerCase().includes(appliedTsFilters.fieldOfStudy.toLowerCase()))
        : true;
      const listingTypeMatch = appliedTsFilters.listingType ? listing.listingType === appliedTsFilters.listingType : true;
      return termMatch && supportTypeMatch && fieldOfStudyMatch && listingTypeMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [thesisSupportListings, appliedTsFilters, favorites, showFavoriteThesisSupport]);

  const displayedClubProfiles = useMemo(() => {
    let items = clubProfiles;
    if (showFavoriteClubs) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedCpFilters.term && !appliedCpFilters.clubType) {
      return items.sort((a,b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    }
    return items.filter(profile => {
      const termMatch = appliedCpFilters.term
        ? profile.clubName.toLowerCase().includes(appliedCpFilters.term.toLowerCase()) ||
          profile.description.toLowerCase().includes(appliedCpFilters.term.toLowerCase())
        : true;
      const clubTypeMatch = appliedCpFilters.clubType ? profile.clubType === appliedCpFilters.clubType : true;
      return termMatch && clubTypeMatch;
    }).sort((a,b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
  }, [clubProfiles, appliedCpFilters, favorites, showFavoriteClubs]);

  const displayedEventTickets = useMemo(() => {
    let items = eventTicketListings;
    if (showFavoriteTickets) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedEtFilters.term && !appliedEtFilters.eventType && !appliedEtFilters.date && appliedEtFilters.isResale === null) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(ticket => {
      const termMatch = appliedEtFilters.term
        ? ticket.eventName.toLowerCase().includes(appliedEtFilters.term.toLowerCase()) ||
          ticket.description.toLowerCase().includes(appliedEtFilters.term.toLowerCase()) ||
          ticket.location.toLowerCase().includes(appliedEtFilters.term.toLowerCase())
        : true;
      const eventTypeMatch = appliedEtFilters.eventType ? ticket.eventType === appliedEtFilters.eventType : true;
      const dateMatch = appliedEtFilters.date ? new Date(ticket.eventDate).toISOString().startsWith(appliedEtFilters.date) : true;
      const resaleMatch = appliedEtFilters.isResale !== null ? ticket.isResale === appliedEtFilters.isResale : true;
      return termMatch && eventTypeMatch && dateMatch && resaleMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [eventTicketListings, appliedEtFilters, favorites, showFavoriteTickets]);

  const displayedMerchandiseItems = useMemo(() => {
    let items = merchandiseItems;
    if (showFavoriteMerch) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedMiFilters.term && !appliedMiFilters.category && !appliedMiFilters.seller) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(item => {
      const termMatch = appliedMiFilters.term
        ? item.itemName.toLowerCase().includes(appliedMiFilters.term.toLowerCase()) ||
          item.description.toLowerCase().includes(appliedMiFilters.term.toLowerCase())
        : true;
      const categoryMatch = appliedMiFilters.category ? item.category === appliedMiFilters.category : true;
      const sellerMatch = appliedMiFilters.seller ? item.sellerInfo.toLowerCase().includes(appliedMiFilters.seller.toLowerCase()) : true;
      return termMatch && categoryMatch && sellerMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [merchandiseItems, appliedMiFilters, favorites, showFavoriteMerch]);

  const displayedFreelanceListings = useMemo(() => {
    let items = freelanceListings;
    if (showFavoriteFreelance) {
        items = items.filter(item => favorites[item.id]);
    }
    if (!appliedFlFilters.term && !appliedFlFilters.category && !appliedFlFilters.listingType) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedFlFilters.term
        ? listing.title.toLowerCase().includes(appliedFlFilters.term.toLowerCase()) ||
          listing.description.toLowerCase().includes(appliedFlFilters.term.toLowerCase()) ||
          listing.skills.some(s => s.toLowerCase().includes(appliedFlFilters.term.toLowerCase()))
        : true;
      const categoryMatch = appliedFlFilters.category ? listing.category === appliedFlFilters.category : true;
      const listingTypeMatch = appliedFlFilters.listingType ? listing.listingType === appliedFlFilters.listingType : true;
      return termMatch && categoryMatch && listingTypeMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [freelanceListings, appliedFlFilters, favorites, showFavoriteFreelance]);

  const displayedRentalListings = useMemo(() => {
    let items = rentalListings;
    if (showFavoriteRentals) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedRlFilters.term && !appliedRlFilters.category && !appliedRlFilters.location) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedRlFilters.term
        ? listing.itemName.toLowerCase().includes(appliedRlFilters.term.toLowerCase()) ||
          listing.description.toLowerCase().includes(appliedRlFilters.term.toLowerCase())
        : true;
      const categoryMatch = appliedRlFilters.category ? listing.category === appliedRlFilters.category : true;
      const locationMatch = appliedRlFilters.location ? listing.pickupLocation.toLowerCase().includes(appliedRlFilters.location.toLowerCase()) : true;
      return termMatch && categoryMatch && locationMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [rentalListings, appliedRlFilters, favorites, showFavoriteRentals]);

  const displayedRideShareListings = useMemo(() => {
    let items = rideShareListings;
    if (showFavoriteRideShares) {
      items = items.filter(item => favorites[item.id]);
    }
    if (!appliedRsFilters.term && !appliedRsFilters.date && !appliedRsFilters.listingType) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedRsFilters.term
        ? listing.departureLocation.toLowerCase().includes(appliedRsFilters.term.toLowerCase()) ||
          listing.destinationLocation.toLowerCase().includes(appliedRsFilters.term.toLowerCase()) ||
          (listing.notes && listing.notes.toLowerCase().includes(appliedRsFilters.term.toLowerCase()))
        : true;
      const dateMatch = appliedRsFilters.date ? new Date(listing.departureDateTime).toISOString().startsWith(appliedRsFilters.date) : true;
      const listingTypeMatch = appliedRsFilters.listingType ? listing.listingType === appliedRsFilters.listingType : true;
      return termMatch && dateMatch && listingTypeMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [rideShareListings, appliedRsFilters, favorites, showFavoriteRideShares]);

  const displayedBikeScooterListings = useMemo(() => {
    let items = bikeScooterListings;
    if (showFavoriteBikeScooter) {
        items = items.filter(item => favorites[item.id]);
    }
    if (!appliedBsFilters.term && !appliedBsFilters.itemType && !appliedBsFilters.listingType && !appliedBsFilters.condition) {
      return items.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    return items.filter(listing => {
      const termMatch = appliedBsFilters.term
        ? (listing.brandModel && listing.brandModel.toLowerCase().includes(appliedBsFilters.term.toLowerCase())) ||
          listing.description.toLowerCase().includes(appliedBsFilters.term.toLowerCase())
        : true;
      const itemTypeMatch = appliedBsFilters.itemType ? listing.itemType === appliedBsFilters.itemType : true;
      const listingTypeMatch = appliedBsFilters.listingType ? listing.listingType === appliedBsFilters.listingType : true;
      const conditionMatch = appliedBsFilters.condition ? listing.condition === appliedBsFilters.condition : true;
      return termMatch && itemTypeMatch && listingTypeMatch && conditionMatch;
    }).sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [bikeScooterListings, appliedBsFilters, favorites, showFavoriteBikeScooter]);

  const displayedSublets = useMemo(() => {
      return subletListings.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [subletListings]);

  const displayedRoommates = useMemo(() => {
      return roommateListings.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [roommateListings]);

  const displayedFoodListings = useMemo(() => {
    return foodListings.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [foodListings]);
  
  const displayedSecondHandGoods = useMemo(() => {
    return secondHandGoods.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [secondHandGoods]);


  const handleListTextbook = (newListing: Omit<TextbookListing, 'id' | 'sellerName' | 'sellerId' | 'listedDate'>) => {
    const fullListing: TextbookListing = {
      ...newListing,
      id: `tb-${Date.now()}`,
      sellerName: currentUser.name, 
      sellerId: currentUser.id, 
      listedDate: new Date(),
      imageUrl: newListing.imageUrl || `https://picsum.photos/seed/newbook${Date.now()}/200/300`
    };
    setTextbookListings(prev => [fullListing, ...prev]);
    setIsListTextbookModalOpen(false);
  };

  const handleListStudyGroup = (newListingData: Omit<StudyGroupListing, 'id' | 'listedBy' | 'listedById' | 'listedDate'>) => {
    const fullListing: StudyGroupListing = {
      ...newListingData,
      id: `sg-${Date.now()}`,
      listedBy: currentUser.name, 
      listedById: currentUser.id, 
      listedDate: new Date(),
    };
    setStudyGroupListings(prev => [fullListing, ...prev]);
    setIsListStudyGroupModalOpen(false);
  };

  const handleListTutor = (newListingData: Omit<TutorListing, 'id' | 'tutorName' | 'tutorId' | 'listedDate' | 'avatarUrl' | 'rating' | 'reviewCount'>) => {
    const fullListing: TutorListing = {
        ...newListingData,
        id: `tutor-${Date.now()}`,
        tutorName: currentUser.name, 
        tutorId: currentUser.id, 
        listedDate: new Date(),
        avatarUrl: currentUser.avatarUrl,
        rating: undefined,
        reviewCount: 0,
    };
    setTutorListings(prev => [fullListing, ...prev]);
    setIsListTutorModalOpen(false);
  };
  
  const handleListLostFoundItem = (newListingData: Omit<LostAndFoundItem, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate' | 'isResolved'>) => {
    const fullListing: LostAndFoundItem = {
      ...newListingData,
      id: `lf-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
      isResolved: false,
    };
    setLostAndFoundItems(prev => [fullListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListLostFoundItemModalOpen(false);
  };

  const handleMarkLfItemResolved = (itemId: string) => {
    setLostAndFoundItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isResolved: !item.isResolved } : item
      )
    );
  };

  const handleListPeerReviewService = (newListingData: Omit<PeerReviewServiceListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate' | 'rating' | 'reviewCount'>) => {
    const fullListing: PeerReviewServiceListing = {
      ...newListingData,
      id: `pr-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
      rating: undefined,
      reviewCount: 0,
    };
    setPeerReviewListings(prev => [fullListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListPeerReviewModalOpen(false);
  };

  const handleListThesisSupport = (newListingData: Omit<ThesisSupportListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate' | 'rating' | 'reviewCount'>) => {
    const fullListing: ThesisSupportListing = {
      ...newListingData,
      id: `ts-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
      rating: undefined,
      reviewCount: 0,
    };
    setThesisSupportListings(prev => [fullListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListThesisSupportModalOpen(false);
  };

  const handleListClubProfile = (data: Omit<ClubProfile, 'id' | 'listedByUserId' | 'listedByUserName' | 'listedDate' | 'rating' | 'reviewCount'>) => {
    const newClubProfile: ClubProfile = {
      ...data,
      id: `club-${Date.now()}`,
      listedByUserId: currentUser.id,
      listedByUserName: currentUser.name,
      listedDate: new Date(),
      rating: undefined,
      reviewCount: 0,
    };
    setClubProfiles(prev => [newClubProfile, ...prev].sort((a,b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()));
    setIsListClubProfileModalOpen(false);
  };

  const handleListEventTicket = (data: Omit<EventTicketListing, 'id' | 'sellerName' | 'sellerId' | 'postedDate'>) => {
    const newTicket: EventTicketListing = {
      ...data,
      id: `evt-${Date.now()}`,
      sellerName: currentUser.name,
      sellerId: currentUser.id,
      postedDate: new Date(),
    };
    setEventTicketListings(prev => [newTicket, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListEventTicketModalOpen(false);
  };

  const handleListMerchandiseItem = (data: Omit<MerchandiseItem, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate' | 'rating' | 'reviewCount'>) => {
    const newItem: MerchandiseItem = {
      ...data,
      id: `merch-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
      rating: undefined,
      reviewCount: 0,
    };
    setMerchandiseItems(prev => [newItem, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListMerchandiseModalOpen(false);
  };

  const handleListFreelanceService = (data: Omit<FreelanceServiceListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate' | 'rating' | 'reviewCount'>) => {
    const newListing: FreelanceServiceListing = {
      ...data,
      id: `fl-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
      rating: undefined,
      reviewCount: 0,
    };
    setFreelanceListings(prev => [newListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListFreelanceServiceModalOpen(false);
  };

  const handleListRentalItem = (data: Omit<RentalListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
    const newListing: RentalListing = {
      ...data,
      id: `rl-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
    };
    setRentalListings(prev => [newListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListRentalItemModalOpen(false);
  };

  const handleListRideShare = (data: Omit<RideShareListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
    const newListing: RideShareListing = {
      ...data,
      id: `rs-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
    };
    setRideShareListings(prev => [newListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListRideShareModalOpen(false);
  };

  const handleListBikeScooter = (data: Omit<BikeScooterListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
    const newListing: BikeScooterListing = {
      ...data,
      id: `bs-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
    };
    setBikeScooterListings(prev => [newListing, ...prev].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListBikeScooterModalOpen(false);
  };

  const handleListSublet = (data: Omit<SubletListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
      const newListing: SubletListing = {
          ...data,
          id: `sub-${Date.now()}`,
          postedByUserId: currentUser.id,
          postedByUserName: currentUser.name,
          postedDate: new Date(),
      };
      setSubletListings(prev => [newListing, ...prev].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
      setIsListSubletModalOpen(false);
  };

  const handleListRoommate = (data: Omit<RoommateListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
      const newListing: RoommateListing = {
          ...data,
          id: `rm-${Date.now()}`,
          postedByUserId: currentUser.id,
          postedByUserName: currentUser.name,
          postedDate: new Date(),
      };
      setRoommateListings(prev => [newListing, ...prev].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
      setIsListRoommateModalOpen(false);
  };

  const handleListFood = (data: Omit<FoodListing, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
    const newListing: FoodListing = {
      ...data,
      id: `food-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
    };
    setFoodListings(prev => [newListing, ...prev].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListFoodModalOpen(false);
  };

  const handleListSecondHandGood = (data: Omit<SecondHandGood, 'id' | 'postedByUserId' | 'postedByUserName' | 'postedDate'>) => {
    const newListing: SecondHandGood = {
      ...data,
      id: `shg-${Date.now()}`,
      postedByUserId: currentUser.id,
      postedByUserName: currentUser.name,
      postedDate: new Date(),
    };
    setSecondHandGoods(prev => [newListing, ...prev].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setIsListSecondHandGoodModalOpen(false);
  };


  const openSubFeature = (sectionId: string, featureId: string) => {
    setActiveSubFeature({ sectionId, featureId });
  };

  const closeSubFeature = () => {
    setActiveSubFeature(null);
  };

  const handleTextbookSearch = () => {
    setAppliedFilters({
      term: searchTermInput,
      course: courseFilterInput,
      condition: conditionFilterInput,
    });
  };

  const handleClearTextbookFilters = () => {
    setSearchTermInput('');
    setCourseFilterInput('');
    setConditionFilterInput('');
    setAppliedFilters({ term: '', course: '', condition: '' });
  };

  const handleStudyGroupSearch = () => {
    setAppliedSgFilters({
      term: sgSearchTermInput,
      course: sgCourseFilterInput,
      meetingPreference: sgMeetingPrefInput,
    });
  };

  const handleClearStudyGroupFilters = () => {
    setSgSearchTermInput('');
    setSgCourseFilterInput('');
    setSgMeetingPrefInput('');
    setAppliedSgFilters({ term: '', course: '', meetingPreference: '' });
  };

  const handleTutorSearch = () => {
    setAppliedTutorFilters({
      term: tutorSearchTermInput,
      subjectCourse: tutorSubjectCourseInput,
      deliveryMethod: tutorDeliveryMethodInput,
      proficiency: tutorProficiencyInput,
      location: tutorLocationInput,
      school: tutorSchoolInput,
    });
  };

  const handleClearTutorFilters = () => {
    setTutorSearchTermInput('');
    setTutorSubjectCourseInput('');
    setTutorDeliveryMethodInput('');
    setTutorProficiencyInput('');
    setTutorLocationInput('');
    setTutorSchoolInput('');
    setAppliedTutorFilters({ term: '', subjectCourse: '', deliveryMethod: '', proficiency: '', location: '', school: '' });
  };

  const handleLfSearch = () => {
    setAppliedLfFilters({
      term: lfSearchTermInput,
      category: lfCategoryFilterInput,
      status: lfStatusFilterInput,
    });
  };

  const handleClearLfFilters = () => {
    setLfSearchTermInput('');
    setLfCategoryFilterInput('');
    setLfStatusFilterInput(''); 
    setAppliedLfFilters({ term: '', category: '', status: '' });
  };

  const handlePrSearch = () => {
    setAppliedPrFilters({
      term: prSearchTermInput,
      serviceType: prServiceTypeFilterInput,
      listingType: prListingTypeFilterInput,
    });
  };

  const handleClearPrFilters = () => {
    setPrSearchTermInput('');
    setPrServiceTypeFilterInput('');
    setPrListingTypeFilterInput('');
    setAppliedPrFilters({ term: '', serviceType: '', listingType: '' });
  };

  const handleTsSearch = () => {
    setAppliedTsFilters({
      term: tsSearchTermInput,
      supportType: tsSupportTypeFilterInput,
      fieldOfStudy: tsFieldOfStudyFilterInput,
      listingType: tsListingTypeFilterInput,
    });
  };

  const handleClearTsFilters = () => {
    setTsSearchTermInput('');
    setTsSupportTypeFilterInput('');
    setTsFieldOfStudyFilterInput('');
    setTsListingTypeFilterInput('');
    setAppliedTsFilters({ term: '', supportType: '', fieldOfStudy: '', listingType: '' });
  };

  const handleCpSearch = () => {
    setAppliedCpFilters({ term: cpSearchTermInput, clubType: cpClubTypeFilterInput });
  };
  const handleClearCpFilters = () => {
    setCpSearchTermInput(''); setCpClubTypeFilterInput('');
    setAppliedCpFilters({ term: '', clubType: '' });
  };

  const handleEtSearch = () => {
    setAppliedEtFilters({ term: etSearchTermInput, eventType: etEventTypeFilterInput, date: etDateFilterInput, isResale: etIsResaleFilterInput });
  };
  const handleClearEtFilters = () => {
    setEtSearchTermInput(''); setEtEventTypeFilterInput(''); setEtDateFilterInput(''); setEtIsResaleFilterInput(null);
    setAppliedEtFilters({ term: '', eventType: '', date: '', isResale: null });
  };
  
  const handleMiSearch = () => {
    setAppliedMiFilters({ term: miSearchTermInput, category: miCategoryFilterInput, seller: miSellerFilterInput });
  };
  const handleClearMiFilters = () => {
    setMiSearchTermInput(''); setMiCategoryFilterInput(''); setMiSellerFilterInput('');
    setAppliedMiFilters({ term: '', category: '', seller: '' });
  };

  const handleFlSearch = () => {
    setAppliedFlFilters({ term: flSearchTermInput, category: flCategoryFilterInput, listingType: flListingTypeFilterInput });
  };
  const handleClearFlFilters = () => {
    setFlSearchTermInput(''); setFlCategoryFilterInput(''); setFlListingTypeFilterInput('');
    setAppliedFlFilters({ term: '', category: '', listingType: '' });
  };

  const handleRlSearch = () => {
    setAppliedRlFilters({ term: rlSearchTermInput, category: rlCategoryFilterInput, location: rlLocationFilterInput });
  };
  const handleClearRlFilters = () => {
    setRlSearchTermInput(''); setRlCategoryFilterInput(''); setRlLocationFilterInput('');
    setAppliedRlFilters({ term: '', category: '', location: '' });
  };

  const handleRsSearch = () => {
    setAppliedRsFilters({ term: rsSearchTermInput, date: rsDateFilterInput, listingType: rsListingTypeFilterInput });
  };
  const handleClearRsFilters = () => {
    setRsSearchTermInput(''); setRsDateFilterInput(''); setRsListingTypeFilterInput('');
    setAppliedRsFilters({ term: '', date: '', listingType: '' });
  };

  const handleBsSearch = () => {
    setAppliedBsFilters({ term: bsSearchTermInput, itemType: bsItemTypeFilterInput, listingType: bsListingTypeFilterInput, condition: bsConditionFilterInput });
  };
  const handleClearBsFilters = () => {
    setBsSearchTermInput(''); setBsItemTypeFilterInput(''); setBsListingTypeFilterInput(''); setBsConditionFilterInput('');
    setAppliedBsFilters({ term: '', itemType: '', listingType: '', condition: '' });
  };
  
  const allTextbookCourses = useMemo(() => {
    const courses = new Set<string>();
    textbookListings.forEach(book => { 
      if (book.course) courses.add(book.course);
    });
    return Array.from(courses).sort();
  }, [textbookListings]);

  const allStudyGroupCourses = useMemo(() => {
    const courses = new Set<string>();
    studyGroupListings.forEach(group => {
      if (group.course) courses.add(group.course);
    });
    return Array.from(courses).sort();
  }, [studyGroupListings]);


  const academicSections: Section[] = [
    {
      id: 'course-material',
      title: 'Course Material Exchange',
      features: [
        { id: 'textbooks', title: 'Buy/Sell Used Textbooks', description: 'Trade textbooks, notes, and study guides. Seller ratings included.', icon: BookOpenIcon, action: () => openSubFeature('course-material', 'textbooks') },
        { id: 'study-groups', title: 'Study Group Finder', description: 'Post and search for study groups by course or topic.', icon: UsersIcon, action: () => openSubFeature('course-material', 'study-groups') },
        { id: 'tutoring', title: 'Tutoring Marketplace', description: 'Offer or find tutoring services for specific courses.', icon: BriefcaseIcon, action: () => openSubFeature('course-material', 'tutoring') },
      ],
    },
    {
      id: 'campus-resources',
      title: 'Campus Resource Hub',
      features: [
        { id: 'lab-equipment', title: 'Lab Equipment/Software Sharing', description: 'Find or offer access to specialized lab equipment or software.', icon: ComputerDesktopIcon, details: ["University Guideline Compliance"] }, // No action yet
        { id: 'lost-found', title: 'Lost & Found', description: 'Digital bulletin board for lost and found items on campus.', icon: DocumentMagnifyingGlassIcon, action: () => openSubFeature('campus-resources', 'lost-found') },
      ],
    },
    {
      id: 'academic-services',
      title: 'Academic Services',
      features: [
        { id: 'peer-review', title: 'Peer Review/Editing', description: 'Offer or find services for proofreading, editing, and feedback.', icon: ClipboardDocumentListIcon, action: () => openSubFeature('academic-services', 'peer-review') },
        { id: 'thesis-support', title: 'Thesis/Dissertation Support', description: 'Find or offer support for research, data analysis, writing, etc.', icon: LightBulbIcon, action: () => openSubFeature('academic-services', 'thesis-support') },
      ],
    },
  ];
  
  const extraCurricularSections: Section[] = [
    {
      id: 'club-org',
      title: 'Club & Organization Hub',
      features: [
        { id: 'club-membership', title: 'Club Membership Marketplace', description: 'Clubs list membership drives, events, and merchandise.', icon: MegaphoneIcon, action: () => openSubFeature('club-org', 'club-membership') },
        { id: 'event-ticketing', title: 'Event Ticketing', description: 'Securely buy and sell tickets for campus events.', icon: TicketIcon, action: () => openSubFeature('club-org', 'event-ticketing') },
        { id: 'merch-storefronts', title: 'Merchandise Storefronts', description: 'Clubs and departments sell branded merchandise.', icon: ShoppingBagIcon, action: () => openSubFeature('club-org', 'merch-storefronts') },
      ],
    },
     {
      id: 'skill-based',
      title: 'Skill-Based Services & Exchange',
      features: [
        { id: 'freelance-gig', title: 'Freelance/Gig Marketplace', description: 'Students offer various skills and services to peers.', icon: SparklesIcon, action: () => openSubFeature('skill-based', 'freelance-gig') },
        { id: 'equipment-rental', title: 'Equipment Rental/Sharing', description: 'Rent out or borrow items like sports gear or musical instruments.', icon: ShareIcon, action: () => openSubFeature('skill-based', 'equipment-rental') },
      ],
    },
    {
      id: 'transportation',
      title: 'Transportation & Ride-Sharing',
      features: [
        { id: 'ride-share', title: 'Campus Ride-Share', description: 'Arrange carpools for errands, airport runs, or trips home.', icon: TruckIcon, action: () => openSubFeature('transportation', 'ride-share') },
        { id: 'bike-scooter', title: 'Bicycle/Scooter Exchange', description: 'Buy, sell, or rent bikes and scooters on campus.', icon: BoltIcon, action: () => openSubFeature('transportation', 'bike-scooter') },
      ],
    },
    {
      id: 'housing',
      title: 'Housing & Accommodation (Student-Focused)',
      features: [
        { id: 'sublet', title: 'Sublet Marketplace', description: 'Post and search for temporary sublets.', icon: HomeIcon, action: () => openSubFeature('housing', 'sublet') },
        { id: 'roommate-finder', title: 'Roommate Finder', description: 'Find compatible roommates for off-campus housing.', icon: UserPlusIcon, action: () => openSubFeature('housing', 'roommate-finder') },
      ],
    },
    {
      id: 'personal-exchange',
      title: 'Personal Services & Exchange',
      features: [
        { id: 'food-exchange', title: 'Food/Meal Exchange', description: 'Offer homemade meals or exchange meal swipes (policy permitting).', icon: CakeIcon, action: () => openSubFeature('personal-exchange', 'food-exchange') },
        { id: 'second-hand', title: 'Second-Hand Goods', description: 'General marketplace for used furniture, electronics, clothing, etc.', icon: ArchiveBoxIcon, action: () => openSubFeature('personal-exchange', 'second-hand') },
      ],
    },
  ];
  
  const coreFeaturesList = [
      { title: "User Profiles", icon: UserCircleIcon, description: "Detailed profiles with academic major, interests, and ratings/reviews." },
      { title: "Search & Filters", icon: MagnifyingGlassIcon, description: "Robust search with filters for categories, price, location, etc." },
      { title: "Secure Messaging", icon: ChatBubbleLeftRightIcon, description: "In-app messaging for buyers and sellers." },
      { title: "Payment Gateway", icon: CreditCardIcon, description: "Secure payment processing (e.g., credit card, mobile payments)." },
      { title: "Rating & Review System", icon: StarIconSolid, description: "Builds trust and accountability through user feedback." },
      { title: "Notifications", icon: BellAlertIcon, description: "Real-time updates for new listings, messages, and transactions." },
      { title: "Wishlist/Favorites", icon: HeartIcon, description: "Save items or services of interest." },
      { title: "Admin Moderation & Support", icon: ShieldCheckIcon, description: "System for reporting issues and ensuring compliance." },
  ];

  const FeatureCard: React.FC<{ feature: Feature, sectionId: string }> = ({ feature, sectionId }) => (
    <button
      onClick={feature.action}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col text-left w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      aria-label={`Open ${feature.title}`}
      disabled={!feature.action} 
    >
      <div className="flex items-center mb-3">
        <feature.icon className={`w-8 h-8 ${!feature.action ? 'text-gray-400 dark:text-gray-600' : 'text-blue-500 dark:text-blue-400'} mr-3 flex-shrink-0`} />
        <h4 className={`text-md font-semibold ${!feature.action ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{feature.title}</h4>
      </div>
      {feature.description && <p className={`text-xs ${!feature.action ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'} mb-3 flex-grow`}>{feature.description}</p>}
      {feature.details && feature.details.length > 0 && (
        <ul className="list-disc list-inside text-2xs text-gray-500 dark:text-gray-500 mb-3 space-y-0.5 pl-1">
          {feature.details.map((detail, idx) => <li key={idx}>{detail}</li>)}
        </ul>
      )}
      <p className={`text-xs font-medium ${!feature.action ? 'text-gray-400 dark:text-gray-600' : 'text-blue-600 dark:text-blue-500'} mt-auto pt-2 border-t border-gray-200 dark:border-gray-700`}>
        {feature.action ? 'Explore Feature' : 'Coming Soon'}
      </p>
    </button>
  );

  const CoreFeaturePill: React.FC<{ title: string, icon: React.ElementType }> = ({ title, icon: Icon }) => (
      <span className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-700/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium mr-2 mb-2">
          <Icon className="w-4 h-4 mr-1.5" />
          {title}
      </span>
  );

  const StarRating: React.FC<{ rating: number; reviewCount: number; compact?: boolean }> = ({ rating, reviewCount, compact=false }) => {
    return (
      <div className="flex items-center">
        <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1" />
        <span className={`font-bold text-gray-700 dark:text-gray-200 ${compact ? 'text-xs' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
        <span className={`ml-1.5 text-gray-500 dark:text-gray-400 ${compact ? 'text-2xs' : 'text-xs'}`}>
          ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  const FavoriteFilterToggle = ({ isChecked, setChecked }: { isChecked: boolean, setChecked: (c:boolean)=>void }) => (
      <div className="sm:ml-auto">
        <label className="flex items-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input 
            type="checkbox" 
            checked={isChecked}
            onChange={(e) => setChecked(e.target.checked)}
            className="h-4 w-4 text-pink-600 border-gray-300 dark:border-gray-500 rounded focus:ring-pink-500"
            />
            <HeartIcon className="w-5 h-5 ml-2 text-pink-500"/>
            <span className="ml-1">Favorites Only</span>
        </label>
      </div>
  );

  const CardActions: React.FC<{ item: any, itemType: string }> = ({ item, itemType }) => {
    const isOwner = item.sellerId === currentUser.id || item.listedById === currentUser.id || item.postedByUserId === currentUser.id;
    
    const isPurchasable = (
        item.price !== undefined &&
        (itemType === 'textbook' || 
         itemType === 'secondHandGood' || 
         itemType === 'food' || 
         itemType === 'eventTicket' || 
         itemType === 'merchandise' || 
         (itemType === 'bikeScooter' && item.listingType === BikeScooterListingType.FOR_SALE))
    );

    const renderBuyButton = () => {
        if (!isPurchasable) return null;
        const canAfford = currentUser.walletBalance >= item.price;
        if (item.isSold) {
            return (
                <button disabled className="w-full px-3 py-1.5 bg-gray-400 dark:bg-gray-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center cursor-not-allowed">
                    <NoSymbolIcon className="w-4 h-4 mr-1.5"/> Sold
                </button>
            );
        }
        if (isOwner) {
            return (
                <button disabled className="w-full px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold rounded-md shadow-sm cursor-not-allowed">
                    Your Listing
                </button>
            );
        }
        if (canAfford) {
            return (
                <button onClick={() => handlePurchase(item, itemType)} className="w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center">
                    <BanknotesIcon className="w-4 h-4 mr-1.5" /> Buy for ₦{item.price.toLocaleString()}
                </button>
            );
        }
        return (
            <button disabled className="w-full px-3 py-1.5 bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-400 text-xs font-semibold rounded-md shadow-sm cursor-not-allowed">
                Insufficient Funds
            </button>
        );
    };

    const renderContactButton = () => {
        if(isOwner) return null; // Don't show contact for own items
        return (
            <button onClick={() => alert(`Contacting about "${item.title || item.itemName || item.groupName || item.brandModel || 'this listing'}"...`)} className="w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center">
                Contact
            </button>
        );
    }

    return (
        <div className="mt-3 w-full flex items-center justify-between space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex-grow">
                { isPurchasable ? renderBuyButton() : renderContactButton() }
            </div>
            {!isOwner && (
                <div className="flex items-center">
                    <button onClick={() => toggleFavorite(item.id)} className="p-1.5" title={favorites[item.id] ? "Remove from favorites" : "Add to favorites"}>
                        {favorites[item.id] ? <HeartIconSolid className="w-5 h-5 text-pink-500"/> : <HeartIcon className="w-5 h-5 text-gray-400 hover:text-pink-500"/>}
                    </button>
                    <button onClick={() => alert(`Reported listing: "${item.title || item.itemName || item.groupName || item.brandModel || 'this listing'}"`)} className="p-1.5" title="Report this listing">
                        <FlagIcon className="w-5 h-5 text-gray-400 hover:text-red-500"/>
                    </button>
                </div>
            )}
        </div>
    );
};

  const FavoriteButton: React.FC<{ itemId: string; isFavorited: boolean }> = ({ itemId, isFavorited }) => (
    <button
        onClick={() => toggleFavorite(itemId)}
        className="absolute top-2 right-2 p-1.5 bg-white/70 dark:bg-gray-800/70 rounded-full hover:bg-white dark:hover:bg-gray-700 transition z-10"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
        {isFavorited ? (
            <HeartIconSolid className="w-5 h-5 text-pink-500" />
        ) : (
            <HeartIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-pink-500" />
        )}
    </button>
  );


  const renderTextbookExchange = () => ( 
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <BookOpenIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
          Buy/Sell Used Textbooks
        </h3>
        <button
          onClick={() => setIsListTextbookModalOpen(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> List Your Textbook
        </button>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 lg:col-span-1">
            <label htmlFor="searchTerm" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search Title, Author, ISBN</label>
            <input 
              type="text" 
              id="searchTerm"
              placeholder="e.g., Organic Chemistry, Stewart, 978..." 
              value={searchTermInput}
              onChange={(e) => setSearchTermInput(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="courseFilter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
            <select 
              id="courseFilter"
              value={courseFilterInput}
              onChange={(e) => setCourseFilterInput(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All Courses</option>
              {allTextbookCourses.map(course => <option key={course} value={course}>{course}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="conditionFilter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
            <select 
              id="conditionFilter"
              value={conditionFilterInput}
              onChange={(e) => setConditionFilterInput(e.target.value as TextbookCondition | '')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All Conditions</option>
              {Object.values(TextbookCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleTextbookSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
                >
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" /> Search
                </button>
                <button
                    onClick={handleClearTextbookFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium flex items-center"
                >
                    <XMarkIcon className="w-4 h-4 mr-2" /> Clear
                </button>
            </div>
             <div className="mt-3 sm:mt-0">
               <FavoriteFilterToggle isChecked={showFavoriteTextbooks} setChecked={setShowFavoriteTextbooks} />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedTextbooks.map(book => (
          <div key={book.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden transition-opacity ${book.isSold ? 'opacity-50' : ''}`}>
            {!book.isSold && <FavoriteButton itemId={book.id} isFavorited={!!favorites[book.id]} />}
            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
              <img src={book.imageUrl || `https://picsum.photos/seed/${book.id}/200/300`} alt={book.title} className="w-full h-full object-contain" />
              {book.isSold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-lg font-bold bg-red-600 px-4 py-1 rounded-md transform -rotate-12">SOLD</span></div>}
            </div>
            <div className="p-3 flex flex-col flex-grow">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate" title={book.title}>{book.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">by {book.author}</p>
              <div className="text-xs space-y-1 mt-auto">
                {book.course && <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full mr-1">#{book.course}</span>}
                <span className="inline-block bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">{book.condition}</span>
              </div>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2">₦{book.price.toLocaleString()}</p>
              <CardActions item={book} itemType="textbook" />
            </div>
          </div>
        ))}
      </div>
      {displayedTextbooks.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>No textbooks found matching your criteria.</p>
              <p className="text-sm">Try adjusting your filters or check back later!</p>
          </div>
      )}
    </div>
  );
  
  // Placeholder for renderStudyGroupFinder
  const renderStudyGroupFinder = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <UsersIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
          Study Group Finder
        </h3>
        <button
          onClick={() => setIsListStudyGroupModalOpen(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> List Your Study Group
        </button>
      </div>

       <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 lg:col-span-1">
            <label htmlFor="sgSearchTerm" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search Name, Course, Topic</label>
            <input 
              type="text" 
              id="sgSearchTerm"
              placeholder="e.g., Midterm Prep, CS101..." 
              value={sgSearchTermInput}
              onChange={(e) => setSgSearchTermInput(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="sgCourseFilter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
            <select 
              id="sgCourseFilter"
              value={sgCourseFilterInput}
              onChange={(e) => setSgCourseFilterInput(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All Courses</option>
              {allStudyGroupCourses.map(course => <option key={course} value={course}>{course}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sgMeetingPrefFilter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Preference</label>
            <select 
              id="sgMeetingPrefFilter"
              value={sgMeetingPrefInput}
              onChange={(e) => setSgMeetingPrefInput(e.target.value as MeetingPreference | '')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">All Preferences</option>
              {Object.values(MeetingPreference).map(pref => <option key={pref} value={pref}>{pref}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleStudyGroupSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
                >
                    <MagnifyingGlassIcon className="w-4 h-4 mr-2" /> Search
                </button>
                <button
                    onClick={handleClearStudyGroupFilters}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium flex items-center"
                >
                    <XMarkIcon className="w-4 h-4 mr-2" /> Clear
                </button>
            </div>
             <div className="mt-3 sm:mt-0">
                <FavoriteFilterToggle isChecked={showFavoriteStudyGroups} setChecked={setShowFavoriteStudyGroups} />
            </div>
        </div>
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedStudyGroups.map(group => (
          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 relative">
            <FavoriteButton itemId={group.id} isFavorited={!!favorites[group.id]} />
            <div className="flex-grow">
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-1 rounded-md">{group.course}</span>
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mt-2" title={group.groupName}>{group.groupName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{group.topic}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex-grow">{group.description}</p>
              {group.rating && <StarRating rating={group.rating} reviewCount={group.reviewCount || 0} compact />}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-1 text-xs">
              <p className="flex items-center text-gray-600 dark:text-gray-300"><UsersIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>Size: {group.currentSize || 0} / {group.maxSize || 'Unlimited'}</p>
              <p className="flex items-center text-gray-600 dark:text-gray-300"><SignalIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>{group.meetingPreference}</p>
              {group.location && <p className="flex items-center text-gray-600 dark:text-gray-300"><MapPinIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400"/>{group.location}</p>}
            </div>
             <div className="mt-3 w-full flex items-center justify-between space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button onClick={() => alert('Contacting group organizer...')} className="flex-grow px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center">Contact to Join</button>
            </div>
          </div>
        ))}
      </div>
      {displayedStudyGroups.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>No study groups found matching your criteria.</p>
          </div>
      )}
    </div>
  );

  const renderTutorFinder = () => (
     <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <BriefcaseIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
          Tutoring Marketplace
        </h3>
        <button
          onClick={() => setIsListTutorModalOpen(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Offer Tutoring Services
        </button>
      </div>
       <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* ... Tutor filters will go here ... */}
       </div>

      <div className="space-y-4">
        {displayedTutors.map(tutor => (
          <div key={tutor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row p-4 relative">
             <FavoriteButton itemId={tutor.id} isFavorited={!!favorites[tutor.id]} />
            <div className="flex-shrink-0 sm:mr-4 mb-3 sm:mb-0 text-center">
              <img src={tutor.avatarUrl || `https://ui-avatars.com/api/?name=${tutor.tutorName.replace(/\s/g, '+')}&background=random&color=fff&size=100`} alt={tutor.tutorName} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{tutor.tutorName}</h4>
                    {tutor.schoolOfStudy && <p className="text-xs text-gray-500 dark:text-gray-400">{tutor.schoolOfStudy}</p>}
                  </div>
                   {tutor.rating && <StarRating rating={tutor.rating} reviewCount={tutor.reviewCount || 0} />}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tutor.bio}</p>
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Teaches:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tutor.subjects.map(s => <span key={s} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">{s}</span>)}
                  {tutor.courses && tutor.courses.map(c => <span key={c} className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">#{c}</span>)}
                </div>
              </div>
            </div>
             <div className="flex-shrink-0 sm:ml-4 sm:border-l sm:pl-4 border-gray-200 dark:border-gray-700 mt-3 sm:mt-0 text-center sm:text-right">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₦{tutor.rate.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">{tutor.rateType}</p>
                <p className={`mt-2 text-xs font-medium px-2 py-1 rounded-md inline-block ${tutor.deliveryMethod === TutoringDeliveryMethod.ONLINE ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'}`}>{tutor.deliveryMethod}</p>
                <div className="mt-2"><CardActions item={tutor} itemType="tutor" /></div>
            </div>
          </div>
        ))}
      </div>
     </div>
  );

  const renderLostAndFound = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <DocumentMagnifyingGlassIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
          Lost & Found
        </h3>
        <button
          onClick={() => setIsListLostFoundItemModalOpen(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Report an Item
        </button>
      </div>

       <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
        {/* Lost & Found filters go here */}
      </div>

      <div className="space-y-4">
        {displayedLostAndFoundItems.map(item => (
          <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row p-4 relative overflow-hidden ${item.isResolved ? 'opacity-60' : ''}`}>
            {item.isResolved && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-4 py-1 transform -rotate-45 -translate-x-8 translate-y-2">RESOLVED</div>
            )}
            <FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} />
            {item.imageUrl && (
              <div className="flex-shrink-0 sm:mr-4 mb-3 sm:mb-0">
                <img src={item.imageUrl} alt={item.itemName} className="w-32 h-32 mx-auto sm:mx-0 rounded-md object-cover border-2 border-gray-300 dark:border-gray-600" />
              </div>
            )}
            <div className="flex-grow">
              <span className={`text-sm font-bold ${item.status === LostAndFoundStatus.LOST ? 'text-red-500' : 'text-green-500'}`}>{item.status}</span>
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{item.itemName}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                  <p><span className="font-semibold">Last Seen/Found:</span> {new Date(item.dateLostOrFound).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Location:</span> {item.locationLostOrFound}</p>
                  <p><span className="font-semibold">Category:</span> {item.category}</p>
              </div>
            </div>
            <div className="flex-shrink-0 sm:ml-4 sm:border-l sm:pl-4 border-gray-200 dark:border-gray-700 mt-3 sm:mt-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Posted by {item.postedByUserName}</p>
              <button onClick={() => alert(`Contacting poster: ${item.contactInfo}`)} className="w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center">Contact Poster</button>
               {item.postedByUserId === currentUser.id && (
                  <button onClick={() => handleMarkLfItemResolved(item.id)} className="mt-2 text-xs w-full text-center px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                    {item.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                  </button>
              )}
            </div>
          </div>
        ))}
      </div>
       {displayedLostAndFoundItems.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <p>No items found matching your criteria.</p>
          </div>
      )}
    </div>
  );

  const renderPeerReview = () => (
      <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                  <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
                  Peer Review & Editing
              </h3>
              <button
                  onClick={() => setIsListPeerReviewModalOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
              >
                  <PlusCircleIcon className="w-5 h-5 mr-2" /> Post a Listing
              </button>
          </div>
          <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
              {/* Filters for Peer Review */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPeerReviewListings.map(listing => (
                  <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 relative">
                      <FavoriteButton itemId={listing.id} isFavorited={!!favorites[listing.id]} />
                      <span className={`text-xs font-bold ${listing.listingType === MarketplaceListingType.OFFERING ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>{listing.listingType}</span>
                      <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 mt-1 truncate" title={listing.title}>{listing.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{listing.serviceType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 my-2 flex-grow">{listing.description}</p>
                      {listing.rating !== undefined && <StarRating rating={listing.rating} reviewCount={listing.reviewCount || 0} compact />}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                              {listing.rate !== undefined ? `₦${listing.rate.toLocaleString()}` : ''}
                              <span className="text-xs font-normal ml-1">{listing.rateType}</span>
                          </p>
                          <CardActions item={listing} itemType="peerReview" />
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderThesisSupport = () => (
      <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                  <LightBulbIcon className="w-8 h-8 mr-3 text-yellow-500 dark:text-yellow-400" />
                  Thesis & Dissertation Support
              </h3>
              <button
                  onClick={() => setIsListThesisSupportModalOpen(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"
              >
                  <PlusCircleIcon className="w-5 h-5 mr-2" /> Post a Listing
              </button>
          </div>
          <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
              {/* Filters for Thesis Support */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedThesisSupportListings.map(listing => (
                  <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 relative">
                      <FavoriteButton itemId={listing.id} isFavorited={!!favorites[listing.id]} />
                      <span className={`text-xs font-bold ${listing.listingType === MarketplaceListingType.OFFERING ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>{listing.listingType}</span>
                      <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 mt-1 truncate" title={listing.title}>{listing.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{listing.supportType}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 my-2 flex-grow">{listing.description}</p>
                      {listing.rating !== undefined && <StarRating rating={listing.rating} reviewCount={listing.reviewCount || 0} compact />}
                       <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                              {listing.rate !== undefined ? `₦${listing.rate.toLocaleString()}` : ''}
                              <span className="text-xs font-normal ml-1">{listing.rateType}</span>
                          </p>
                          <CardActions item={listing} itemType="thesisSupport" />
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderClubProfiles = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <MegaphoneIcon className="w-8 h-8 mr-3 text-purple-500 dark:text-purple-400" />
          Club Membership Marketplace
        </h3>
        <button onClick={() => setIsListClubProfileModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" /> List Your Club
        </button>
      </div>
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="cpSearchTerm" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search Club Name, Description</label>
            <input type="text" id="cpSearchTerm" placeholder="e.g., Tech, Film Society" value={cpSearchTermInput} onChange={e => setCpSearchTermInput(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm" />
          </div>
          <div>
            <label htmlFor="cpClubTypeFilter" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Club Type</label>
            <select id="cpClubTypeFilter" value={cpClubTypeFilterInput} onChange={e => setCpClubTypeFilterInput(e.target.value as ClubType | '')} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
              <option value="">All Types</option>
              {Object.values(ClubType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={handleCpSearch} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium flex items-center">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" /> Search
            </button>
            <button onClick={handleClearCpFilters} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium flex items-center">
              <XMarkIcon className="w-4 h-4 mr-2" /> Clear
            </button>
          </div>
          <div className="mt-3 sm:mt-0">
            <FavoriteFilterToggle isChecked={showFavoriteClubs} setChecked={setShowFavoriteClubs} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {displayedClubProfiles.map(club => (
          <div key={club.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row p-4 relative">
            <FavoriteButton itemId={club.id} isFavorited={!!favorites[club.id]} />
            <div className="flex-shrink-0 sm:mr-4 mb-3 sm:mb-0 text-center">
                <img src={club.logoUrl || `https://ui-avatars.com/api/?name=${club.clubName.replace(/\s/g, '+')}&background=random&color=fff&size=100`} alt={`${club.clubName} logo`} className="w-24 h-24 rounded-lg mx-auto object-cover border-2 border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex-grow">
              <span className="text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 px-2 py-1 rounded-md">{club.clubType}</span>
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mt-2">{club.clubName}</h4>
              {club.rating && <div className="mt-1"><StarRating rating={club.rating} reviewCount={club.reviewCount || 0} /></div>}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{club.description}</p>
              {club.meetingInfo && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center"><ClockIcon className="w-3.5 h-3.5 mr-1"/> {club.meetingInfo}</p>}
            </div>
            <div className="flex-shrink-0 sm:ml-4 sm:border-l sm:pl-4 border-gray-200 dark:border-gray-700 mt-3 sm:mt-0 text-center sm:text-right">
              {club.membershipTiers && club.membershipTiers.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Starts at</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">₦{Math.min(...club.membershipTiers.map(t => t.price)).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">per {club.membershipTiers[0].duration}</p>
                </>
              ) : <p className="text-sm text-gray-500 dark:text-gray-400">Free to Join</p>}
               <button onClick={() => alert('Viewing membership tiers for ' + club.clubName)} className="mt-2 w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-md shadow-sm flex items-center justify-center">View Tiers</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderEventTicketing = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <TicketIcon className="w-8 h-8 mr-3 text-green-500 dark:text-green-400" />
                Event Ticketing
            </h3>
            <button onClick={() => setIsListEventTicketModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> Sell a Ticket
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* Filters */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEventTickets.map(ticket => (
                <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden">
                    <FavoriteButton itemId={ticket.id} isFavorited={!!favorites[ticket.id]} />
                    <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700">
                      {ticket.isResale && <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">Resale</span>}
                      <img src={ticket.eventImageUrl || `https://picsum.photos/seed/${ticket.id}/300/200`} alt={ticket.eventName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        <span className="text-xs font-semibold text-green-700 dark:text-green-300">{ticket.eventType}</span>
                        <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 mt-1 truncate" title={ticket.eventName}>{ticket.eventName}</h4>
                        <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          <p className="flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-1.5"/>{new Date(ticket.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="flex items-center"><ClockIcon className="w-4 h-4 mr-1.5"/>{new Date(ticket.eventDate).toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit' })}</p>
                          <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5"/>{ticket.location}</p>
                        </div>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2 mt-auto">₦{ticket.sellingPrice.toLocaleString()}</p>
                        <CardActions item={ticket} itemType="eventTicket" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderMerchandise = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <ShoppingBagIcon className="w-8 h-8 mr-3 text-red-500 dark:text-red-400" />
                Merchandise Storefronts
            </h3>
            <button onClick={() => setIsListMerchandiseModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> List an Item
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* Filters */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedMerchandiseItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden">
                    <FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} />
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                        <img src={item.images[0] || `https://picsum.photos/seed/${item.id}/200/200`} alt={item.itemName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        {item.rating && <StarRating rating={item.rating} reviewCount={item.reviewCount || 0} compact />}
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mt-1" title={item.itemName}>{item.itemName}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">Sold by: {item.sellerInfo}</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2 mt-auto">₦{item.price.toLocaleString()}</p>
                        <CardActions item={item} itemType="merchandise" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderFreelanceService = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <SparklesIcon className="w-8 h-8 mr-3 text-yellow-500 dark:text-yellow-400" />
                Freelance & Gig Marketplace
            </h3>
            <button onClick={() => setIsListFreelanceServiceModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> Post a Service/Gig
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
            {/* Filters for Freelance */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFreelanceListings.map(listing => (
                <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 relative">
                    <FavoriteButton itemId={listing.id} isFavorited={!!favorites[listing.id]} />
                    <span className={`text-xs font-bold ${listing.listingType === MarketplaceListingType.OFFERING ? 'text-green-600' : 'text-blue-600'}`}>{listing.listingType}</span>
                    <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 mt-1 truncate" title={listing.title}>{listing.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{listing.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 my-2 flex-grow">{listing.description}</p>
                    {listing.rating && <StarRating rating={listing.rating} reviewCount={listing.reviewCount || 0} compact />}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {listing.rate !== undefined ? `₦${listing.rate.toLocaleString()}` : ''}
                            <span className="text-xs font-normal ml-1">{listing.rateType}</span>
                        </p>
                        <CardActions item={listing} itemType="freelanceService" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderEquipmentRental = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <ShareIcon className="w-8 h-8 mr-3 text-teal-500 dark:text-teal-400" />
                Equipment Rental & Sharing
            </h3>
            <button onClick={() => setIsListRentalItemModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> List an Item for Rent
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
            {/* Filters for Rental */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedRentalListings.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden">
                    <FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} />
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                        <img src={item.images[0] || `https://picsum.photos/seed/rental${item.id}/200/200`} alt={item.itemName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">{item.category}</span>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mt-1" title={item.itemName}>{item.itemName}</h4>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2 mt-auto">
                            ₦{item.rentalRate.toLocaleString()}
                            <span className="text-xs font-normal ml-1"> {item.rentalRateType}</span>
                        </p>
                         <CardActions item={item} itemType="rental" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  
  const renderRideShare = () => <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"><h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0"><TruckIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />Campus Ride-Share</h3><button onClick={() => setIsListRideShareModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"><PlusCircleIcon className="w-5 h-5 mr-2" /> Post a Ride</button></div><div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow"></div><div className="space-y-4">{displayedRideShareListings.map(listing => (<div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row items-stretch"><div className={`w-full sm:w-24 flex-shrink-0 flex items-center justify-center p-4 rounded-l-lg ${listing.listingType === RideShareType.OFFERING_RIDE ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}><div className="text-center"><p className={`text-xs font-bold uppercase ${listing.listingType === RideShareType.OFFERING_RIDE ? 'text-blue-600 dark:text-blue-300' : 'text-green-600 dark:text-green-300'}`}>{listing.listingType.split(' ')[0]}</p><TruckIcon className={`w-8 h-8 mt-1 ${listing.listingType === RideShareType.OFFERING_RIDE ? 'text-blue-500' : 'text-green-500'}`} /></div></div><div className="flex-grow p-4"><div className="flex justify-between items-start"><div className="flex-grow"><p className="font-semibold text-gray-900 dark:text-gray-100">{listing.departureLocation} ➞ {listing.destinationLocation}</p><p className="text-xs text-gray-500 dark:text-gray-400">{new Date(listing.departureDateTime).toLocaleString()}</p></div><p className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-4"> {listing.costContribution ? `₦${listing.costContribution.toLocaleString()}` : 'Free'}</p></div><div className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap gap-x-3 gap-y-1"><span className="flex items-center"><UsersIcon className="w-3.5 h-3.5 mr-1" />{listing.availableSeats || listing.passengersNeeded} {listing.availableSeats ? 'seat(s) available' : 'passenger(s) needed'}</span><span className="flex items-center"><CalendarDaysIcon className="w-3.5 h-3.5 mr-1" />{listing.recurrence}</span></div></div><div className="flex-shrink-0 p-4 flex flex-col justify-center"><CardActions item={listing} itemType="rideShare" /></div></div>))}</div></div>;
  const renderBikeScooterExchange = () => <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"><h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0"><BoltIcon className="w-8 h-8 mr-3 text-green-500 dark:text-green-400" />Bicycle & Scooter Exchange</h3><button onClick={() => setIsListBikeScooterModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center"><PlusCircleIcon className="w-5 h-5 mr-2" /> List a Bike/Scooter</button></div><div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow"></div><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{displayedBikeScooterListings.map(item => (<div key={item.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden transition-opacity ${item.isSold ? 'opacity-50' : ''}`}><FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} /><div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700"><img src={(item.images && item.images[0]) || `https://picsum.photos/seed/bike${item.id}/200/200`} alt={item.brandModel || item.itemType} className="w-full h-full object-cover" />{item.isSold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-lg font-bold bg-red-600 px-4 py-1 rounded-md transform -rotate-12">SOLD</span></div>}</div><div className="p-3 flex flex-col flex-grow"><span className="text-xs font-semibold text-green-700 dark:text-green-300">{item.listingType}</span><h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mt-1" title={item.brandModel}>{item.brandModel || item.itemType}</h4><div className="text-xs space-y-1 mt-auto"><span className="inline-block bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">{item.condition}</span></div><p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2">{item.price ? `₦${item.price.toLocaleString()}` : item.rentalRate ? `₦${item.rentalRate.toLocaleString()}/${item.rentalRateType?.split(' ')[1]}` : 'Contact for Price'}</p><CardActions item={item} itemType="bikeScooter" /></div></div>))}</div></div>;
  const renderSubletMarketplace = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <HomeIcon className="w-8 h-8 mr-3 text-cyan-500" />
          Sublet Marketplace
        </h3>
        <button onClick={() => setIsListSubletModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" /> List Your Sublet
        </button>
      </div>
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
        {/* Filters for Sublets */}
      </div>
      <div className="space-y-6">
        {displayedSublets.map(sublet => (
          <div key={sublet.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row relative overflow-hidden ${sublet.isSold ? 'opacity-60' : ''}`}>
             {!sublet.isSold && <FavoriteButton itemId={sublet.id} isFavorited={!!favorites[sublet.id]} />}
              {sublet.isSold && <div className="absolute top-4 left-0 bg-red-600 text-white text-xs font-bold px-4 py-1 transform -rotate-45 -translate-x-8">TAKEN</div>}
             <div className="md:w-1/3 flex-shrink-0 h-48 md:h-auto bg-gray-200 dark:bg-gray-700">
                <img src={sublet.images[0] || `https://picsum.photos/seed/apt${sublet.id}/400/300`} alt={sublet.title} className="w-full h-full object-cover"/>
             </div>
             <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{sublet.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center my-1"><MapPinIcon className="w-4 h-4 mr-1.5"/>{sublet.location}</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 my-2">₦{sublet.rent.toLocaleString()} <span className="text-sm font-normal text-gray-600 dark:text-gray-300">/{sublet.rentFrequency.split(' ')[1]}</span></p>
                <div className="text-xs flex items-center gap-x-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center"><HomeModernIcon className="w-4 h-4 mr-1"/>{sublet.bedrooms} bed</span>
                    <span className="flex items-center"><SwatchIcon className="w-4 h-4 mr-1"/>{sublet.bathrooms} bath</span>
                    <span className="flex items-center"><SparklesIcon className="w-4 h-4 mr-1"/>{sublet.furnishedStatus}</span>
                </div>
                 <div className="my-3 text-xs text-gray-500 dark:text-gray-400">
                    <p><b>Available:</b> {new Date(sublet.availableFrom).toLocaleDateString()} to {new Date(sublet.availableTo).toLocaleDateString()}</p>
                </div>
                <CardActions item={sublet} itemType="sublet" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderRoommateFinder = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
          <UserPlusIcon className="w-8 h-8 mr-3 text-cyan-500" />
          Roommate Finder
        </h3>
        <button onClick={() => setIsListRoommateModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Roommate Profile
        </button>
      </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* Filters for Roommates */}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRoommates.map(profile => (
              <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col p-4 relative">
                 <FavoriteButton itemId={profile.id} isFavorited={!!favorites[profile.id]} />
                  <div className="flex items-center mb-3">
                    <img src={profile.profileImageUrl || `https://ui-avatars.com/api/?name=${profile.postedByUserName.replace(/\s/g, '+')}&background=random&color=fff&size=100`} alt={profile.postedByUserName} className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-500" />
                    <div className="ml-3">
                        <h4 className="font-bold text-md text-gray-900 dark:text-gray-100">{profile.postedByUserName}, {profile.age}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.schoolProgram}</p>
                         <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-md ${profile.listingType === RoommateListingType.SEEKING_PLACE ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {profile.listingType === RoommateListingType.SEEKING_PLACE ? 'Needs a Room' : 'Has a Room'}
                        </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">"{profile.bio.substring(0, 100)}{profile.bio.length > 100 ? '...' : ''}"</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-1 text-xs">
                      <p><span className="font-semibold">Budget/Rent:</span> ₦{profile.rent.toLocaleString()}/month</p>
                      <p><span className="font-semibold">Location:</span> {profile.location}</p>
                      <p><span className="font-semibold">Move-in:</span> {new Date(profile.moveInDate).toLocaleDateString()}</p>
                  </div>
                   <CardActions item={profile} itemType="roommate" />
              </div>
          ))}
      </div>
    </div>
  );
  const renderFoodExchange = () => (
    <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <CakeIcon className="w-8 h-8 mr-3 text-pink-500" />
                Food & Meal Exchange
            </h3>
            <button onClick={() => setIsListFoodModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> List a Food Item
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* Filters would go here */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedFoodListings.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden">
                    <FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} />
                    <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700">
                        {item.images && item.images[0] && <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">{item.category}</span>
                        <h4 className="font-bold text-md text-gray-900 dark:text-gray-100 mt-1 truncate" title={item.title}>{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex-grow">{item.description}</p>
                        <div className="my-2 flex flex-wrap gap-1">
                          {item.dietaryInfo?.map(tag => <span key={tag} className="text-2xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">{tag}</span>)}
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {item.price ? `₦${item.price.toLocaleString()}` : ''}
                                {item.price && item.swipeEquivalent ? ' or ' : ''}
                                {item.swipeEquivalent ? `${item.swipeEquivalent} swipe(s)` : ''}
                            </p>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item.portionsAvailable} available</span>
                        </div>
                        <CardActions item={item} itemType="food" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
  const renderSecondHandGoods = () => (
      <div className="bg-gray-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center mb-3 sm:mb-0">
                <ArchiveBoxIcon className="w-8 h-8 mr-3 text-indigo-500" />
                Second-Hand Goods
            </h3>
            <button onClick={() => setIsListSecondHandGoodModalOpen(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center self-start sm:self-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" /> List an Item
            </button>
        </div>
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-md shadow">
          {/* Filters would go here */}
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedSecondHandGoods.map(item => (
                 <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col relative overflow-hidden transition-opacity ${item.isSold ? 'opacity-50' : ''}`}>
                    {!item.isSold && <FavoriteButton itemId={item.id} isFavorited={!!favorites[item.id]} />}
                    <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                        <img src={item.images[0] || `https://picsum.photos/seed/${item.id}/200/200`} alt={item.itemName} className="w-full h-full object-cover" />
                         {item.isSold && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-lg font-bold bg-red-600 px-4 py-1 rounded-md transform -rotate-12">SOLD</span></div>}
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{item.category}</span>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate mt-1" title={item.itemName}>{item.itemName}</h4>
                        <div className="text-xs space-y-1 mt-auto">
                          <span className="inline-block bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">{item.condition}</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 my-2">₦{item.price.toLocaleString()}</p>
                        <CardActions item={item} itemType="secondHandGood" />
                    </div>
                </div>
            ))}
         </div>
      </div>
  );

  let subFeatureContent: React.ReactNode = null;
  let subFeatureTitle = '';
  let subFeatureIcon: React.ElementType = InformationCircleIcon;

  if (activeSubFeature) {
      const findFeature = (sections: Section[]) => {
          for (const section of sections) {
              const feature = section.features.find(f => f.id === activeSubFeature?.featureId && section.id === activeSubFeature.sectionId);
              if (feature) {
                  subFeatureTitle = feature.title;
                  subFeatureIcon = feature.icon;
                  switch (feature.id) {
                      case 'textbooks': subFeatureContent = renderTextbookExchange(); break;
                      case 'study-groups': subFeatureContent = renderStudyGroupFinder(); break;
                      case 'tutoring': subFeatureContent = renderTutorFinder(); break;
                      case 'lost-found': subFeatureContent = renderLostAndFound(); break;
                      case 'peer-review': subFeatureContent = renderPeerReview(); break;
                      case 'thesis-support': subFeatureContent = renderThesisSupport(); break;
                      case 'club-membership': subFeatureContent = renderClubProfiles(); break;
                      case 'event-ticketing': subFeatureContent = renderEventTicketing(); break;
                      case 'merch-storefronts': subFeatureContent = renderMerchandise(); break;
                      case 'freelance-gig': subFeatureContent = renderFreelanceService(); break;
                      case 'equipment-rental': subFeatureContent = renderEquipmentRental(); break;
                      case 'ride-share': subFeatureContent = renderRideShare(); break;
                      case 'bike-scooter': subFeatureContent = renderBikeScooterExchange(); break;
                      case 'sublet': subFeatureContent = renderSubletMarketplace(); break;
                      case 'roommate-finder': subFeatureContent = renderRoommateFinder(); break;
                      case 'food-exchange': subFeatureContent = renderFoodExchange(); break;
                      case 'second-hand': subFeatureContent = renderSecondHandGoods(); break;
                      default: subFeatureContent = <p>This feature is under construction.</p>;
                  }
                  return true;
              }
          }
          return false;
      }

      if (!findFeature(academicSections)) {
          findFeature(extraCurricularSections);
      }
  }
  const SubFeatureIcon = activeSubFeature ? subFeatureIcon : InformationCircleIcon;

  return (
    <>
      {activeSubFeature ? (
          <div className="flex-1 flex flex-col bg-gray-100 dark:bg-slate-900 overflow-y-auto">
              <div className="flex items-center p-4 md:p-6 sticky top-0 bg-gray-100 dark:bg-slate-900 z-20 border-b border-gray-200 dark:border-gray-800">
                  <button
                      onClick={closeSubFeature}
                      className="p-2 mr-4 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <ArrowUturnLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
                  <div className="flex items-center">
                      <SubFeatureIcon className="w-8 h-8 mr-3 text-blue-500 dark:text-blue-400" />
                      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">{subFeatureTitle}</h2>
                  </div>
              </div>
              <div className="p-4 md:p-6">{subFeatureContent}</div>
          </div>
      ) : (
        <div className="flex-1 flex flex-col p-4 md:p-6 bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 overflow-y-auto">
            <div className="mb-6 pb-4 border-b border-gray-300 dark:border-gray-700">
                <div className="flex items-center text-2xl md:text-3xl font-semibold text-orange-600 dark:text-orange-400">
                    <BuildingStorefrontIcon className="w-8 h-8 mr-3" />
                    Campus Marketplace
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">A central hub for student-to-student commerce and services.</p>
            </div>

            <div className="mb-6">
                <div className="flex border-b border-gray-300 dark:border-gray-700">
                    <button onClick={() => setActiveTab('academic')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'academic' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        Academic
                    </button>
                    <button onClick={() => setActiveTab('extraCurricular')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'extraCurricular' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                        Student Life & Gigs
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {activeTab === 'academic' && academicSections.map(section => (
                    <section key={section.id}>
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{section.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.features.map(feature => <FeatureCard key={feature.id} feature={feature} sectionId={section.id} />)}
                        </div>
                    </section>
                ))}
                {activeTab === 'extraCurricular' && extraCurricularSections.map(section => (
                    <section key={section.id}>
                        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">{section.title}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.features.map(feature => <FeatureCard key={feature.id} feature={feature} sectionId={section.id} />)}
                        </div>
                    </section>
                ))}
                <section className="pt-6 border-t border-gray-300 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Core Marketplace Features</h3>
                    <div className="flex flex-wrap">
                        {coreFeaturesList.map(feature => (
                            <CoreFeaturePill key={feature.title} title={feature.title} icon={feature.icon} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
      )}

      <ListTextbookModal isOpen={isListTextbookModalOpen} onClose={() => setIsListTextbookModalOpen(false)} onSubmit={handleListTextbook} />
      <ListStudyGroupModal isOpen={isListStudyGroupModalOpen} onClose={() => setIsListStudyGroupModalOpen(false)} onSubmit={handleListStudyGroup} />
      <ListTutorModal isOpen={isListTutorModalOpen} onClose={() => setIsListTutorModalOpen(false)} onSubmit={handleListTutor} />
      <ListLostAndFoundItemModal isOpen={isListLostFoundItemModalOpen} onClose={() => setIsListLostFoundItemModalOpen(false)} onSubmit={handleListLostFoundItem} />
      <ListPeerReviewModal isOpen={isListPeerReviewModalOpen} onClose={() => setIsListPeerReviewModalOpen(false)} onSubmit={handleListPeerReviewService} />
      <ListThesisSupportModal isOpen={isListThesisSupportModalOpen} onClose={() => setIsListThesisSupportModalOpen(false)} onSubmit={handleListThesisSupport} />
      <ListClubProfileModal isOpen={isListClubProfileModalOpen} onClose={() => setIsListClubProfileModalOpen(false)} onSubmit={handleListClubProfile} />
      <ListEventTicketModal isOpen={isListEventTicketModalOpen} onClose={() => setIsListEventTicketModalOpen(false)} onSubmit={handleListEventTicket} />
      <ListMerchandiseItemModal isOpen={isListMerchandiseModalOpen} onClose={() => setIsListMerchandiseModalOpen(false)} onSubmit={handleListMerchandiseItem} />
      <ListFreelanceServiceModal isOpen={isListFreelanceServiceModalOpen} onClose={() => setIsListFreelanceServiceModalOpen(false)} onSubmit={handleListFreelanceService} />
      <ListRentalItemModal isOpen={isListRentalItemModalOpen} onClose={() => setIsListRentalItemModalOpen(false)} onSubmit={handleListRentalItem} />
      <ListRideShareModal isOpen={isListRideShareModalOpen} onClose={() => setIsListRideShareModalOpen(false)} onSubmit={handleListRideShare} />
      <ListBikeScooterModal isOpen={isListBikeScooterModalOpen} onClose={() => setIsListBikeScooterModalOpen(false)} onSubmit={handleListBikeScooter} />
      <ListSubletModal isOpen={isListSubletModalOpen} onClose={() => setIsListSubletModalOpen(false)} onSubmit={handleListSublet} />
      <ListRoommateModal isOpen={isListRoommateModalOpen} onClose={() => setIsListRoommateModalOpen(false)} onSubmit={handleListRoommate} />
      <ListFoodModal isOpen={isListFoodModalOpen} onClose={() => setIsListFoodModalOpen(false)} onSubmit={handleListFood} />
      <ListSecondHandGoodModal isOpen={isListSecondHandGoodModalOpen} onClose={() => setIsListSecondHandGoodModalOpen(false)} onSubmit={handleListSecondHandGood} />
    </>
  );
};

export default MarketplaceScreen;
