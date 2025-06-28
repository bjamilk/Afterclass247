

import React, { useState, useEffect, useCallback } from 'react';
import { User, Group, Message, MessageType, QuestionType, QuestionOption, AppMode, TestConfig, TestQuestion, UserAnswerRecord, TestSessionData, StudySessionData, TestResult, MatchingItem, OfflineSessionBundle, OfflineQuestion, Transaction, TransactionType } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import QuestionModal from './components/QuestionModal';
import CreateGroupModal from './components/CreateGroupModal';
import GroupInfoModal from './components/GroupInfoModal';
import TestConfigModal from './components/TestConfigModal';
import { TestTakingScreen } from './components/TestTakingScreen';
import TestReviewScreen from './components/TestReviewScreen';
import DashboardScreen from './components/DashboardScreen'; 
import OfflineModeScreen from './components/OfflineModeScreen';
import MarketplaceScreen from './components/MarketplaceScreen';
import AuthScreen from './components/AuthScreen';
import WalletModal from './components/WalletModal';
import { v4 as uuidv4 } from 'https://esm.sh/uuid';
import { AcademicCapIcon, ExclamationTriangleIcon, ArrowPathIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';


// --- MOCK DATA ---

// Represents all users who have "registered".
const MOCK_ALL_USERS: User[] = [
  { id: 'user1', name: 'Demo User', email: 'user@example.com', password: 'password123', walletBalance: 25000, avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=random&color=fff&size=100', phoneNumber: '08012345678' },
  { id: 'user2', name: 'Alice Wonderland', email: 'alice@example.com', password: 'password123', walletBalance: 15000, avatarUrl: 'https://ui-avatars.com/api/?name=Alice+Wonderland&background=random&color=fff&size=100', phoneNumber: '08023456789' },
  { id: 'user3', name: 'Bob The Builder', email: 'bob@example.com', password: 'password123', walletBalance: 50000, avatarUrl: 'https://ui-avatars.com/api/?name=Bob+Builder&background=random&color=fff&size=100', phoneNumber: '08034567890' },
];

const MOCK_GROUPS_INITIAL: Group[] = [
  { 
    id: 'group1', 
    name: 'BIO101 Study Group', 
    avatarUrl: 'https://ui-avatars.com/api/?name=BIO101&background=random&color=fff&size=200', 
    members: [MOCK_ALL_USERS[0], MOCK_ALL_USERS[1], MOCK_ALL_USERS[2]],
    memberEmails: ['alice@example.com', 'user@example.com', 'bob@example.com'],
    adminIds: [MOCK_ALL_USERS[0].id],
    description: "Discussion and Q&A for Biology 101.",
    lastMessage: "Let's review mitosis.",
    lastMessageTime: "10:30 AM",
    isArchived: false,
  },
  { 
    id: 'group2', 
    name: 'MCAT Prep Squad', 
    avatarUrl: 'https://ui-avatars.com/api/?name=MCAT+Prep&background=random&color=fff&size=200', 
    members: MOCK_ALL_USERS,
    memberEmails: ['alice@example.com', 'bob@example.com', 'user@example.com'],
    adminIds: [MOCK_ALL_USERS[0].id],
    description: "Preparing for the MCAT exam together.",
    lastMessage: "New practice question posted!",
    lastMessageTime: "Yesterday",
    isArchived: false,
  },
  { 
    id: 'group3', 
    name: 'Physics Club', 
    avatarUrl: 'https://ui-avatars.com/api/?name=Physics+Club&background=random&color=fff&size=200', 
    members: [MOCK_ALL_USERS[0], MOCK_ALL_USERS[2]],
    memberEmails: ['bob@example.com', 'user@example.com'],
    adminIds: [MOCK_ALL_USERS[0].id],
    description: "Exploring the wonders of physics.",
    lastMessage: "Anyone understand quantum entanglement?",
    lastMessageTime: "Mon",
    isArchived: true,
  },
];

const MOCK_MESSAGES_INITIAL: Record<string, Message[]> = {
  group1: [
    { id: 'msg1-1', groupId: 'group1', sender: MOCK_ALL_USERS[1], timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), type: MessageType.TEXT, text: "Hey everyone! Ready for tomorrow's class?", upvotes: 0, downvotes: 0 },
    { id: 'msg1-2', groupId: 'group1', sender: MOCK_ALL_USERS[0], timestamp: new Date(Date.now() - 1000 * 60 * 50), type: MessageType.TEXT, text: "Yep, just reviewing chapter 3.", upvotes: 0, downvotes: 0 },
    { id: 'msg1-3', groupId: 'group1', sender: MOCK_ALL_USERS[1], timestamp: new Date(Date.now() - 1000 * 60 * 30), type: MessageType.QUESTION, questionType: QuestionType.OPEN_ENDED, questionStem: "What are the main phases of mitosis?", explanation: "Prophase, Metaphase, Anaphase, Telophase. Each phase has distinct chromosomal events.", upvotes: 5, downvotes: 1, tags: ["cell biology", "mitosis"] },
    { id: 'msg1-4', groupId: 'group1', sender: MOCK_ALL_USERS[0], timestamp: new Date(Date.now() - 1000 * 60 * 25), type: MessageType.QUESTION, questionType: QuestionType.MULTIPLE_CHOICE_SINGLE, questionStem: "Which organelle is known as the powerhouse of the cell?", options: [{id: 'opt1', text: 'Nucleus'}, {id: 'opt2', text: 'Mitochondria'}, {id: 'opt3', text: 'Ribosome'}], correctAnswerIds: ['opt2'], explanation: "Mitochondria are responsible for generating most of the cell's supply of ATP through cellular respiration.", upvotes: 10, downvotes: 0, imageUrl: 'https://picsum.photos/seed/mito/300/200', tags: ["organelles", "ATP"] },
  ],
  group2: [
    { id: 'msg2-1', groupId: 'group2', sender: MOCK_ALL_USERS[2], timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), type: MessageType.TEXT, text: "Found a great resource for organic chemistry review.", upvotes: 0, downvotes: 0 },
    { id: 'msg2-2', groupId: 'group2', sender: MOCK_ALL_USERS[0], timestamp: new Date(Date.now() - 1000 * 60 * 15), type: MessageType.QUESTION, questionType: QuestionType.MULTIPLE_CHOICE_SINGLE, questionStem: "What is the general formula for an alkane?", options: [{id: 'optA', text: 'CnH2n'}, {id: 'optB', text: 'CnH2n+2'}, {id: 'optC', text: 'CnH2n-2'}], correctAnswerIds: ['optB'], explanation: "Alkanes are saturated hydrocarbons with the general formula CnH2n+2.", upvotes: 7, downvotes: 0, tags: ["organic chemistry", "alkanes"] },
  ],
  group3: [],
};


