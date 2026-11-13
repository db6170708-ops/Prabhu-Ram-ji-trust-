import React, { useState, useEffect } from 'react';
import { StorageService } from '../utils/storage';
import {
  VolunteerApplication,
  VolunteerServiceEvent,
  VolunteerTaskItem,
} from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { Language } from '../utils/translations';
import {
  X,
  HeartHandshake,
  CheckCircle2,
  Search,
  Send,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  Square,
  LayoutDashboard,
  UserCheck,
  Plus,
  LogOut,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ACTIVE_VOLUNTEER_KEY = 'prt_active_volunteer_id';

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'status' | 'dashboard'>('register');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [preferredArea, setPreferredArea] = useState('शनिवार शाम भंडारा सेवा');
  const [availability, setAvailability] = useState('सप्ताहांत (शनिवार / रविवार)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Submission state
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(null);

  // Status check
  const [searchPhone, setSearchPhone] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundApp, setFoundApp] = useState<VolunteerApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Internal Volunteer Dashboard State
  const [activeVolunteer, setActiveVolunteer] = useState<VolunteerApplication | null>(null);
  const [registeredList, setRegisteredList] = useState<VolunteerApplication[]>([]);
  const [dashLoginInput, setDashLoginInput] = useState('');
  const [dashLoginError, setDashLoginError] = useState<string | null>(null);
  const [dashNotice, setDashNotice] = useState<string | null>(null);
  const [events, setEvents] = useState<VolunteerServiceEvent[]>([]);
  const [tasks, setTasks] = useState<VolunteerTaskItem[]>([]);
  const [dashSection, setDashSection] = useState<'events' | 'tasks'>('events');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'my_area'>('all');

  // Add new volunteer task mini-form
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('इस सप्ताह');
  const [newTaskArea, setNewTaskArea] = useState('शनिवार शाम भंडारा सेवा');

  useEffect(() => {
    if (!isOpen) return;

    const allVolunteers = StorageService.getVolunteers();
    setRegisteredList(allVolunteers);
    setEvents(StorageService.getVolunteerEvents());
    setTasks(StorageService.getVolunteerTasks());

    try {
      const savedId = localStorage.getItem(ACTIVE_VOLUNTEER_KEY);
      if (savedId) {
        const matched = allVolunteers.find((v) => v.id === savedId);
        if (matched) {
          setActiveVolunteer(matched);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activateVolunteerSession = (vol: VolunteerApplication) => {
    setActiveVolunteer(vol);
    setDashLoginError(null);
    setDashNotice(null);
    try {
      localStorage.setItem(ACTIVE_VOLUNTEER_KEY, vol.id);
    } catch {
      // ignore storage errors
    }
  };

  const clearVolunteerSession = () => {
    setActiveVolunteer(null);
    setDashNotice(null);
    try {
      localStorage.removeItem(ACTIVE_VOLUNTEER_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const digits = mobile.replace(/\D/g, '');
    if (!fullName.trim() || digits.length < 10) {
      setFormError('कृपया अपना पूरा नाम और 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    const application: VolunteerApplication = {
      id: `VOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      mobile: digits.slice(-10),
      email: email.trim() || undefined,
      city: city.trim() || 'गलगाँव',
      preferredArea,
      availability,
      notes: notes.trim() || undefined,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    StorageService.saveVolunteer(application);
    setRegisteredList(StorageService.getVolunteers());
    setSubmittedApp(application);
    activateVolunteerSession(application);
  };

  const findMatchingVolunteer = (query: string): VolunteerApplication | null => {
    const trimmed = query.trim();
    const cleanDigits = trimmed.replace(/\D/g, '');
    const volunteers = StorageService.getVolunteers();

    return (
      volunteers.find((v) => {
        const vDigits = v.mobile.replace(/\D/g, '');
        const phoneMatch = cleanDigits.length >= 10 && vDigits.endsWith(cleanDigits.slice(-10));
        const idMatch = v.id.toLowerCase() === trimmed.toLowerCase();
        return phoneMatch || idMatch;
      }) || null
    );
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const trimmed = searchPhone.trim();
    const clean = trimmed.replace(/\D/g, '');
    if (!trimmed || (clean.length < 10 && !trimmed.toUpperCase().startsWith('VOL-'))) {
      setSearchError('कृपया 10 अंकों का मोबाइल नंबर या आवेदन ID (उदा. VOL-2026-XXXX) दर्ज करें।');
      return;
    }

    const match = findMatchingVolunteer(trimmed);
    setFoundApp(match);
    setHasSearched(true);
    if (match) {
      activateVolunteerSession(match);
    }
  };

  const handleDashboardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDashLoginError(null);
    const trimmed = dashLoginInput.trim();
    const clean = trimmed.replace(/\D/g, '');
    if (!trimmed || (clean.length < 10 && !trimmed.toUpperCase().startsWith('VOL-'))) {
      setDashLoginError('कृपया पंजीकृत 10 अंकों का मोबाइल नंबर या स्वयंसेवक ID दर्ज करें।');
      return;
    }

    const match = findMatchingVolunteer(trimmed);
    if (!match) {
      setDashLoginError('इस नंबर या ID से कोई पंजीकृत स्वयंसेवक नहीं मिला। कृपया पहले पंजीकरण करें।');
      return;
    }

    activateVolunteerSession(match);
    setDashLoginInput('');
  };

  const handleToggleEventRsvp = (eventId: string) => {
    if (!activeVolunteer) {
      setDashNotice('कार्यक्रम में सहभागिता दर्ज करने के लिए कृपया ऊपर अपना पंजीकृत मोबाइल नंबर या स्वयंसेवक ID सत्यापित करें।');
      return;
    }
    const updated = StorageService.toggleVolunteerEventRsvp(eventId, activeVolunteer.id);
    setEvents(updated);
    setDashNotice(null);
  };

  const handleCycleTaskStatus = (task: VolunteerTaskItem) => {
    if (!activeVolunteer) {
      setDashNotice('सेवा कार्य की स्थिति अपडेट करने के लिए कृपया ऊपर अपना पंजीकृत मोबाइल नंबर या स्वयंसेवक ID सत्यापित करें।');
      return;
    }
    const nextStatus: VolunteerTaskItem['status'] =
      task.status === 'pending'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'pending';
    const assignee =
      nextStatus !== 'pending' && !task.assignedTo
        ? activeVolunteer.fullName || activeVolunteer.name || activeVolunteer.id
        : task.assignedTo;

    const updated = StorageService.updateVolunteerTaskStatus(task.id, nextStatus, assignee);
    setTasks(updated);
    setDashNotice(null);
  };

  const handleClaimTask = (task: VolunteerTaskItem) => {
    if (!activeVolunteer) {
      setDashNotice('कार्य का दायित्व लेने के लिए कृपया पहले अपनी स्वयंसेवक पहचान सत्यापित करें।');
      return;
    }
    const volName = activeVolunteer.fullName || activeVolunteer.name || activeVolunteer.id;
    const updated = StorageService.updateVolunteerTaskStatus(
      task.id,
      task.status === 'pending' ? 'in_progress' : task.status,
      volName
    );
    setTasks(updated);
    setDashNotice(null);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVolunteer || !newTaskTitle.trim()) return;

    const volName = activeVolunteer.fullName || activeVolunteer.name || activeVolunteer.id;
    const newTask: VolunteerTaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      eventRef: newTaskArea,
      sevaArea: newTaskArea,
      dueDate: newTaskDue.trim() || 'इस सप्ताह',
      priority: 'medium',
      status: 'pending',
      assignedTo: volName,
    };

    const updated = StorageService.addVolunteerTask(newTask);
    setTasks(updated);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const resetForm = () => {
    setFullName('');
    setMobile('');
    setEmail('');
    setCity('');
    setNotes('');
    setFormError(null);
    setSubmittedApp(null);
  };

  const activeName = activeVolunteer?.fullName || activeVolunteer?.name || 'स्वयंसेवक';
  const joinedEventsCount = activeVolunteer
    ? events.filter((ev) => ev.rsvpVolunteerIds.includes(activeVolunteer.id)).length
    : 0;
  const pendingTasksCount = tasks.filter((tk) => tk.status !== 'completed').length;
  const completedTasksCount = tasks.filter((tk) => tk.status === 'completed').length;

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === 'pending') return task.status !== 'completed';
    if (taskFilter === 'completed') return task.status === 'completed';
    if (taskFilter === 'my_area' && activeVolunteer?.preferredArea) {
      return task.sevaArea === activeVolunteer.preferredArea;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="time-card rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f4d3a] to-[#175b45] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                स्वयंसेवक सेवा एवं कार्य डैशबोर्ड
              </h3>
              <p className="text-xs text-amber-200/90">
                प्रभु रामजी ट्रस्ट सेवा कार्यों व आगामी आयोजनों में जुड़ें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/70 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-2 text-[11px] sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#0f4d3a] dark:border-amber-400 text-[#0f4d3a] dark:text-amber-300 bg-white dark:bg-[#1E1E1E]'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            📝 नया पंजीकरण
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2.5 px-2 text-[11px] sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#0f4d3a] dark:border-amber-400 text-[#0f4d3a] dark:text-amber-300 bg-white dark:bg-[#1E1E1E]'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            🔍 स्थिति जांचें
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2.5 px-2 text-[11px] sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'border-[#0f4d3a] dark:border-amber-400 text-[#0f4d3a] dark:text-amber-300 bg-white dark:bg-[#1E1E1E]'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span>सेवा डैशबोर्ड</span>
            {activeVolunteer && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="लॉगिन सक्रिय" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'register' && (
            submittedApp ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 dark:border-emerald-900">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold time-heading">
                    पंजीकरण सफल रहा!
                  </h4>
                  <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
                    जय श्री राम! आपका स्वयंसेवक आवेदन ट्रस्ट को प्राप्त हो गया है।
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-700/60 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400">आवेदन संदर्भ संख्या (ID):</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-amber-300 bg-white dark:bg-stone-900 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-600">
                      {submittedApp.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400">स्वयंसेवक का नाम:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{submittedApp.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400">पसंदीदा सेवा:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{submittedApp.preferredArea}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400">स्थिति:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-600">
                      समीक्षाधीन (सक्रिय डैशबोर्ड उपलब्ध)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f4d3a] hover:bg-[#135541] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-300" />
                    <span>सेवा डैशबोर्ड खोलें (आगामी कार्य देखें)</span>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=919575301233&text=${encodeURIComponent(
                      `जय श्री राम! मैंने प्रभु रामजी ट्रस्ट स्वयंसेवक के रूप में पंजीकरण किया है। मेरा आवेदन क्रमांक: ${submittedApp.id} है। नाम: ${submittedApp.fullName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all"
                  >
                    <span>WhatsApp पुष्टि</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-stone-700 rounded-xl font-medium cursor-pointer"
                  >
                    अन्य पंजीकरण
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                      पूरा नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. रमेश कुमार बिरला"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                      मोबाइल नंबर (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                      ईमेल (वैकल्पिक)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                      गाँव / शहर व जिला
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. गलगाँव / सनावद / खरगोन"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                    पसंदीदा सेवा क्षेत्र *
                  </label>
                  <select
                    value={preferredArea}
                    onChange={(e) => setPreferredArea(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                  >
                    <option value="शनिवार शाम भंडारा सेवा">शनिवार शाम भंडारा सेवा</option>
                    <option value="दैनिक निःशुल्क चाय सेवा">दैनिक निःशुल्क चाय सेवा</option>
                    <option value="गौशाला सेवा व चारा वितरण">गौशाला सेवा व चारा वितरण</option>
                    <option value="आश्रम एवं मंदिर निर्माण">आश्रम एवं मंदिर निर्माण सहयोग</option>
                    <option value="चिकित्सा एवं स्वास्थ्य शिविर">चिकित्सा एवं स्वास्थ्य शिविर</option>
                    <option value="डिजिटल व सोशल मीडिया प्रचार">डिजिटल व सोशल मीडिया प्रचार</option>
                    <option value="सांस्कृतिक एवं धार्मिक उत्सव">सांस्कृतिक एवं धार्मिक उत्सव प्रबंधन</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                    उपलब्धता *
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                  >
                    <option value="सप्ताहांत (शनिवार / रविवार)">सप्ताहांत (शनिवार / रविवार केवल)</option>
                    <option value="दैनिक 1-2 घंटे (सुबह या शाम)">दैनिक 1-2 घंटे (सुबह अथवा शाम)</option>
                    <option value="विशेष पर्व एवं उत्सवों पर">विशेष पर्व एवं धार्मिक उत्सवों पर</option>
                    <option value="पूर्णकालिक सेवा">पूर्णकालिक सेवा</option>
                    <option value="घर बैठे ऑनलाइन सहयोग">घर बैठे ऑनलाइन / डिजिटल सहयोग</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-200 mb-1">
                    विशेष संदेश अथवा पूर्व अनुभव (वैकल्पिक)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="यदि आप किसी विशेष हुनर (जैसे कुकिंग, ड्राइविंग, अकाउंटिंग, फोटोग्राफी) में दक्ष हैं तो लिखें..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none resize-none"
                  />
                </div>

                {formError && (
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#0f4d3a] to-[#165a44] hover:from-[#135541] hover:to-[#0f4d3a] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>स्वयंसेवक पंजीकरण जमा करें</span>
                </button>
              </form>
            )
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <input
                  type="text"
                  placeholder="अपना 10 अंकों का मोबाइल नंबर या आवेदन ID दर्ज करें"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f4d3a] hover:bg-[#135541] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>खोजें</span>
                </button>
              </form>

              {searchError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              {hasSearched && (
                foundApp ? (
                  <div className="time-card-muted border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2 gap-2">
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {foundApp.fullName || foundApp.name}
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          foundApp.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : foundApp.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700'
                            : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {foundApp.status === 'approved'
                          ? '✅ स्वीकृत'
                          : foundApp.status === 'rejected'
                          ? '❌ अस्वीकृत'
                          : '⏳ समीक्षाधीन'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-stone-600 dark:text-stone-300">
                      <div>
                        <span className="font-medium text-stone-500 dark:text-stone-400">आवेदन ID:</span>{' '}
                        <span className="font-mono font-bold text-stone-800 dark:text-amber-300">{foundApp.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500 dark:text-stone-400">सेवा क्षेत्र:</span>{' '}
                        <span className="text-stone-800 dark:text-stone-100 font-semibold">{foundApp.preferredArea}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500 dark:text-stone-400">समय उपलब्धता:</span>{' '}
                        <span className="text-stone-800 dark:text-stone-200">{foundApp.availability}</span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-500 dark:text-stone-400">पंजीकरण दिनांक:</span>{' '}
                        <span className="text-stone-800 dark:text-stone-200">
                          {new Date(foundApp.appliedAt || foundApp.appliedDate || Date.now()).toLocaleDateString('hi-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveTab('dashboard')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f4d3a] hover:bg-[#135541] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                        <span>मेरा सेवा डैशबोर्ड खोलें →</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-stone-500 dark:text-stone-400 text-xs sm:text-sm time-card-muted rounded-xl p-4 border border-dashed">
                    इस नंबर या ID से कोई स्वयंसेवक आवेदन नहीं मिला। कृपया पुनः जाँचें या नया पंजीकरण करें।
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Volunteer Session Card OR Sign-In Verification Bar */}
              {activeVolunteer ? (
                <div className="bg-gradient-to-r from-[#0f4d3a] to-[#135c45] text-white rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-700">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-white">
                          {activeName}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/30 text-amber-300 border border-amber-400/30">
                          {activeVolunteer.id}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            activeVolunteer.status === 'approved'
                              ? 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/40'
                              : 'bg-amber-400/25 text-amber-100 border border-amber-300/40'
                          }`}
                        >
                          {activeVolunteer.status === 'approved' ? 'स्वीकृत स्वयंसेवक' : 'पंजीकृत (समीक्षाधीन)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100/90 mt-0.5">
                        सेवा क्षेत्र: <strong className="text-amber-200">{activeVolunteer.preferredArea || 'सामान्य सेवा'}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearVolunteerSession}
                    className="self-start sm:self-center inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer shrink-0"
                    title="स्वयंसेवक बदलें"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>बदलें</span>
                  </button>
                </div>
              ) : (
                <div className="time-card-muted border rounded-xl p-3.5 sm:p-4 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold time-heading flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>पंजीकृत स्वयंसेवक सत्यापन (लॉगिन)</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        आगामी सेवा कार्यक्रमों में जुड़ने व कार्य अपडेट करने हेतु मोबाइल नंबर या ID दर्ज करें।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="self-start sm:self-center text-[11px] font-bold text-[#0f4d3a] dark:text-amber-300 hover:underline cursor-pointer whitespace-nowrap"
                    >
                      + नया पंजीकरण करें
                    </button>
                  </div>

                  <form onSubmit={handleDashboardLogin} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="10 अंकों का मोबाइल नंबर या VOL-2026-XXXX"
                      value={dashLoginInput}
                      onChange={(e) => setDashLoginInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg focus:ring-2 focus:ring-[#0f4d3a] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#0f4d3a] hover:bg-[#135541] text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
                    >
                      सत्यापित करें
                    </button>
                  </form>

                  {dashLoginError && (
                    <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{dashLoginError}</span>
                    </p>
                  )}

                  {registeredList.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        इस डिवाइस पर पंजीकृत:
                      </span>
                      {registeredList.slice(0, 3).map((vol) => (
                        <button
                          key={vol.id}
                          type="button"
                          onClick={() => activateVolunteerSession(vol)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer"
                        >
                          <span>{vol.fullName || vol.name}</span>
                          <span className="font-mono text-[10px] opacity-75">({vol.id})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {dashNotice && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{dashNotice}</span>
                </div>
              )}

              {/* Compact 3-Metric Summary Strip */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="time-card-muted border rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold time-heading tabular-nums">
                    {events.length}
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
                    आगामी सेवा आयोजन
                    {activeVolunteer && joinedEventsCount > 0 && (
                      <span className="block text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                        ({joinedEventsCount} में शामिल)
                      </span>
                    )}
                  </div>
                </div>
                <div className="time-card-muted border rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                    {pendingTasksCount}
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
                    सक्रिय सेवा कार्य
                  </div>
                </div>
                <div className="time-card-muted border rounded-xl p-2.5 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {completedTasksCount}
                  </div>
                  <div className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium">
                    पूर्ण सेवा कार्य
                  </div>
                </div>
              </div>

              {/* Inner Sub-View Toggle: Events vs Tasks */}
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex p-1 time-card-muted rounded-xl border">
                  <button
                    type="button"
                    onClick={() => setDashSection('events')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dashSection === 'events'
                        ? 'bg-[#0f4d3a] text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>आगामी कार्यक्रम ({events.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashSection('tasks')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dashSection === 'tasks'
                        ? 'bg-[#0f4d3a] text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>सेवा कार्य सूची ({tasks.length})</span>
                  </button>
                </div>

                {dashSection === 'tasks' && activeVolunteer && (
                  <button
                    type="button"
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>नया कार्य जोड़ें</span>
                  </button>
                )}
              </div>

              {/* Section 1: Upcoming Service Events */}
              {dashSection === 'events' && (
                <div className="space-y-3">
                  {events.map((ev) => {
                    const isJoined = activeVolunteer
                      ? ev.rsvpVolunteerIds.includes(activeVolunteer.id)
                      : false;
                    const count = ev.rsvpVolunteerIds.length;
                    const progressPct = Math.min(100, Math.round((count / ev.neededVolunteers) * 100));
                    const isMatchedArea =
                      activeVolunteer?.preferredArea &&
                      ((ev.category === 'bhandara' && activeVolunteer.preferredArea.includes('भंडारा')) ||
                        (ev.category === 'chaiseva' && activeVolunteer.preferredArea.includes('चाय')) ||
                        (ev.category === 'gauseva' && activeVolunteer.preferredArea.includes('गौशाला')) ||
                        (ev.category === 'ashram' && activeVolunteer.preferredArea.includes('आश्रम')));

                    return (
                      <div
                        key={ev.id}
                        className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                          isJoined
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-700'
                            : 'time-card-muted border'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {ev.priority === 'urgent' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                                  प्रमुख सेवा
                                </span>
                              )}
                              {isMatchedArea && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  आपकी पसंदीदा सेवा
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                              {ev.title}
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone-600 dark:text-stone-300 pt-0.5">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                {ev.dateLabel}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-700 dark:text-emerald-400 shrink-0" />
                                {ev.timeSlot}
                              </span>
                              <span className="inline-flex items-center gap-1 sm:col-span-2">
                                <MapPin className="w-3 h-3 text-stone-500 dark:text-stone-400 shrink-0" />
                                {ev.location} • <strong className="font-semibold">समन्वयक:</strong> {ev.coordinator}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleEventRsvp(ev.id)}
                            className={`self-start px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                              isJoined
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700'
                                : 'bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-[#0f4d3a] dark:text-amber-300 border-emerald-300 dark:border-amber-500/40'
                            }`}
                          >
                            {isJoined ? '✓ सेवा में जुड़े हैं' : '+ मैं भाग लूँगा'}
                          </button>
                        </div>

                        {/* Volunteer Participation Progress */}
                        <div className="mt-3 pt-2 border-t border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between gap-3">
                          <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0f4d3a] to-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 inline-flex items-center gap-1 shrink-0 tabular-nums">
                            <Users className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            {count}/{ev.neededVolunteers} स्वयंसेवक
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Section 2: Service Tasks */}
              {dashSection === 'tasks' && (
                <div className="space-y-3">
                  {showAddTask && activeVolunteer && (
                    <form
                      onSubmit={handleCreateTask}
                      className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 space-y-2.5"
                    >
                      <div className="text-xs font-bold text-stone-800 dark:text-amber-200">
                        नया सेवा कार्य जोड़ें
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="सेवा कार्य का विवरण लिखें (उदा. पंगत के लिए शुद्ध पेयजल व्यवस्था)..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4d3a]"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={newTaskArea}
                          onChange={(e) => setNewTaskArea(e.target.value)}
                          className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg"
                        >
                          <option value="शनिवार शाम भंडारा सेवा">शनिवार शाम भंडारा सेवा</option>
                          <option value="दैनिक निःशुल्क चाय सेवा">दैनिक निःशुल्क चाय सेवा</option>
                          <option value="गौशाला सेवा व चारा वितरण">गौशाला सेवा व चारा वितरण</option>
                          <option value="आश्रम एवं मंदिर निर्माण">आश्रम एवं मंदिर निर्माण</option>
                          <option value="डिजिटल व सोशल मीडिया प्रचार">डिजिटल व सोशल मीडिया प्रचार</option>
                        </select>
                        <input
                          type="text"
                          placeholder="समय सीमा (उदा. शनिवार 4 बजे तक)"
                          value={newTaskDue}
                          onChange={(e) => setNewTaskDue(e.target.value)}
                          className="px-2.5 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddTask(false)}
                          className="px-3 py-1 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:underline cursor-pointer"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-[#0f4d3a] text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          कार्य सहेजें
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Task Filters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all' as const, label: 'सभी कार्य' },
                      { id: 'pending' as const, label: 'सक्रिय / बाकी' },
                      { id: 'completed' as const, label: 'पूर्ण कार्य' },
                      ...(activeVolunteer ? [{ id: 'my_area' as const, label: 'मेरा सेवा क्षेत्र' }] : []),
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setTaskFilter(f.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer border ${
                          taskFilter === f.id
                            ? 'bg-amber-500 text-stone-950 border-amber-500'
                            : 'time-card text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-6 text-xs text-stone-500 dark:text-stone-400 time-card-muted rounded-xl border border-dashed">
                      इस श्रेणी में अभी कोई सेवा कार्य नहीं है।
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredTasks.map((task) => {
                        const isDone = task.status === 'completed';
                        const isInProgress = task.status === 'in_progress';

                        return (
                          <div
                            key={task.id}
                            className={`rounded-xl p-3 border transition-all flex items-start gap-3 ${
                              isDone
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/60 opacity-85'
                                : 'time-card-muted border'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleCycleTaskStatus(task)}
                              className="mt-0.5 text-[#0f4d3a] dark:text-amber-300 hover:scale-110 transition-transform cursor-pointer shrink-0"
                              title="स्थिति बदलें (बाकी → जारी → पूर्ण)"
                            >
                              {isDone ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    isDone
                                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                      : isInProgress
                                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                                      : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                                  }`}
                                >
                                  {isDone ? 'पूर्ण' : isInProgress ? 'प्रगति पर' : 'बाकी'}
                                </span>
                                <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                                  {task.sevaArea}
                                </span>
                                {task.priority === 'high' && !isDone && (
                                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                    • आवश्यक
                                  </span>
                                )}
                              </div>

                              <p
                                className={`text-xs sm:text-sm font-medium leading-snug ${
                                  isDone
                                    ? 'line-through text-stone-500 dark:text-stone-400'
                                    : 'text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                {task.title}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.dueDate}
                                  {task.assignedTo && (
                                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold ml-1">
                                      • दायित्व: {task.assignedTo}
                                    </span>
                                  )}
                                </span>

                                {!isDone && (!task.assignedTo || task.assignedTo !== activeName) && (
                                  <button
                                    type="button"
                                    onClick={() => handleClaimTask(task)}
                                    className="text-[11px] font-bold text-[#0f4d3a] dark:text-amber-300 hover:underline cursor-pointer"
                                  >
                                    + मैं यह कार्य करूँगा
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-600 dark:text-stone-300 shrink-0">
          <span>हेल्पलाइन: {TRUST_INFO.phone}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 font-medium rounded-lg text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
