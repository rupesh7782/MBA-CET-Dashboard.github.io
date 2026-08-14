import localforage from 'localforage';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { 
  ExamConfig, MockTest, SectionalTest, Note, PdfItem, 
  ReadingItem, VocabWord, Formula, Goal, Habit, Achievement, 
  VaultItem, DailyStudyLog, TimerSession, AppNotification, UserProfile 
} from '../types';
import { 
  initialExamConfig, initialMockTests, initialSectionalTests, initialNotes, 
  initialPdfs, initialReadingItems, initialVocabWords, initialFormulas, 
  initialGoals, initialHabits, initialAchievements, initialVaultItems, 
  initialDailyLogs, initialTimerSessions, initialNotifications, initialUserProfile 
} from '../initialData';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  User
} from '../lib/firebase';

interface AppContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;

  // Cloud Sync & Auth
  currentUser: User | null;
  isCloudSyncing: boolean;
  lastSyncedAt: string | null;
  isOnline: boolean;
  signInWithGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  signOutUser: () => Promise<void>;
  syncToCloudNow: () => Promise<void>;
  loadFromCloudNow: () => Promise<void>;

  // Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Data
  examConfig: ExamConfig;
  updateExamConfig: (config: Partial<ExamConfig>) => void;
  
  mockTests: MockTest[];
  addMockTest: (mock: Omit<MockTest, 'id'>) => void;
  updateMockTest: (id: string, mock: Partial<MockTest>) => void;
  deleteMockTest: (id: string) => void;

  sectionalTests: SectionalTest[];
  addSectionalTest: (test: Omit<SectionalTest, 'id'>) => void;
  updateSectionalTest: (id: string, test: Partial<SectionalTest>) => void;
  deleteSectionalTest: (id: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  pdfs: PdfItem[];
  addPdfItem: (pdf: Omit<PdfItem, 'id' | 'uploadDate'>) => void;
  deletePdfItem: (id: string) => void;
  toggleBookmarkPdf: (id: string) => void;
  updatePdfProgress: (id: string, lastPageRead: number) => void;
  updatePdfItem: (id: string, item: Partial<PdfItem>) => void;

  readingItems: ReadingItem[];
  addReadingItem: (item: Omit<ReadingItem, 'id'>) => void;
  updateReadingItem: (id: string, item: Partial<ReadingItem>) => void;
  deleteReadingItem: (id: string) => void;
  toggleBookmarkReading: (id: string) => void;
  toggleReadReading: (id: string) => void;

  vocabWords: VocabWord[];
  addVocabWord: (word: Omit<VocabWord, 'id'>) => void;
  updateVocabWord: (id: string, word: Partial<VocabWord>) => void;
  deleteVocabWord: (id: string) => void;
  updateVocabMastery: (id: string, delta: number) => void;

  formulas: Formula[];
  addFormula: (formula: Omit<Formula, 'id'>) => void;
  updateFormula: (id: string, formula: Partial<Formula>) => void;
  deleteFormula: (id: string) => void;
  toggleBookmarkFormula: (id: string) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updated: Partial<Goal>) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'completionHistory'>) => void;
  toggleHabitForDate: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  addCustomAchievement: (ach: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
  updateAchievement: (id: string, updated: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  vaultItems: VaultItem[];
  addVaultItem: (item: Omit<VaultItem, 'id' | 'updatedAt'>) => void;
  updateVaultItem: (id: string, item: Partial<VaultItem>) => void;
  deleteVaultItem: (id: string) => void;
  vaultPin: string;
  setVaultPin: (pin: string) => void;
  isVaultUnlocked: boolean;
  unlockVaultWithPin: (pin: string) => boolean;
  lockVault: () => void;

  dailyLogs: DailyStudyLog[];
  logTodayStudy: (hours: number, questions: number, accuracy: number) => void;
  updateTodayLog: (hours: number, questions: number, accuracy: number) => void;
  updateDailyLogDate: (date: string, hours: number, questions: number, accuracy: number) => void;
  deleteDailyLogDate: (date: string) => void;

  timerSessions: TimerSession[];
  addTimerSession: (session: Omit<TimerSession, 'id' | 'timestamp'>) => void;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;

  // System
  currentStreak: number;
  resetStreak: (resetDate: string, daysCount?: number) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetAllData: () => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'mba_cet_prep_v1_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // Silently ignore storage quota
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // Cloud Sync & Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => getStored('lastSyncedAt', null));
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Application Data States
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => getStored('userProfile', initialUserProfile));
  const [examConfig, setExamConfigState] = useState<ExamConfig>(() => getStored('examConfig', initialExamConfig));
  const [mockTests, setMockTestsState] = useState<MockTest[]>(() => getStored('mockTests', initialMockTests));
  const [sectionalTests, setSectionalTestsState] = useState<SectionalTest[]>(() => getStored('sectionalTests', initialSectionalTests));
  const [notes, setNotesState] = useState<Note[]>(() => getStored('notes', initialNotes));
  const [pdfs, setPdfsState] = useState<PdfItem[]>(() => getStored('pdfs', initialPdfs));
  const [vocabWords, setVocabWordsState] = useState<VocabWord[]>(() => {
    const stored = getStored<VocabWord[]>('vocabWords', initialVocabWords);
    if (!stored || stored.length < initialVocabWords.length) {
      const existingIds = new Set(stored ? stored.map(w => w.id) : []);
      const missing = initialVocabWords.filter(w => !existingIds.has(w.id));
      return [...(stored || []), ...missing];
    }
    return stored;
  });
  const [formulas, setFormulasState] = useState<Formula[]>(() => getStored('formulas', initialFormulas));
  const [goals, setGoalsState] = useState<Goal[]>(() => getStored('goals', initialGoals));
  const [habits, setHabitsState] = useState<Habit[]>(() => getStored('habits', initialHabits));
  const [achievements, setAchievementsState] = useState<Achievement[]>(() => getStored('achievements', initialAchievements));
  const [vaultItems, setVaultItemsState] = useState<VaultItem[]>(() => getStored('vaultItems', initialVaultItems));
  const [vaultPin, setVaultPinState] = useState<string>(() => getStored('vaultPin', ''));
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  const [readingItems, setReadingItemsState] = useState<ReadingItem[]>(() => getStored('readingItems', initialReadingItems));
  const [isLoaded, setIsLoaded] = useState(false);
  const [dailyLogs, setDailyLogsState] = useState<DailyStudyLog[]>(() => getStored('dailyLogs', initialDailyLogs));
  const [timerSessions, setTimerSessionsState] = useState<TimerSession[]>(() => {
    const stored = getStored('timerSessions', initialTimerSessions);
    if (stored.some(s => s.timestamp.startsWith('2026-05-25'))) {
      const today = new Date().toISOString().split('T')[0];
      const recentSessions = stored.filter(s => s.timestamp.startsWith(today));
      return [...initialTimerSessions, ...recentSessions];
    }
    return stored;
  });
  const [notifications, setNotificationsState] = useState<AppNotification[]>(() => getStored('notifications', initialNotifications));

  // Network Online/Offline Listeners
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

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Auto-update user profile name if signed in with Google
        if (user.displayName && (!userProfile.name || userProfile.name === 'Aspirant')) {
          setUserProfileState(prev => ({
            ...prev,
            name: user.displayName || prev.name,
            avatarUrl: user.photoURL || prev.avatarUrl
          }));
        }
      }
    });
    return () => unsubscribe();
  }, [userProfile.name]);

  // Initial load from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        const storedPdfs = await localforage.getItem<PdfItem[]>('mba_cet_prep_v1_pdfs');
        if (storedPdfs && Array.isArray(storedPdfs) && storedPdfs.length > 0) {
          setPdfsState(storedPdfs);
        } else {
          const lsPdfs = getStored('pdfs', initialPdfs);
          if (lsPdfs && Array.isArray(lsPdfs)) {
            setPdfsState(lsPdfs);
            localforage.setItem('mba_cet_prep_v1_pdfs', lsPdfs).catch(console.error);
          }
        }
        
        const storedReading = await localforage.getItem<ReadingItem[]>('mba_cet_prep_v1_readingItems');
        if (storedReading && Array.isArray(storedReading) && storedReading.length > 0) {
          setReadingItemsState(storedReading);
        } else {
          const lsReading = getStored('readingItems', initialReadingItems);
          if (lsReading && Array.isArray(lsReading)) {
            setReadingItemsState(lsReading);
            localforage.setItem('mba_cet_prep_v1_readingItems', lsReading).catch(console.error);
          }
        }
      } catch (e) {
        console.error('Error loading from localforage', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  // Local Storage Sync
  useEffect(() => setStored('userProfile', userProfile), [userProfile]);
  useEffect(() => setStored('examConfig', examConfig), [examConfig]);
  useEffect(() => setStored('mockTests', mockTests), [mockTests]);
  useEffect(() => setStored('sectionalTests', sectionalTests), [sectionalTests]);
  useEffect(() => setStored('notes', notes), [notes]);
  useEffect(() => { 
    if (isLoaded) {
      localforage.setItem('mba_cet_prep_v1_pdfs', pdfs).catch(console.error);
      try { localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'pdfs'); } catch (e) {}
    }
  }, [pdfs, isLoaded]);
  useEffect(() => { 
    if (isLoaded) {
      localforage.setItem('mba_cet_prep_v1_readingItems', readingItems).catch(console.error);
      try { localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'readingItems'); } catch (e) {}
    }
  }, [readingItems, isLoaded]);
  useEffect(() => setStored('vocabWords', vocabWords), [vocabWords]);
  useEffect(() => setStored('formulas', formulas), [formulas]);
  useEffect(() => setStored('goals', goals), [goals]);
  useEffect(() => setStored('habits', habits), [habits]);
  useEffect(() => setStored('achievements', achievements), [achievements]);
  useEffect(() => setStored('vaultItems', vaultItems), [vaultItems]);
  useEffect(() => setStored('vaultPin', vaultPin), [vaultPin]);
  useEffect(() => setStored('dailyLogs', dailyLogs), [dailyLogs]);
  useEffect(() => setStored('timerSessions', timerSessions), [timerSessions]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('lastSyncedAt', lastSyncedAt), [lastSyncedAt]);

  // Realtime Cloud Firestore Synchronization
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef<any>(null);

  const pushStateToCloud = useCallback(async (user: User) => {
    if (!navigator.onLine) return;
    try {
      isSyncingRef.current = true;
      setIsCloudSyncing(true);

      const userStateDoc = doc(db, 'users', user.uid, 'userState', 'sync');
      const userProfileDoc = doc(db, 'users', user.uid);

      const payload = {
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        data: {
          userProfile,
          examConfig,
          mockTests,
          sectionalTests,
          notes,
          vocabWords,
          formulas,
          goals,
          habits,
          achievements,
          vaultItems,
          vaultPin,
          dailyLogs,
          timerSessions,
          notifications
        }
      };

      await setDoc(userStateDoc, payload, { merge: true });
      await setDoc(userProfileDoc, {
        userId: user.uid,
        name: userProfile.name,
        avatarUrl: userProfile.avatarUrl,
        tagline: userProfile.tagline,
        targetExam: userProfile.targetExam,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      const syncTime = new Date().toISOString();
      setLastSyncedAt(syncTime);
    } catch (error) {
      console.error('Error syncing to Firestore cloud:', error);
    } finally {
      setIsCloudSyncing(false);
      isSyncingRef.current = false;
    }
  }, [
    userProfile, examConfig, mockTests, sectionalTests, notes,
    vocabWords, formulas, goals, habits, achievements,
    vaultItems, vaultPin, dailyLogs, timerSessions, notifications
  ]);

  // Debounced auto-sync to Cloud Firestore when state updates
  useEffect(() => {
    if (!currentUser || !isLoaded) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(() => {
      pushStateToCloud(currentUser);
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [
    currentUser, isLoaded, userProfile, examConfig, mockTests, 
    sectionalTests, notes, vocabWords, formulas, goals, 
    habits, achievements, vaultItems, vaultPin, dailyLogs, 
    timerSessions, notifications, pushStateToCloud
  ]);

  // Initial cloud restore on user login
  const hasLoadedRemoteState = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    if (hasLoadedRemoteState.current === currentUser.uid) return;

    async function loadCloudState() {
      try {
        setIsCloudSyncing(true);
        const userStateDoc = doc(db, 'users', currentUser!.uid, 'userState', 'sync');
        const snap = await getDoc(userStateDoc);

        if (snap.exists()) {
          const remoteData = snap.data()?.data;
          if (remoteData) {
            if (remoteData.userProfile) setUserProfileState(remoteData.userProfile);
            if (remoteData.examConfig) setExamConfigState(remoteData.examConfig);
            if (remoteData.mockTests) setMockTestsState(remoteData.mockTests);
            if (remoteData.sectionalTests) setSectionalTestsState(remoteData.sectionalTests);
            if (remoteData.notes) setNotesState(remoteData.notes);
            if (remoteData.vocabWords) setVocabWordsState(remoteData.vocabWords);
            if (remoteData.formulas) setFormulasState(remoteData.formulas);
            if (remoteData.goals) setGoalsState(remoteData.goals);
            if (remoteData.habits) setHabitsState(remoteData.habits);
            if (remoteData.achievements) setAchievementsState(remoteData.achievements);
            if (remoteData.vaultItems) setVaultItemsState(remoteData.vaultItems);
            if (remoteData.vaultPin) setVaultPinState(remoteData.vaultPin);
            if (remoteData.dailyLogs) setDailyLogsState(remoteData.dailyLogs);
            if (remoteData.timerSessions) setTimerSessionsState(remoteData.timerSessions);
            if (remoteData.notifications) setNotificationsState(remoteData.notifications);

            toast.success('Synced with Cloud Database ☁️');
          }
        } else {
          // New cloud user: initial push of current state
          await pushStateToCloud(currentUser!);
        }
        hasLoadedRemoteState.current = currentUser!.uid;
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        console.error('Failed to fetch user state from cloud', err);
      } finally {
        setIsCloudSyncing(false);
      }
    }

    loadCloudState();
  }, [currentUser, pushStateToCloud]);

  // Auth Methods
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome, ${result.user.displayName || 'Aspirant'}! Connected to Cloud DB 🚀`);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      toast.error(err.message || 'Google Sign-In failed');
    }
  };

  const signInGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      toast.success('Signed in as Guest with Cloud Database enabled!');
    } catch (err: any) {
      console.error('Guest Sign-In Error:', err);
      toast.error(err.message || 'Guest Sign-In failed');
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      hasLoadedRemoteState.current = null;
      toast.success('Signed out from Cloud');
    } catch (err: any) {
      toast.error('Failed to sign out');
    }
  };

  const syncToCloudNow = async () => {
    if (!currentUser) {
      setIsSyncModalOpen(true);
      toast.error('Please sign in to sync with Cloud DB');
      return;
    }
    await pushStateToCloud(currentUser);
    toast.success('Saved to Firebase Cloud Firestore! ☁️');
  };

  const loadFromCloudNow = async () => {
    if (!currentUser) {
      setIsSyncModalOpen(true);
      return;
    }
    hasLoadedRemoteState.current = null;
    try {
      setIsCloudSyncing(true);
      const userStateDoc = doc(db, 'users', currentUser.uid, 'userState', 'sync');
      const snap = await getDoc(userStateDoc);
      if (snap.exists() && snap.data()?.data) {
        const remoteData = snap.data().data;
        if (remoteData.userProfile) setUserProfileState(remoteData.userProfile);
        if (remoteData.examConfig) setExamConfigState(remoteData.examConfig);
        if (remoteData.mockTests) setMockTestsState(remoteData.mockTests);
        if (remoteData.sectionalTests) setSectionalTestsState(remoteData.sectionalTests);
        if (remoteData.notes) setNotesState(remoteData.notes);
        if (remoteData.vocabWords) setVocabWordsState(remoteData.vocabWords);
        if (remoteData.formulas) setFormulasState(remoteData.formulas);
        if (remoteData.goals) setGoalsState(remoteData.goals);
        if (remoteData.habits) setHabitsState(remoteData.habits);
        if (remoteData.achievements) setAchievementsState(remoteData.achievements);
        if (remoteData.vaultItems) setVaultItemsState(remoteData.vaultItems);
        if (remoteData.vaultPin) setVaultPinState(remoteData.vaultPin);
        if (remoteData.dailyLogs) setDailyLogsState(remoteData.dailyLogs);
        if (remoteData.timerSessions) setTimerSessionsState(remoteData.timerSessions);
        if (remoteData.notifications) setNotificationsState(remoteData.notifications);
        toast.success('Latest data refreshed from cloud database!');
      }
    } catch (e) {
      toast.error('Failed to refresh data from cloud');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Confetti Helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7A00', '#FFB547', '#38E27A', '#FFFFFF']
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  // Current Streak Calculation & Reset
  const currentStreak = examConfig.currentStreakDays ?? 47;

  const resetStreak = (resetDate: string, daysCount: number = 0) => {
    setExamConfigState(prev => ({
      ...prev,
      streakResetDate: resetDate,
      currentStreakDays: daysCount,
    }));
    toast.success(`Study streak updated to ${daysCount} ${daysCount === 1 ? 'day' : 'days'} starting from ${resetDate}! 🔥`);
  };

  // Profile
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfileState(prev => ({ ...prev, ...profile }));
  };

  // Exam Config
  const updateExamConfig = (config: Partial<ExamConfig>) => {
    setExamConfigState(prev => {
      const updated = { ...prev, ...config };
      toast.success('Exam settings updated!');
      return updated;
    });
  };

  // Mock Tests CRUD
  const addMockTest = (mock: Omit<MockTest, 'id'>) => {
    const newMock: MockTest = {
      ...mock,
      id: 'mock-' + Date.now(),
    };
    setMockTestsState(prev => [newMock, ...prev]);
    toast.success(`Added ${newMock.name}`);
    if (newMock.status === 'Completed' && newMock.percentile >= 99) {
      triggerConfetti();
    }
  };

  const updateMockTest = (id: string, mock: Partial<MockTest>) => {
    setMockTestsState(prev => prev.map(m => m.id === id ? { ...m, ...mock } : m));
    toast.success('Mock test details updated!');
  };

  const deleteMockTest = (id: string) => {
    setMockTestsState(prev => prev.filter(m => m.id !== id));
    toast.success('Mock test removed');
  };

  // Sectional Tests CRUD
  const addSectionalTest = (test: Omit<SectionalTest, 'id'>) => {
    const newSec: SectionalTest = {
      ...test,
      id: 'sec-' + Date.now(),
    };
    setSectionalTestsState(prev => [newSec, ...prev]);
    toast.success(`Sectional test recorded for ${newSec.subject}`);
  };

  const updateSectionalTest = (id: string, test: Partial<SectionalTest>) => {
    setSectionalTestsState(prev => prev.map(s => s.id === id ? { ...s, ...test } : s));
    toast.success('Sectional test updated');
  };

  const deleteSectionalTest = (id: string) => {
    setSectionalTestsState(prev => prev.filter(s => s.id !== id));
    toast.success('Sectional test deleted');
  };

  // Notes CRUD
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: 'note-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setNotesState(prev => [newNote, ...prev]);
    toast.success('New note created');
  };

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotesState(prev => prev.map(n => n.id === id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n));
    toast.success('Note saved');
  };

  const deleteNote = (id: string) => {
    setNotesState(prev => prev.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  const togglePinNote = (id: string) => {
    setNotesState(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  // PDFs CRUD
  const addPdfItem = (pdf: Omit<PdfItem, 'id' | 'uploadDate'>) => {
    const newPdf: PdfItem = {
      ...pdf,
      id: 'pdf-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setPdfsState(prev => [newPdf, ...prev]);
    toast.success('PDF document added to library');
  };

  const deletePdfItem = (id: string) => {
    setPdfsState(prev => prev.filter(p => p.id !== id));
    toast.success('PDF removed from library');
  };

  const toggleBookmarkPdf = (id: string) => {
    setPdfsState(prev => prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));
  };

  const updatePdfProgress = (id: string, lastPageRead: number) => {
    setPdfsState(prev => prev.map(p => p.id === id ? { ...p, lastPageRead } : p));
  };

  const updatePdfItem = (id: string, item: Partial<PdfItem>) => {
    setPdfsState(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
  };

  // Reading Items CRUD
  const addReadingItem = (item: Omit<ReadingItem, 'id'>) => {
    const newItem: ReadingItem = {
      ...item,
      id: 'read-' + Date.now(),
    };
    setReadingItemsState(prev => [newItem, ...prev]);
    toast.success('Article added to reading list');
  };

  const updateReadingItem = (id: string, item: Partial<ReadingItem>) => {
    setReadingItemsState(prev => prev.map(r => r.id === id ? { ...r, ...item } : r));
    toast.success('Article updated successfully');
  };

  const deleteReadingItem = (id: string) => {
    setReadingItemsState(prev => prev.filter(r => r.id !== id));
    toast.success('Article removed');
  };

  const toggleBookmarkReading = (id: string) => {
    setReadingItemsState(prev => prev.map(r => r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r));
  };

  const toggleReadReading = (id: string) => {
    setReadingItemsState(prev => prev.map(r => r.id === id ? { ...r, isRead: !r.isRead } : r));
  };

  // Vocab CRUD
  const addVocabWord = (word: Omit<VocabWord, 'id'>) => {
    const newWord: VocabWord = {
      ...word,
      id: 'v-' + Date.now(),
    };
    setVocabWordsState(prev => [newWord, ...prev]);
    toast.success(`Word "${newWord.word}" added to vocabulary`);
  };

  const updateVocabWord = (id: string, word: Partial<VocabWord>) => {
    setVocabWordsState(prev => prev.map(w => w.id === id ? { ...w, ...word } : w));
    toast.success('Word updated');
  };

  const deleteVocabWord = (id: string) => {
    setVocabWordsState(prev => prev.filter(w => w.id !== id));
    toast.success('Word deleted');
  };

  const updateVocabMastery = (id: string, delta: number) => {
    setVocabWordsState(prev => prev.map(w => {
      if (w.id === id) {
        const newLevel = Math.max(0, Math.min(5, w.masteryLevel + delta));
        return { ...w, masteryLevel: newLevel };
      }
      return w;
    }));
  };

  // Formulas CRUD
  const addFormula = (formula: Omit<Formula, 'id'>) => {
    const newFormula: Formula = {
      ...formula,
      id: 'f-' + Date.now(),
    };
    setFormulasState(prev => [newFormula, ...prev]);
    toast.success('Formula added to reference book');
  };

  const updateFormula = (id: string, formula: Partial<Formula>) => {
    setFormulasState(prev => prev.map(f => f.id === id ? { ...f, ...formula } : f));
    toast.success('Formula updated');
  };

  const deleteFormula = (id: string) => {
    setFormulasState(prev => prev.filter(f => f.id !== id));
    toast.success('Formula deleted');
  };

  const toggleBookmarkFormula = (id: string) => {
    setFormulasState(prev => prev.map(f => f.id === id ? { ...f, isBookmarked: !f.isBookmarked } : f));
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: 'g-' + Date.now(),
    };
    setGoalsState(prev => [newGoal, ...prev]);
    toast.success('New goal created');
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    setGoalsState(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
    toast.success('Goal updated');
  };

  const toggleGoal = (id: string) => {
    setGoalsState(prev => prev.map(g => {
      if (g.id === id) {
        const updated = !g.isCompleted;
        if (updated) toast.success('Goal completed! Keep going 🎯');
        return { ...g, isCompleted: updated };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoalsState(prev => prev.filter(g => g.id !== id));
    toast.success('Goal removed');
  };

  // Habits CRUD
  const addHabit = (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'completionHistory'>) => {
    const newHabit: Habit = {
      ...habit,
      id: 'h-' + Date.now(),
      currentStreak: 0,
      bestStreak: 0,
      completionHistory: {},
    };
    setHabitsState(prev => [newHabit, ...prev]);
    toast.success(`Habit "${newHabit.title}" created`);
  };

  const toggleHabitForDate = (id: string, dateStr: string) => {
    setHabitsState(prev => prev.map(h => {
      if (h.id === id) {
        const history = { ...h.completionHistory };
        const isDone = !history[dateStr];
        if (isDone) history[dateStr] = true;
        else delete history[dateStr];

        // Recalculate streak
        let streak = 0;
        let d = new Date();
        while (true) {
          const ds = d.toISOString().split('T')[0];
          if (history[ds]) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else {
            break;
          }
        }
        const best = Math.max(h.bestStreak, streak);
        return { ...h, completionHistory: history, currentStreak: streak, bestStreak: best };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabitsState(prev => prev.filter(h => h.id !== id));
    toast.success('Habit deleted');
  };

  // Achievements
  const unlockAchievement = (id: string) => {
    setAchievementsState(prev => prev.map(a => {
      if (a.id === id && !a.unlockedAt) {
        triggerConfetti();
        toast.success(`Achievement Unlocked: ${a.title}! 🏆`);
        return { ...a, unlockedAt: new Date().toISOString().split('T')[0], progress: a.target };
      }
      return a;
    }));
  };

  const addCustomAchievement = (ach: Omit<Achievement, 'id' | 'unlockedAt'>) => {
    const newAch: Achievement = {
      ...ach,
      id: 'ach-' + Date.now(),
      unlockedAt: ach.progress >= ach.target ? new Date().toISOString().split('T')[0] : null,
    };
    setAchievementsState(prev => [newAch, ...prev]);
    toast.success('Custom achievement created');
    if (newAch.unlockedAt) triggerConfetti();
  };

  const updateAchievement = (id: string, updated: Partial<Achievement>) => {
    setAchievementsState(prev => prev.map(a => {
      if (a.id === id) {
        const newObj = { ...a, ...updated };
        if (newObj.progress >= newObj.target && !newObj.unlockedAt) {
          newObj.unlockedAt = new Date().toISOString().split('T')[0];
          triggerConfetti();
        }
        return newObj;
      }
      return a;
    }));
    toast.success('Milestone updated');
  };

  const deleteAchievement = (id: string) => {
    setAchievementsState(prev => prev.filter(a => a.id !== id));
    toast.success('Milestone deleted');
  };

  // Vault
  const addVaultItem = (item: Omit<VaultItem, 'id' | 'updatedAt'>) => {
    const newItem: VaultItem = {
      ...item,
      id: 'vlt-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setVaultItemsState(prev => [newItem, ...prev]);
    toast.success('Secure item saved to Vault');
  };

  const updateVaultItem = (id: string, item: Partial<VaultItem>) => {
    setVaultItemsState(prev => prev.map(v => v.id === id ? { ...v, ...item, updatedAt: new Date().toISOString().split('T')[0] } : v));
    toast.success('Vault item updated');
  };

  const deleteVaultItem = (id: string) => {
    setVaultItemsState(prev => prev.filter(v => v.id !== id));
    toast.success('Vault item removed');
  };

  const setVaultPin = (pin: string) => {
    setVaultPinState(pin);
    toast.success('Vault PIN updated');
  };

  const unlockVaultWithPin = (pin: string) => {
    if (pin === vaultPin) {
      setIsVaultUnlocked(true);
      toast.success('Vault unlocked successfully 🔓');
      return true;
    } else {
      toast.error('Incorrect PIN. Please try again.');
      return false;
    }
  };

  const lockVault = () => {
    setIsVaultUnlocked(false);
    toast.success('Vault locked 🔒');
  };

  // Study Logging
  const updateTodayLog = (hours: number, questions: number, accuracy: number) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyLogsState(prev => {
      const existing = prev.find(l => l.date === today);
      if (existing) {
        return prev.map(l => l.date === today ? { ...l, hoursStudied: hours, questionsSolved: questions, accuracy } : l);
      } else {
        return [...prev, { date: today, hoursStudied: hours, questionsSolved: questions, accuracy }];
      }
    });
  };

  const updateDailyLogDate = (date: string, hours: number, questions: number, accuracy: number) => {
    setDailyLogsState(prev => {
      const existing = prev.find(l => l.date === date);
      if (existing) {
        return prev.map(l => l.date === date ? { ...l, hoursStudied: hours, questionsSolved: questions, accuracy } : l);
      } else {
        return [...prev, { date, hoursStudied: hours, questionsSolved: questions, accuracy }];
      }
    });
  };

  const deleteDailyLogDate = (date: string) => {
    setDailyLogsState(prev => prev.filter(l => l.date !== date));
  };

  const logTodayStudy = (hours: number, questions: number, accuracy: number) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setDailyLogsState(prev => {
      const existing = prev.find(l => l.date === today);
      if (existing) {
        return prev.map(l => l.date === today ? { 
          ...l, 
          hoursStudied: Number((l.hoursStudied + hours).toFixed(2)),
          questionsSolved: l.questionsSolved + questions,
          accuracy: accuracy > 0 ? Number(((l.accuracy + accuracy) / 2).toFixed(1)) : l.accuracy
        } : l);
      } else {
        return [...prev, { date: today, hoursStudied: hours, questionsSolved: questions, accuracy }];
      }
    });
  };

  const addTimerSession = (session: Omit<TimerSession, 'id' | 'timestamp'>) => {
    const newSession: TimerSession = {
      ...session,
      id: 'ts-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setTimerSessionsState(prev => [newSession, ...prev]);
    logTodayStudy(session.durationMinutes / 60, 0, 0);
    toast.success(`Logged ${session.durationMinutes} min ${session.mode} session!`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotificationsState(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Backup & Restore
  const exportData = () => {
    const fullBackup = {
      userProfile, examConfig, mockTests, sectionalTests, notes, pdfs, 
      readingItems, vocabWords, formulas, goals, habits, 
      achievements, vaultItems, dailyLogs, timerSessions
    };
    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MBA_CET_PREP_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Full database exported successfully!');
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.userProfile) setUserProfileState(parsed.userProfile);
      if (parsed.examConfig) setExamConfigState(parsed.examConfig);
      if (parsed.mockTests) setMockTestsState(parsed.mockTests);
      if (parsed.sectionalTests) setSectionalTestsState(parsed.sectionalTests);
      if (parsed.notes) setNotesState(parsed.notes);
      if (parsed.pdfs) setPdfsState(parsed.pdfs);
      if (parsed.readingItems) setReadingItemsState(parsed.readingItems);
      if (parsed.vocabWords) setVocabWordsState(parsed.vocabWords);
      if (parsed.formulas) setFormulasState(parsed.formulas);
      if (parsed.goals) setGoalsState(parsed.goals);
      if (parsed.habits) setHabitsState(parsed.habits);
      if (parsed.achievements) setAchievementsState(parsed.achievements);
      if (parsed.vaultItems) setVaultItemsState(parsed.vaultItems);
      if (parsed.dailyLogs) setDailyLogsState(parsed.dailyLogs);
      if (parsed.timerSessions) setTimerSessionsState(parsed.timerSessions);
      toast.success('Database restored successfully!');
      return true;
    } catch (e) {
      toast.error('Invalid backup file format');
      return false;
    }
  };

  const resetAllData = () => {
    setUserProfileState(initialUserProfile);
    setExamConfigState(initialExamConfig);
    setMockTestsState(initialMockTests);
    setSectionalTestsState(initialSectionalTests);
    setNotesState(initialNotes);
    setPdfsState(initialPdfs);
    setReadingItemsState(initialReadingItems);
    setVocabWordsState(initialVocabWords);
    setFormulasState(initialFormulas);
    setGoalsState(initialGoals);
    setHabitsState(initialHabits);
    setAchievementsState(initialAchievements);
    setVaultItemsState(initialVaultItems);
    setDailyLogsState(initialDailyLogs);
    setTimerSessionsState(initialTimerSessions);
    setNotificationsState(initialNotifications);
    toast.success('Database reset to defaults!');
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      isSidebarCollapsed, setIsSidebarCollapsed,
      isCommandPaletteOpen, setIsCommandPaletteOpen,
      isProfileModalOpen, setIsProfileModalOpen,
      isSyncModalOpen, setIsSyncModalOpen,
      currentUser, isCloudSyncing, lastSyncedAt, isOnline,
      signInWithGoogle, signInGuest, signOutUser,
      syncToCloudNow, loadFromCloudNow,
      userProfile, updateUserProfile,
      examConfig, updateExamConfig,
      mockTests, addMockTest, updateMockTest, deleteMockTest,
      sectionalTests, addSectionalTest, updateSectionalTest, deleteSectionalTest,
      notes, addNote, updateNote, deleteNote, togglePinNote,
      pdfs, addPdfItem, deletePdfItem, toggleBookmarkPdf, updatePdfProgress, updatePdfItem,
      readingItems, addReadingItem, updateReadingItem, deleteReadingItem, toggleBookmarkReading, toggleReadReading,
      vocabWords, addVocabWord, updateVocabWord, deleteVocabWord, updateVocabMastery,
      formulas, addFormula, updateFormula, deleteFormula, toggleBookmarkFormula,
      goals, addGoal, updateGoal, toggleGoal, deleteGoal,
      habits, addHabit, toggleHabitForDate, deleteHabit,
      achievements, unlockAchievement, addCustomAchievement, updateAchievement, deleteAchievement,
      vaultItems, addVaultItem, updateVaultItem, deleteVaultItem,
      vaultPin, setVaultPin, isVaultUnlocked, unlockVaultWithPin, lockVault,
      dailyLogs, logTodayStudy, updateTodayLog, updateDailyLogDate, deleteDailyLogDate,
      timerSessions, addTimerSession,
      notifications, markNotificationAsRead,
      currentStreak, resetStreak,
      exportData, importData, resetAllData, triggerConfetti
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