const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);

  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const savedGroups = localStorage.getItem('studyCollabGroups');
      if (savedGroups) {
        return JSON.parse(savedGroups).map((g: Group) => ({
          ...g,
          adminIds: g.adminIds || [g.members[0]?.id].filter(Boolean), 
          parentId: g.parentId || undefined,
          isArchived: g.isArchived || false,
        }));
      }
    } catch (error) {
      console.error("Failed to load groups from localStorage:", error);
    }
    return MOCK_GROUPS_INITIAL;
  });

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES_INITIAL);
  
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [createGroupModalConfig, setCreateGroupModalConfig] = useState<{ isOpen: boolean; parentId?: string }>({ isOpen: false });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);


  const [isGroupInfoModalOpen, setIsGroupInfoModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const [appMode, setAppMode] = useState<AppMode>(AppMode.CHAT);
  const [isTestConfigModalOpen, setIsTestConfigModal] = useState(false);
  const [configTargetMode, setConfigTargetMode] = useState<AppMode.TEST_CONFIG | AppMode.STUDY_CONFIG | null>(null);
  
  const [currentTestConfig, setCurrentTestConfig] = useState<TestConfig | null>(null);
  const [currentTestSession, setCurrentTestSession] = useState<TestSessionData | null>(null);
  
  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    try {
      const savedResults = localStorage.getItem('studyCollabTestResults');
      if (savedResults) {
        const parsedResults: any[] = JSON.parse(savedResults);
        return parsedResults.map((result: any): TestResult => ({
          ...result,
          session: {
            ...result.session,
            startTime: new Date(result.session.startTime),
            endTime: result.session.endTime ? new Date(result.session.endTime) : undefined,
            questions: result.session.questions.map((q: any) => ({
                ...q,
                timestamp: new Date(q.timestamp),
            })),
            userAnswers: result.session.userAnswers, 
            config: { 
                ...result.session.config,
                selectedTags: result.session.config.selectedTags || [], 
            },
            isOffline: result.session.isOffline || false,
          }
        }));
      }
    } catch (error) {
      console.error("Failed to load test results from localStorage:", error);
    }
    return [];
  });

  const [currentStudyConfig, setCurrentStudyConfig] = useState<TestConfig | null>(null); 
  const [currentStudySession, setCurrentStudySession] = useState<StudySessionData | null>(null);

  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | undefined>>({});

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('studyCollabTransactions');
      return saved ? JSON.parse(saved).map((t: any) => ({...t, timestamp: new Date(t.timestamp)})) : [];
    } catch (e) { console.error("Error loading transactions:", e); return []; }
  });

  const [offlineBundles, setOfflineBundles] = useState<OfflineSessionBundle[]>(() => {
    try {
      const savedBundles = localStorage.getItem('studyCollabOfflineBundles');
      return savedBundles ? JSON.parse(savedBundles).map((b: OfflineSessionBundle) => ({
        ...b,
        downloadedAt: new Date(b.downloadedAt),
        questions: b.questions.map((q: OfflineQuestion) => ({
          ...q,
          timestamp: new Date(q.timestamp),
        }))
      })) : [];
    } catch (e) { console.error("Error loading offline bundles:", e); return []; }
  });

  const [pendingSyncResults, setPendingSyncResults] = useState<TestResult[]>(() => {
    try {
      const savedPending = localStorage.getItem('studyCollabPendingSyncResults');
      if (savedPending) {
         const parsedPending: any[] = JSON.parse(savedPending);
         return parsedPending.map((result: any): TestResult => ({
            ...result,
            session: {
                ...result.session,
                startTime: new Date(result.session.startTime),
                endTime: result.session.endTime ? new Date(result.session.endTime) : undefined,
                questions: result.session.questions.map((q: any) => ({
                    ...q,
                    timestamp: new Date(q.timestamp),
                })),
                config: {
                    ...result.session.config,
                    selectedTags: result.session.config.selectedTags || [],
                },
                isOffline: true, 
            }
         }));
      }
      return [];
    } catch (e) { console.error("Error loading pending sync results:", e); return []; }
  });
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasNewQuestionNotification, setHasNewQuestionNotification] = useState<boolean>(() => {
    try {
      const savedNotificationState = localStorage.getItem('studyCollabNewQuestionNotification');
      return savedNotificationState === 'true';
    } catch (error) {
      console.error("Failed to load notification state from localStorage:", error);
      return false;
    }
  });


  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('studyCollabTheme') as 'light' | 'dark' | null;
    if (storedTheme) {
      return storedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('studyCollabTheme', theme);
    } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem('studyCollabOfflineBundles', JSON.stringify(offlineBundles)); }
    catch (e) { console.error("Error saving offline bundles:", e); }
  }, [offlineBundles]);
  
  useEffect(() => {
    try { localStorage.setItem('studyCollabTransactions', JSON.stringify(transactions)); }
    catch (e) { console.error("Error saving transactions:", e); }
  }, [transactions]);


  useEffect(() => {
    try { localStorage.setItem('studyCollabPendingSyncResults', JSON.stringify(pendingSyncResults)); }
    catch (e) { console.error("Error saving pending sync results:", e); }
  }, [pendingSyncResults]);

  useEffect(() => {
    try {
      localStorage.setItem('studyCollabTestResults', JSON.stringify(testResults));
    } catch (error) {
      console.error("Failed to save test results to localStorage:", error);
    }
  }, [testResults]);
  
  useEffect(() => {
    try {
        localStorage.setItem('studyCollabGroups', JSON.stringify(groups));
    } catch (error) {
        console.error("Failed to save groups to localStorage:", error);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem('studyCollabNewQuestionNotification', String(hasNewQuestionNotification));
    } catch (error) {
      console.error("Failed to save notification state to localStorage:", error);
    }
  }, [hasNewQuestionNotification]);


  useEffect(() => {
    if (currentUser && appMode === AppMode.CHAT && groups.length > 0 && !selectedGroup) {
      const firstTopLevelGroup = groups.find(g => !g.parentId && !g.isArchived);
      if (firstTopLevelGroup) {
        setSelectedGroup(firstTopLevelGroup);
      } else if (groups.length > 0) { 
        setSelectedGroup(groups.find(g => !g.isArchived) || null);
      }
    } else if (appMode === AppMode.CHAT && groups.length === 0) {
      setSelectedGroup(null);
    }
  }, [groups, selectedGroup, appMode, currentUser]);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // When a user logs in, update any stale data that might reference the old currentUser object
    setGroups(prevGroups => prevGroups.map(g => ({
        ...g,
        members: g.members.map(m => m.id === user.id ? user : m)
    })));
    setMessages(prevMsgs => {
        const newMsgs = { ...prevMsgs };
        Object.keys(newMsgs).forEach(groupId => {
          newMsgs[groupId] = newMsgs[groupId].map(msg => 
            msg.sender.id === user.id ? { ...msg, sender: user } : msg
          );
        });
        return newMsgs;
    });
  };

  const handleRegister = (name: string, email: string, password: string, phoneNumber: string) => {
    const newUser: User = {
        id: uuidv4(),
        name,
        email,
        password,
        phoneNumber,
        walletBalance: 0,
        avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random&color=fff&size=100`,
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedGroup(null);
    setAppMode(AppMode.CHAT); // Reset to default view after logout
  };

  const handleFundWallet = (amount: number) => {
    if (!currentUser) return;
    const newBalance = currentUser.walletBalance + amount;
    const updatedUser: User = { ...currentUser, walletBalance: newBalance };
    
    // Update current user state
    setCurrentUser(updatedUser);
    
    // Update user in the main list
    setAllUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));

    // Create a transaction record
    const fundTransaction: Transaction = {
        id: `txn-${uuidv4()}`,
        userId: currentUser.id,
        type: TransactionType.FUND,
        amount: amount,
        description: "Funded wallet",
        timestamp: new Date(),
    };
    setTransactions(prev => [fundTransaction, ...prev]);

    alert(`Successfully added ₦${amount.toLocaleString()} to your wallet. Your new balance is ₦${newBalance.toLocaleString()}.`);
  };

  const handlePurchaseWithWallet = (
    item: { id: string; price: number; sellerId: string; title?: string; itemName?: string },
    itemType: string
  ) => {
      if (!currentUser) return;

      const buyer = currentUser;
      const seller = allUsers.find(u => u.id === item.sellerId);

      if (!seller) {
          alert("Error: Seller not found.");
          return;
      }
      if (buyer.walletBalance < item.price) {
          alert("Insufficient funds.");
          return;
      }
      
      const itemName = item.title || item.itemName || 'Unknown Item';
      if (!window.confirm(`Confirm purchase of "${itemName}" for ₦${item.price.toLocaleString()}? This will be deducted from your wallet.`)) {
          return;
      }

      // 1. Update balances
      const updatedBuyer = { ...buyer, walletBalance: buyer.walletBalance - item.price };
      const updatedSeller = { ...seller, walletBalance: seller.walletBalance + item.price };
      
      setCurrentUser(updatedBuyer);
      setAllUsers(prev => prev.map(u => {
          if (u.id === buyer.id) return updatedBuyer;
          if (u.id === seller.id) return updatedSeller;
          return u;
      }));

      // 2. Create transactions
      const purchaseTx: Transaction = {
          id: `txn-${uuidv4()}`,
          userId: buyer.id,
          type: TransactionType.PURCHASE,
          amount: item.price,
          description: `Purchase: ${itemName}`,
          timestamp: new Date(),
          counterpartyId: seller.id,
          counterpartyName: seller.name,
      };
      const saleTx: Transaction = {
          id: `txn-${uuidv4()}`,
          userId: seller.id,
          type: TransactionType.SALE,
          amount: item.price,
          description: `Sale: ${itemName}`,
          timestamp: new Date(),
          counterpartyId: buyer.id,
          counterpartyName: buyer.name,
      };
      setTransactions(prev => [purchaseTx, saleTx, ...prev]);

      // 3. Update the item as sold in the MarketplaceScreen state
      // This part is tricky as App.tsx doesn't own Marketplace state.
      // So, MarketplaceScreen needs to handle this update.
      // App.tsx can just return 'success' or the updated item.
      // For this implementation, we will pass a generic handler that MarketplaceScreen implements.
      alert(`Purchase successful! ₦${item.price.toLocaleString()} has been paid to ${seller.name}.`);
      return { success: true, itemId: item.id, itemType };
  };


  const handleUpdateCurrentUserAvatar = useCallback((avatarUrl: string) => {
    if (!currentUser) return;
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, avatarUrl };
      setAllUsers(prevAll => prevAll.map(u => u.id === updatedUser.id ? updatedUser : u));
      setMessages(prevMsgs => {
        const newMsgs = { ...prevMsgs };
        Object.keys(newMsgs).forEach(groupId => {
          newMsgs[groupId] = newMsgs[groupId].map(msg => 
            msg.sender.id === updatedUser.id ? { ...msg, sender: updatedUser } : msg
          );
        });
        return newMsgs;
      });
      setGroups(prevGroups => prevGroups.map(g => ({
        ...g,
        members: g.members.map(m => m.id === updatedUser.id ? updatedUser : m)
      })));
      setTestResults(prevResults => prevResults.map(result => ({
        ...result,
        session: {
          ...result.session,
          questions: result.session.questions.map(q => 
            q.sender.id === updatedUser.id ? { ...q, sender: updatedUser } : q
          )
        }
      })));
      return updatedUser;
    });
  }, [currentUser]);

  const handleSelectGroup = useCallback((group: Group) => {
    setSelectedGroup(group);
    setAppMode(AppMode.CHAT); 
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    if (!selectedGroup || !currentUser) return;

    let groupToUpdate = { ...selectedGroup };
    let groupsToUpdate = [...groups];

    if (!groupToUpdate.members.find(member => member.id === currentUser.id)) {
      groupToUpdate.members = [...groupToUpdate.members, currentUser];
      const groupIndex = groupsToUpdate.findIndex(g => g.id === groupToUpdate.id);
      if (groupIndex !== -1) {
        groupsToUpdate[groupIndex] = groupToUpdate;
        setGroups(groupsToUpdate);
        if (selectedGroup?.id === groupToUpdate.id) {
          setSelectedGroup(groupToUpdate);
        }
      }
    }

    const newMessage: Message = {
      id: `msg-${uuidv4()}`, groupId: groupToUpdate.id, sender: currentUser,
      timestamp: new Date(), type: MessageType.TEXT, text,
      upvotes: 0, downvotes: 0,
    };
    setMessages(prev => ({ ...prev, [groupToUpdate.id]: [...(prev[groupToUpdate.id] || []), newMessage] }));
  }, [selectedGroup, currentUser, groups]);


  const handleSubmitQuestion = useCallback((
    questionStem: string, 
    explanation: string, 
    questionType: QuestionType, 
    options?: QuestionOption[], 
    correctAnswerIds?: string[], 
    imageUrl?: string,
    tags?: string[],
    acceptableAnswers?: string[], 
    matchingPromptItems?: MatchingItem[], 
    matchingAnswerItems?: MatchingItem[], 
    correctMatches?: { promptItemId: string; answerItemId: string }[] 
  ) => {
    if (!selectedGroup || !currentUser) return;
     let groupToUpdate = { ...selectedGroup };
     let groupsToUpdate = [...groups];
     if (!groupToUpdate.members.find(member => member.id === currentUser.id)) {
      groupToUpdate.members = [...groupToUpdate.members, currentUser];
      const groupIndex = groupsToUpdate.findIndex(g => g.id === groupToUpdate.id);
      if (groupIndex !== -1) {
        groupsToUpdate[groupIndex] = groupToUpdate;
        setGroups(groupsToUpdate);
         if (selectedGroup?.id === groupToUpdate.id) {
          setSelectedGroup(groupToUpdate);
        }
      }
    }

    const newQuestionMessage: Message = {
      id: `q-${uuidv4()}`, 
      groupId: groupToUpdate.id, 
      sender: currentUser, 
      timestamp: new Date(),
      type: MessageType.QUESTION, 
      questionStem, 
      explanation, 
      questionType, 
      options, 
      correctAnswerIds, 
      imageUrl,
      tags,
      upvotes: 0, 
      downvotes: 0,
      acceptableAnswers,
      matchingPromptItems,
      matchingAnswerItems,
      correctMatches,
    };
    setMessages(prev => ({ ...prev, [groupToUpdate.id]: [...(prev[groupToUpdate.id] || []), newQuestionMessage] }));
    setIsQuestionModalOpen(false);
    if (newQuestionMessage.sender.id !== currentUser.id) {
        setHasNewQuestionNotification(true);
    }
  }, [selectedGroup, currentUser, groups]);

  const handleClearNewQuestionNotification = useCallback(() => {
    setHasNewQuestionNotification(false);
  }, []);

  const handleOpenCreateGroupModal = useCallback((parentId?: string) => {
    setCreateGroupModalConfig({ isOpen: true, parentId });
  }, []);

  const handleCreateGroup = useCallback((name: string, description: string, memberEmailsStr: string, parentId?: string) => {
    if(!currentUser) return;
    const newMemberEmails = memberEmailsStr.split(',').map(email => email.trim()).filter(email => email);
    const newGroup: Group = {
      id: `group-${uuidv4()}`, name, description, members: [currentUser],
      memberEmails: Array.from(new Set([currentUser.email || '', ...newMemberEmails].filter(Boolean))),
      adminIds: [currentUser.id], 
      avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(/\s/g, '+')}&background=random&color=fff&size=200`,
      lastMessage: "Group created!",
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parentId: parentId || undefined,
      isArchived: false,
    };
    setGroups(prev => [newGroup, ...prev]);
    setMessages(prev => ({...prev, [newGroup.id]: [] }));
    setSelectedGroup(newGroup);
    setCreateGroupModalConfig({ isOpen: false });
    setAppMode(AppMode.CHAT);
  }, [currentUser]);
  
  const handleOpenGroupInfoModal = useCallback((group: Group) => {
    setEditingGroup(group);
    setIsGroupInfoModalOpen(true);
  }, []);

  const handleUpdateGroupDetails = useCallback((groupId: string, name: string, description: string) => {
    setGroups(prev => prev.map(g => g.id === groupId ? {...g, name, description} : g));
    if (selectedGroup?.id === groupId) setSelectedGroup(prev => prev ? {...prev, name, description} : null);
    if (editingGroup?.id === groupId) setEditingGroup(prev => prev ? {...prev, name, description} : null);
  }, [selectedGroup, editingGroup]);
  
  const handleUpdateGroupAvatar = useCallback((groupId: string, avatarUrl: string) => {
    setGroups(prevGroups => prevGroups.map(g => {
      if (g.id === groupId) {
        return { ...g, avatarUrl };
      }
      return g;
    }));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? { ...prev, avatarUrl } : null);
    }
    if (editingGroup?.id === groupId) {
      setEditingGroup(prev => prev ? { ...prev, avatarUrl } : null);
    }
  }, [selectedGroup?.id, editingGroup?.id]);


  const handleAddMembersToGroup = useCallback((groupId: string, newEmailsStr: string) => {
    const newEmails = newEmailsStr.split(',').map(email => email.trim()).filter(email => email);
    if (newEmails.length === 0) return;
    
    const newMemberUsers: User[] = [];
    newEmails.forEach(email => {
        const existingUser = allUsers.find(u => u.email === email); 
        if (existingUser) {
            newMemberUsers.push(existingUser);
        }
    });

    setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
            const updatedMemberEmails = Array.from(new Set([...(g.memberEmails || []), ...newEmails]));
            const updatedMembers = [...g.members];
            newMemberUsers.forEach(newUser => {
                if (!updatedMembers.find(m => m.id === newUser.id)) {
                    updatedMembers.push(newUser);
                }
            });
            return {...g, memberEmails: updatedMemberEmails, members: updatedMembers};
        }
        return g;
    }));

    if (selectedGroup?.id === groupId) {
        setSelectedGroup(prev => {
            if (!prev) return null;
            const updatedMemberEmails = Array.from(new Set([...(prev.memberEmails || []), ...newEmails]));
             const updatedMembers = [...prev.members];
            newMemberUsers.forEach(newUser => {
                if (!updatedMembers.find(m => m.id === newUser.id)) {
                    updatedMembers.push(newUser);
                }
            });
            return {...prev, memberEmails: updatedMemberEmails, members: updatedMembers};
        });
    }
    if (editingGroup?.id === groupId) {
        setEditingGroup(prev => {
            if (!prev) return null;
            const updatedMemberEmails = Array.from(new Set([...(prev.memberEmails || []), ...newEmails]));
            const updatedMembers = [...prev.members];
            newMemberUsers.forEach(newUser => {
                if (!updatedMembers.find(m => m.id === newUser.id)) {
                    updatedMembers.push(newUser);
                }
            });
            return {...prev, memberEmails: updatedMemberEmails, members: updatedMembers};
        });
    }
  }, [selectedGroup, editingGroup, allUsers]);

    const handlePromoteToAdmin = useCallback((groupId: string, userId: string) => {
        setGroups(prevGroups => {
            const newGroups = prevGroups.map(g => {
                if (g.id === groupId && !g.adminIds.includes(userId)) {
                    return { ...g, adminIds: [...g.adminIds, userId] };
                }
                return g;
            });
            const updatedGroup = newGroups.find(g => g.id === groupId);
            if (updatedGroup) {
                if (selectedGroup?.id === groupId) setSelectedGroup(updatedGroup);
                if (editingGroup?.id === groupId) setEditingGroup(updatedGroup);
            }
            return newGroups;
        });
    }, [selectedGroup?.id, editingGroup?.id]);

    const handleDemoteAdmin = useCallback((groupId: string, userId: string) => {
        setGroups(prevGroups => {
            const newGroups = prevGroups.map(g => {
                if (g.id === groupId && g.adminIds.includes(userId) && g.adminIds.length > 1) {
                    return { ...g, adminIds: g.adminIds.filter(id => id !== userId) };
                }
                return g;
            });
            const updatedGroup = newGroups.find(g => g.id === groupId);
            if (updatedGroup) {
                if (selectedGroup?.id === groupId) setSelectedGroup(updatedGroup);
                if (editingGroup?.id === groupId) setEditingGroup(updatedGroup);
            }
            return newGroups;
        });
    }, [selectedGroup?.id, editingGroup?.id]);
    
    const handleDeleteGroup = useCallback((groupId: string) => {
        setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
        setMessages(prevMessages => {
            const newMessages = { ...prevMessages };
            delete newMessages[groupId];
            return newMessages;
        });
        if (selectedGroup?.id === groupId) {
            const availableGroups = groups.filter(g => g.id !== groupId && !g.parentId && !g.isArchived);
            setSelectedGroup(availableGroups.length > 0 ? availableGroups[0] : null);
        }
    }, [selectedGroup?.id, groups]);

    const handleToggleArchiveGroup = useCallback((groupId: string) => {
        setGroups(prevGroups => {
            let wasArchived = false;
            const newGroups = prevGroups.map(g => {
                if (g.id === groupId) {
                    wasArchived = g.isArchived || false;
                    return { ...g, isArchived: !g.isArchived };
                }
                return g;
            });

            const updatedGroup = newGroups.find(g => g.id === groupId)!;

            setEditingGroup(currentEditingGroup => {
                if (currentEditingGroup?.id === groupId) {
                    return updatedGroup;
                }
                return currentEditingGroup;
            });
            
            setSelectedGroup(currentSelectedGroup => {
                if (currentSelectedGroup?.id === groupId) {
                    if (!wasArchived) { // it was active, now archived
                        return null;
                    } else { // it was archived, now active
                        return updatedGroup;
                    }
                }
                return currentSelectedGroup;
            });

            return newGroups;
        });
    }, []);

  const handleVoteQuestion = useCallback((messageId: string, voteType: 'up' | 'down') => {
    if (!selectedGroup) return;

    setMessages(prevMessages => {
      const groupMessages = prevMessages[selectedGroup.id] || [];
      const messageIndex = groupMessages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1 || groupMessages[messageIndex].type !== MessageType.QUESTION) {
        return prevMessages;
      }

      const updatedMessages = [...groupMessages];
      const messageToUpdate = { ...updatedMessages[messageIndex] };
      
      const currentUserPreviousVote = userVotes[messageId];
      let newUpvotes = messageToUpdate.upvotes;
      let newDownvotes = messageToUpdate.downvotes;
      let newUserVoteStatus: 'up' | 'down' | undefined = undefined;

      if (currentUserPreviousVote === voteType) { 
        if (voteType === 'up') newUpvotes--;
        else newDownvotes--;
        newUserVoteStatus = undefined;
      } else {
        if (currentUserPreviousVote === 'up') newUpvotes--; 
        if (currentUserPreviousVote === 'down') newDownvotes--; 
        
        if (voteType === 'up') newUpvotes++;
        else newDownvotes++;
        newUserVoteStatus = voteType;
      }
      
      messageToUpdate.upvotes = Math.max(0, newUpvotes); 
      messageToUpdate.downvotes = Math.max(0, newDownvotes); 
      updatedMessages[messageIndex] = messageToUpdate;

      setUserVotes(prevUserVotes => ({
        ...prevUserVotes,
        [messageId]: newUserVoteStatus,
      }));
      
      return { ...prevMessages, [selectedGroup.id]: updatedMessages };
    });
  }, [selectedGroup, userVotes]);


  const handleOpenTestConfigModal = useCallback(() => {
    if (!selectedGroup) return; 
    setConfigTargetMode(AppMode.TEST_CONFIG);
    setIsTestConfigModal(true);
  }, [selectedGroup]);

  const handleOpenStudyConfigModal = useCallback(() => {
    if (!selectedGroup) return; 
    setConfigTargetMode(AppMode.STUDY_CONFIG);
    setIsTestConfigModal(true);
  }, [selectedGroup]);

  const handleStartSession = useCallback((config: Omit<TestConfig, 'questionIds' | 'groupId'>, mode: 'test' | 'study') => {
    if (!selectedGroup) return;
    
    const sessionConfig: TestConfig = {
      ...config,
      groupId: selectedGroup.id, 
      questionIds: [], 
    };

    const groupMessages = messages[selectedGroup.id] || [];
    const availableQuestions = groupMessages.filter(msg => {
      const isTestableQuestionType = sessionConfig.allowedQuestionTypes.includes(msg.questionType!);
      const hasRequiredFields = msg.questionStem && 
                                (
                                  ( [QuestionType.MULTIPLE_CHOICE_SINGLE, QuestionType.TRUE_FALSE].includes(msg.questionType!) &&
                                    msg.options && msg.options.length > 0 && 
                                    msg.correctAnswerIds && msg.correctAnswerIds.length > 0 
                                  ) ||
                                  false 
                                );
      const isUpvoted = (msg.upvotes || 0) > (msg.downvotes || 0);
      
      let matchesTags = true;
      if (sessionConfig.selectedTags && sessionConfig.selectedTags.length > 0) {
        matchesTags = msg.tags ? sessionConfig.selectedTags.some(tag => msg.tags!.includes(tag)) : false;
      }

      return msg.type === MessageType.QUESTION && 
             isTestableQuestionType && 
             hasRequiredFields &&
             isUpvoted &&
             matchesTags;
    });
    
    const shuffledQuestions = shuffleArray(availableQuestions);
    const selectedQuestionsRaw = shuffledQuestions.slice(0, sessionConfig.numberOfQuestions);

    sessionConfig.questionIds = selectedQuestionsRaw.map(q => q.id);

    const testQuestions: TestQuestion[] = selectedQuestionsRaw.map((q, index) => ({
        ...q,
        questionNumber: index + 1,
    }));

    const initialAnswers: Record<string, UserAnswerRecord> = {};
    testQuestions.forEach(q => {
        initialAnswers[q.id] = { questionId: q.id, isBookmarked: false }; 
    });

    let endTime: Date | undefined = undefined;
    if (mode === 'test' && sessionConfig.timerDuration && sessionConfig.timerDuration > 0) {
        endTime = new Date(Date.now() + sessionConfig.timerDuration * 1000);
    }

    const sessionData: TestSessionData | StudySessionData = {
        config: sessionConfig,
        questions: testQuestions,
        userAnswers: initialAnswers,
        currentQuestionIndex: 0,
        startTime: new Date(),
        endTime: endTime,
        isOffline: false, 
    };

    if (mode === 'test') {
        setCurrentTestConfig(sessionConfig);
        setCurrentTestSession(sessionData as TestSessionData);
        setAppMode(AppMode.TEST_ACTIVE);
    } else { 
        setCurrentStudyConfig(sessionConfig); 
        setCurrentStudySession({ ...sessionData, endTime: undefined } as StudySessionData); 
        setAppMode(AppMode.STUDY_ACTIVE);
    }
    setIsTestConfigModal(false);
    setConfigTargetMode(null);
  }, [selectedGroup, messages]);

  const handleUpdateAnswer = useCallback((questionId: string, selectedOptionId: string, timeSpentSeconds?: number) => {
    const sessionUpdater = (prevSession: TestSessionData | StudySessionData | null): TestSessionData | StudySessionData | null => {
        if (!prevSession) return null;
        const question = prevSession.questions.find(q => q.id === questionId);
        if (!question || !question.correctAnswerIds) return prevSession;

        const isCorrect = question.correctAnswerIds.includes(selectedOptionId);
        
        return {
            ...prevSession,
            userAnswers: {
                ...prevSession.userAnswers,
                [questionId]: {
                    ...(prevSession.userAnswers[questionId] || { questionId, isBookmarked: false }), 
                    selectedOptionId, 
                    isCorrect, 
                    timeSpentSeconds, 
                },
            },
        };
    };
    if (appMode === AppMode.TEST_ACTIVE || (currentTestSession && currentTestSession.isOffline)) {
        setCurrentTestSession(prev => sessionUpdater(prev) as TestSessionData | null);
    } else if (appMode === AppMode.STUDY_ACTIVE || (currentStudySession && currentStudySession.isOffline)) {
        setCurrentStudySession(prev => sessionUpdater(prev) as StudySessionData | null);
    }
  }, [appMode, currentTestSession, currentStudySession]);
  
  const handleChangeQuestion = useCallback((newIndex: number) => {
    const sessionUpdater = (prevSession: TestSessionData | StudySessionData | null): TestSessionData | StudySessionData | null => {
        if (!prevSession || newIndex < 0 || newIndex >= prevSession.questions.length) return prevSession;
        return { ...prevSession, currentQuestionIndex: newIndex };
    };
    if (appMode === AppMode.TEST_ACTIVE || (currentTestSession && currentTestSession.isOffline)) {
        setCurrentTestSession(prev => sessionUpdater(prev) as TestSessionData | null);
    } else if (appMode === AppMode.STUDY_ACTIVE || (currentStudySession && currentStudySession.isOffline)) {
        setCurrentStudySession(prev => sessionUpdater(prev) as StudySessionData | null);
    }
  }, [appMode, currentTestSession, currentStudySession]);

  const handleToggleBookmark = useCallback((questionId: string) => {
    const sessionUpdater = (prevSession: TestSessionData | StudySessionData | null): TestSessionData | StudySessionData | null => {
        if (!prevSession) return null;
        const currentAnswerRecord = prevSession.userAnswers[questionId] || { questionId, isBookmarked: false };
        return {
            ...prevSession,
            userAnswers: {
                ...prevSession.userAnswers,
                [questionId]: {
                    ...currentAnswerRecord,
                    isBookmarked: !currentAnswerRecord.isBookmarked,
                },
            },
        };
    };
     if (appMode === AppMode.TEST_ACTIVE || (currentTestSession && currentTestSession.isOffline)) {
        setCurrentTestSession(prev => sessionUpdater(prev) as TestSessionData | null);
    } else if (appMode === AppMode.STUDY_ACTIVE || (currentStudySession && currentStudySession.isOffline)) {
        setCurrentStudySession(prev => sessionUpdater(prev) as StudySessionData | null);
    }
  }, [appMode, currentTestSession, currentStudySession]);


  const handleSubmitTest = useCallback(() => {
    if (!currentTestSession || currentTestSession.isOffline) return; 
    let correctAnswersCount = 0;
    Object.values(currentTestSession.userAnswers).forEach(answer => {
        if (answer.isCorrect) {
            correctAnswersCount++;
        }
    });
    const totalQuestions = currentTestSession.questions.length;
    const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;

    const newTestResult: TestResult = {
        session: { ...currentTestSession, endTime: new Date() },
        score,
        totalQuestions,
        correctAnswersCount,
    };
    setTestResults(prevResults => [...prevResults, newTestResult]); 
    setAppMode(AppMode.TEST_REVIEW);
    setCurrentTestSession(null); 
    setCurrentTestConfig(null);
  }, [currentTestSession]);

  const handleEndStudySession = useCallback(() => {
    setAppMode(AppMode.CHAT); 
    setCurrentStudySession(null);
    setCurrentStudyConfig(null);
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
    setAppMode(AppMode.DASHBOARD);
    setSelectedGroup(null); 
  }, []);

  const handleNavigateToMarketplace = useCallback(() => {
    setAppMode(AppMode.MARKETPLACE);
    setSelectedGroup(null);
  }, []);
  
  const handleNavigateToChat = useCallback(() => {
     setAppMode(AppMode.CHAT);
     if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);
  
  const handleNavigateToOfflineMode = useCallback(() => {
    setAppMode(AppMode.OFFLINE_MODE);
    setSelectedGroup(null);
  }, []);


  const handleExitTestReview = useCallback(() => {
    const lastReviewedResult = testResults[testResults.length - 1]; 
    if (lastReviewedResult && lastReviewedResult.session.isOffline) {
        setAppMode(AppMode.OFFLINE_MODE); 
    } else if (lastReviewedResult) {
        const groupOfLastTest = groups.find(g => g.id === lastReviewedResult.session.config.groupId);
        setSelectedGroup(groupOfLastTest || (groups.length > 0 ? groups[0] : null));
        setAppMode(AppMode.CHAT);
    } else {
        setSelectedGroup(groups.length > 0 ? groups[0] : null);
        setAppMode(AppMode.CHAT);
    }
  }, [testResults, groups]);

  const convertImageToBas64 = async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error converting image ${imageUrl} to Base64:`, error);
      return null; 
    }
  };
  
  const handleDownloadQuestionsForOffline = useCallback(async (config: Omit<TestConfig, 'questionIds' | 'groupId'>) => {
    if (!selectedGroup) {
      alert("No group selected.");
      return;
    }
    setIsDownloading(true);
    try {
        const fullConfig: TestConfig = { ...config, groupId: selectedGroup.id, questionIds: [] };
        const groupMessages = messages[selectedGroup.id] || [];
        const availableQuestions = groupMessages.filter(msg => {
            const isTestableQuestionType = fullConfig.allowedQuestionTypes.includes(msg.questionType!);
            const hasRequiredFields = msg.questionStem && msg.options && msg.options.length > 0 && msg.correctAnswerIds && msg.correctAnswerIds.length > 0;
            const isUpvoted = (msg.upvotes || 0) > (msg.downvotes || 0);
            let matchesTags = true;
            if (fullConfig.selectedTags && fullConfig.selectedTags.length > 0) {
                matchesTags = msg.tags ? fullConfig.selectedTags.some(tag => msg.tags!.includes(tag)) : false;
            }
            return msg.type === MessageType.QUESTION && isTestableQuestionType && hasRequiredFields && isUpvoted && matchesTags;
        });

        const shuffledQuestions = shuffleArray(availableQuestions);
        const selectedRawQuestions = shuffledQuestions.slice(0, fullConfig.numberOfQuestions);
        fullConfig.questionIds = selectedRawQuestions.map(q => q.id);

        const offlineQuestionsPromises: Promise<OfflineQuestion>[] = selectedRawQuestions.map(async (q) => {
            let offlineImageUrl: string | undefined | null = q.imageUrl;
            if (q.imageUrl && !q.imageUrl.startsWith('data:image')) { 
                offlineImageUrl = await convertImageToBas64(q.imageUrl);
                if (!offlineImageUrl) {
                    console.warn(`Failed to download image for question ID ${q.id}. Image will not be available offline.`);
                }
            }
            return { ...q, imageUrl: offlineImageUrl || undefined }; 
        });
        
        const resolvedOfflineQuestions = await Promise.all(offlineQuestionsPromises);

        const newBundle: OfflineSessionBundle = {
            bundleId: `offline-${uuidv4()}`,
            config: fullConfig,
            questions: resolvedOfflineQuestions,
            downloadedAt: new Date(),
            groupName: selectedGroup.name,
        };
        setOfflineBundles(prev => [...prev, newBundle]);
        alert(`Successfully downloaded ${resolvedOfflineQuestions.length} questions for offline use from group "${selectedGroup.name}".`);
    } catch (error) {
        console.error("Error downloading questions for offline:", error);
        alert("Failed to download questions. Please try again.");
    } finally {
        setIsDownloading(false);
        setIsTestConfigModal(false);
        setConfigTargetMode(null);
    }
  }, [selectedGroup, messages]);

  const handleStartOfflineSession = useCallback((bundleId: string, mode: 'test' | 'study') => {
    const bundle = offlineBundles.find(b => b.bundleId === bundleId);
    if (!bundle) {
      alert("Offline bundle not found.");
      return;
    }

    const testQuestions: TestQuestion[] = bundle.questions.map((q, index) => ({
        ...(q as Message), 
        questionNumber: index + 1,
    }));

    const initialAnswers: Record<string, UserAnswerRecord> = {};
    testQuestions.forEach(q => {
        initialAnswers[q.id] = { questionId: q.id, isBookmarked: false };
    });

    let endTime: Date | undefined = undefined;
    if (mode === 'test' && bundle.config.timerDuration && bundle.config.timerDuration > 0) {
        endTime = new Date(Date.now() + bundle.config.timerDuration * 1000);
    }
    
    const sessionData: TestSessionData | StudySessionData = {
        config: bundle.config,
        questions: testQuestions,
        userAnswers: initialAnswers,
        currentQuestionIndex: 0,
        startTime: new Date(),
        endTime: endTime,
        isOffline: true, 
    };

    if (mode === 'test') {
        setCurrentTestConfig(bundle.config);
        setCurrentTestSession(sessionData as TestSessionData);
        setAppMode(AppMode.TEST_ACTIVE);
    } else {
        setCurrentStudyConfig(bundle.config);
        setCurrentStudySession({ ...sessionData, endTime: undefined } as StudySessionData);
        setAppMode(AppMode.STUDY_ACTIVE);
    }
  }, [offlineBundles]);

  const handleSubmitOfflineTest = useCallback(() => {
    if (!currentTestSession || !currentTestSession.isOffline) return;
    
    let correctAnswersCount = 0;
    Object.values(currentTestSession.userAnswers).forEach(answer => {
        if (answer.isCorrect) correctAnswersCount++;
    });
    const totalQuestions = currentTestSession.questions.length;
    const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;

    const offlineResult: TestResult = {
        session: { ...currentTestSession, endTime: new Date() }, 
        score,
        totalQuestions,
        correctAnswersCount,
    };
    setPendingSyncResults(prev => [...prev, offlineResult]);
    alert(`Offline test submitted and graded locally! Your score: ${score.toFixed(1)}%. Results will be synced when you're online.`);
    
    setTestResults(prev => [...prev, offlineResult]); 
    setAppMode(AppMode.TEST_REVIEW);
    setCurrentTestSession(null);
    setCurrentTestConfig(null);
  }, [currentTestSession]);

  const handleSyncOfflineResults = useCallback(() => {
    if (!isOnline) {
      alert("You are offline. Please connect to the internet to sync results.");
      return;
    }
    if (pendingSyncResults.length === 0) {
      alert("No pending results to sync.");
      return;
    }
    
    const uniquePendingResults = pendingSyncResults.filter(pr => 
        !testResults.some(tr => tr.session.startTime.getTime() === pr.session.startTime.getTime() && tr.session.isOffline)
    );

    setTestResults(prev => [...prev.filter(tr => !tr.session.isOffline), ...pendingSyncResults]); 
    
    setPendingSyncResults([]); 
    alert(`Successfully synced ${pendingSyncResults.length} offline test result(s).`);
  }, [isOnline, pendingSyncResults, testResults]);
  
  const handleDeleteOfflineBundle = useCallback((bundleId: string) => {
    if (confirm("Are you sure you want to delete this downloaded test bundle? This action cannot be undone.")) {
        setOfflineBundles(prev => prev.filter(b => b.bundleId !== bundleId));
    }
  }, []);

  const currentGroupMessages = selectedGroup ? messages[selectedGroup.id] || [] : [];
  
  const SessionLoadingErrorPlaceholder: React.FC<{message: string, iconType?: 'loading' | 'error' | 'info'}> = ({ message, iconType = 'loading' }) => (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 dark:bg-slate-800 p-4 text-center">
      {iconType === 'loading' && <ArrowPathIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4 animate-spin" />}
      {iconType === 'error' && <ExclamationTriangleIcon className="w-12 h-12 text-red-400 dark:text-red-500 mb-4" />}
      {iconType === 'info' && <AcademicCapIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />}
      <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">{message}</p>
    </div>
  );

  const renderMainContent = () => {
    if (!currentUser) return null; // Should not happen if Auth layer works
    if (isDownloading) {
        return <SessionLoadingErrorPlaceholder message="Downloading questions for offline use..." iconType="loading"/>;
    }
    switch (appMode) {
      case AppMode.CHAT:
        if (selectedGroup) {
          return (
            <ChatWindow
              group={selectedGroup}
              messages={currentGroupMessages}
              currentUser={currentUser}
              userVotes={userVotes}
              onSendMessage={handleSendMessage}
              onOpenQuestionModal={() => setIsQuestionModalOpen(true)}
              onOpenGroupInfoModal={handleOpenGroupInfoModal}
              onOpenTestConfigModal={handleOpenTestConfigModal}
              onOpenStudyConfigModal={handleOpenStudyConfigModal}
              onVoteQuestion={handleVoteQuestion}
              onOpenCreateSubGroupModal={() => handleOpenCreateGroupModal(selectedGroup.id)}
              groups={groups} 
              onToggleArchiveGroup={handleToggleArchiveGroup}
            />
          );
        } else {
          return (
             <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-800 p-4 text-center">
                <AcademicCapIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">
                  {groups.length > 0 ? 'Select a group or create a new one.' : 'No groups yet. Create one to get started!'}
                </p>
                {groups.length === 0 && (
                    <button 
                        onClick={() => handleOpenCreateGroupModal()}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium"
                    >
                        Create Your First Group
                    </button>
                )}
            </div>
          );
        }
      case AppMode.TEST_CONFIG:
      case AppMode.STUDY_CONFIG:
         return <SessionLoadingErrorPlaceholder message={`Configuring ${appMode === AppMode.TEST_CONFIG ? 'Test' : 'Study Session'}...`} />;
      case AppMode.TEST_ACTIVE:
        if (currentTestSession) {
          return <TestTakingScreen 
                    mode="test" 
                    session={currentTestSession} 
                    onUpdateAnswer={handleUpdateAnswer} 
                    onChangeQuestion={handleChangeQuestion} 
                    onSubmitTest={handleSubmitTest} 
                    onSubmitOfflineTest={handleSubmitOfflineTest}
                    onToggleBookmark={handleToggleBookmark} 
                 />;
        }
        return <SessionLoadingErrorPlaceholder message="Loading Test..." iconType="loading"/>;
      case AppMode.STUDY_ACTIVE:
        if (currentStudySession) {
          return <TestTakingScreen 
                    mode="study" 
                    session={currentStudySession} 
                    onUpdateAnswer={handleUpdateAnswer} 
                    onChangeQuestion={handleChangeQuestion} 
                    onEndSession={handleEndStudySession} 
                    onToggleBookmark={handleToggleBookmark} 
                 />;
        }
        return <SessionLoadingErrorPlaceholder message="Loading Study Session..." iconType="loading"/>;
      case AppMode.TEST_REVIEW:
        const resultToReview = testResults[testResults.length - 1];

        if (resultToReview) { 
            return <TestReviewScreen results={resultToReview} onExit={handleExitTestReview} onNavigateToDashboard={handleNavigateToDashboard}/>;
        }
        return <SessionLoadingErrorPlaceholder message="Loading Test Review..." iconType="error"/>;
      case AppMode.DASHBOARD:
        return <DashboardScreen testResults={testResults} groups={groups} onNavigateToChat={handleNavigateToChat} theme={theme} />;
      case AppMode.OFFLINE_MODE:
        return <OfflineModeScreen 
                    offlineBundles={offlineBundles} 
                    pendingSyncResultsCount={pendingSyncResults.length}
                    onStartOfflineSession={handleStartOfflineSession}
                    onDeleteBundle={handleDeleteOfflineBundle}
                    onSyncPendingResults={handleSyncOfflineResults}
                    isOnline={isOnline}
                />;
      case AppMode.MARKETPLACE:
        return <MarketplaceScreen currentUser={currentUser} onPurchase={handlePurchaseWithWallet}/>;
      default:
        return <SessionLoadingErrorPlaceholder message="Error: Unknown application state." iconType="error" />;
    }
  };


  return (
    <>
      {!currentUser ? (
        <AuthScreen 
            users={allUsers}
            onLogin={handleLogin}
            onRegister={handleRegister}
        />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            currentUser={currentUser}
            groups={groups}
            selectedGroup={selectedGroup}
            onSelectGroup={handleSelectGroup}
            onOpenCreateGroupModal={() => handleOpenCreateGroupModal()} 
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToOfflineMode={handleNavigateToOfflineMode} 
            onNavigateToMarketplace={handleNavigateToMarketplace}
            pendingSyncCount={pendingSyncResults.length} 
            isOnline={isOnline} 
            onSyncOfflineResults={handleSyncOfflineResults} 
            onUpdateCurrentUserAvatar={handleUpdateCurrentUserAvatar}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
            currentAppMode={appMode}
            theme={theme}
            toggleTheme={toggleTheme}
            hasNewQuestionNotification={hasNewQuestionNotification}
            onClearNewQuestionNotification={handleClearNewQuestionNotification}
            onLogout={handleLogout}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderMainContent()}
          </div>

          {isQuestionModalOpen && selectedGroup && (
            <QuestionModal
              isOpen={isQuestionModalOpen}
              onClose={() => setIsQuestionModalOpen(false)}
              onSubmit={handleSubmitQuestion}
              groupName={selectedGroup.name}
            />
          )}
          {createGroupModalConfig.isOpen && (
            <CreateGroupModal
              isOpen={createGroupModalConfig.isOpen}
              onClose={() => setCreateGroupModalConfig({ isOpen: false })}
              onSubmit={handleCreateGroup}
              parentId={createGroupModalConfig.parentId}
              allGroups={groups}
            />
          )}
          {isGroupInfoModalOpen && editingGroup && (
            <GroupInfoModal
                isOpen={isGroupInfoModalOpen}
                onClose={() => { setIsGroupInfoModalOpen(false); setEditingGroup(null);}}
                group={editingGroup}
                currentUser={currentUser}
                onUpdateDetails={handleUpdateGroupDetails}
                onAddMembers={handleAddMembersToGroup}
                onUpdateGroupAvatar={handleUpdateGroupAvatar}
                onPromoteToAdmin={handlePromoteToAdmin}
                onDemoteAdmin={handleDemoteAdmin}
                onDeleteGroup={handleDeleteGroup}
                onToggleArchiveGroup={handleToggleArchiveGroup}
            />
          )}
          {isTestConfigModalOpen && selectedGroup && configTargetMode && (
            <TestConfigModal
                isOpen={isTestConfigModalOpen}
                onClose={() => { setIsTestConfigModal(false); setConfigTargetMode(null); }}
                group={selectedGroup}
                mode={configTargetMode === AppMode.TEST_CONFIG ? 'test' : 'study'}
                allMessages={messages[selectedGroup.id] || []}
                onSubmit={handleStartSession}
                onDownloadForOffline={handleDownloadQuestionsForOffline} 
                isDownloading={isDownloading} 
            />
          )}
          {isWalletModalOpen && (
            <WalletModal
              isOpen={isWalletModalOpen}
              onClose={() => setIsWalletModalOpen(false)}
              currentUser={currentUser}
              transactions={transactions.filter(t => t.userId === currentUser.id)}
              onFundWallet={handleFundWallet}
            />
          )}
        </div>
      )}
    </>
  );
};

export default App;