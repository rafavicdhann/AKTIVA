import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { 
  ShieldCheck, Users, FileText, CheckCircle, XCircle, 
  Award, BookOpen, Plus, Bell, LogOut, 
  Newspaper, TrendingUp, Edit, Trash2, UserCog, Upload, X, Send, Star, AlertTriangle, Activity,
  Sun, Moon, Calendar, Search, Trophy, Sparkles, Rocket, Archive, Tag, ChevronRight, GraduationCap, Lightbulb, Globe, ArrowLeft, Pin
} from 'lucide-react';

// ============================================================
// AKTIVA - Platform Digital Manajemen Aktivitas & Portofolio
// ============================================================

// --- PALET WARNA (LIGHT & DARK MODE) ---
const LIGHT_THEME = {
  bg: '#F5F0EB',        // Linen - background utama
  card: '#FDFAF7',      // Warm ivory - card
  border: '#E8E0D6',    // Stone beige - border
  sidebar: '#2C3540',   // Dark slate - sidebar
  sidebarHover: '#3A4551',
  accent: '#2E7D8C',    // Teal utama - AKTIVA brand
  accentLight: '#E8F4F6',
  accentMid: '#4A9BAB',
  stone: '#6B7A8D',     // Stone - secondary text
  text: '#1A2332',      // Dark - primary text
  textMuted: '#8A9BB0',
  success: '#2D7A5F',
  successLight: '#E8F5F0',
  warning: '#B07A2D',
  warningLight: '#FDF4E7',
  danger: '#B03A2D',
  dangerLight: '#FDF0EE',
};

const DARK_THEME = {
  bg: '#0F172A',        // Dark blue-gray
  card: '#1E293B',      // Slightly lighter slate
  border: '#334155',    // Dark border
  sidebar: '#0B1120',   // Very dark for sidebar
  sidebarHover: '#1E293B',
  accent: '#38B2AC',    // Lighter teal for dark mode
  accentLight: '#134E4A', // Dark teal bg
  accentMid: '#4FD1C5',
  stone: '#94A3B8',     // Light stone text
  text: '#F8FAFC',      // White text
  textMuted: '#64748B',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  danger: '#F87171',
  dangerLight: '#7F1D1D',
};

// --- UTILITY ---
const loadFromStorage = (key, def) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
};
const saveToStorage = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// --- SISTEM POIN 3 DIMENSI AKTIVA ---
const POINT_MATRIX = {
  level:    { Sekolah: 5, Kabupaten: 15, Provinsi: 30, Nasional: 50, Internasional: 80 },
  role:     { Peserta: 1.0, Panitia: 1.3, 'Juara/Perwakilan Resmi': 2.0 },
  organizer:{ Swasta: 1.0, Sekolah: 1.0, Pemerintah: 1.5 },
};

const calculatePoints = (level, role, organizer) => {
  const base = POINT_MATRIX.level[level] || 5;
  const roleMult = POINT_MATRIX.role[role] || 1.0;
  const orgMult = POINT_MATRIX.organizer[organizer] || 1.0;
  return Math.round(base * roleMult * orgMult);
};

// --- MOCK DATA ---
const MOCK_SCHOOL_CODE = 'AKT-2026-X';
const CLASSES = ['X-A', 'X-B', 'XI-MIPA-1', 'XII-A'];
const SUBJECTS = ['Matematika', 'Bahasa Inggris', 'Fisika', 'Biologi', 'Kimia', 'Sejarah'];

const TAHUN_AJARAN_LIST = ['2024/2025', '2025/2026', '2026/2027'];
const SEMESTER_LIST = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

const INIT_USERS = [
  { id: 1, role: 'admin', nip: 'admin', password: '123', name: 'Admin Sekolah', status: 'active' },
  { id: 2, role: 'siswa', nip: '123456', password: '123', name: 'Budi Santoso', status: 'active', spamCount: 0, points: 157, semester: 3, className: 'XI-MIPA-1', tahunAjaran: '2025/2026', angkatan: 2024 },
  { id: 3, role: 'siswa', nip: '123457', password: '123', name: 'Siti Aminah', status: 'active', spamCount: 0, points: 45, semester: 3, className: 'XI-MIPA-1', tahunAjaran: '2025/2026', angkatan: 2024 },
  { id: 4, role: 'siswa', nip: '123458', password: '123', name: 'Andi Dharma', status: 'active', spamCount: 0, points: 0, semester: 3, className: 'XI-MIPA-1', tahunAjaran: '2025/2026', angkatan: 2024 },
  { id: 5, role: 'guru', nip: 'G01', password: '123', name: 'Pak Andi, M.Sc', status: 'active', isWaliKelas: true, waliClass: 'XI-MIPA-1', subject: 'Fisika', classesTaught: ['XI-MIPA-1', 'X-A'] },
  { id: 6, role: 'guru', nip: 'G02', password: '123', name: 'Ibu Ratna, S.Pd', status: 'active', isWaliKelas: false, subject: 'Bahasa Inggris', classesTaught: ['X-A', 'X-B'] },
];

const INIT_ACTIVITIES = [
  { id: 101, studentId: 2, title: 'Juara 1 Lomba Fisika Nasional', category: 'Kompetisi', level: 'Nasional', role: 'Juara/Perwakilan Resmi', organizer: 'Pemerintah', points: calculatePoints('Nasional','Juara/Perwakilan Resmi','Pemerintah'), status: 'approved', fileName: 'sertifikat.jpg', fileUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=400', note: '' },
  { id: 102, studentId: 2, title: 'Pengurus OSIS', category: 'Kegiatan', level: 'Sekolah', role: 'Panitia', organizer: 'Sekolah', points: calculatePoints('Sekolah','Panitia','Sekolah'), status: 'approved', fileName: '', fileUrl: null, note: '' },
  { id: 103, studentId: 3, title: 'Peserta Seminar Astronomi', category: 'Kegiatan', level: 'Nasional', role: 'Peserta', organizer: 'Swasta', points: calculatePoints('Nasional','Peserta','Swasta'), status: 'pending', fileName: 'bukti.jpg', fileUrl: 'https://images.unsplash.com/photo-1523580494112-071d4581a59c?q=80&w=400', note: '' },
];

// Nilai sekarang punya flag `published` — sebelum dipublish, siswa belum bisa lihat.
const INIT_GRADES = [
  { studentId: 2, subject: 'Fisika', semester: 'Sem 1', published: true, tasks: { 'Tugas 1': 80, 'Tugas 2': 85, UTS: 75, UAS: 82 } },
  { studentId: 2, subject: 'Matematika', semester: 'Sem 1', published: true, tasks: { 'Tugas 1': 60, 'Tugas 2': 65, UTS: 58, UAS: 62 } },
  { studentId: 2, subject: 'Bahasa Inggris', semester: 'Sem 1', published: true, tasks: { 'Tugas 1': 88, 'Tugas 2': 90, UTS: 85, UAS: 91 } },
  { studentId: 2, subject: 'Biologi', semester: 'Sem 1', published: true, tasks: { 'Tugas 1': 72, 'Tugas 2': 70, UTS: 68, UAS: 74 } },
  { studentId: 2, subject: 'Fisika', semester: 'Sem 2', published: true, tasks: { 'Tugas 1': 84, 'Tugas 2': 86, UTS: 80, UAS: 85 } },
  { studentId: 2, subject: 'Matematika', semester: 'Sem 2', published: true, tasks: { 'Tugas 1': 66, 'Tugas 2': 70, UTS: 62, UAS: 68 } },
  { studentId: 2, subject: 'Bahasa Inggris', semester: 'Sem 2', published: true, tasks: { 'Tugas 1': 90, 'Tugas 2': 92, UTS: 88, UAS: 93 } },
  { studentId: 2, subject: 'Biologi', semester: 'Sem 2', published: true, tasks: { 'Tugas 1': 75, 'Tugas 2': 78, UTS: 72, UAS: 76 } },
  { studentId: 2, subject: 'Fisika', semester: 'Sem 3', published: true, tasks: { 'Tugas 1': 88, 'Tugas 2': 90, UTS: 84, UAS: 89 } },
  { studentId: 2, subject: 'Matematika', semester: 'Sem 3', published: true, tasks: { 'Tugas 1': 72, 'Tugas 2': 74, UTS: 70, UAS: 73 } },
  { studentId: 2, subject: 'Bahasa Inggris', semester: 'Sem 3', published: true, tasks: { 'Tugas 1': 92, 'Tugas 2': 94, UTS: 90, UAS: 95 } },
  { studentId: 2, subject: 'Biologi', semester: 'Sem 3', published: true, tasks: { 'Tugas 1': 80, 'Tugas 2': 82, UTS: 78, UAS: 81 } },
  { studentId: 3, subject: 'Fisika', semester: 'Sem 1', published: true, tasks: { 'Tugas 1': 82, 'Tugas 2': 84, UTS: 79, UAS: null } },
  { studentId: 4, subject: 'Fisika', semester: 'Sem 1', published: false, tasks: { 'Tugas 1': 84, 'Tugas 2': 83, UTS: 83, UAS: null } },
];

// Try Out UTBK — input wali kelas, lihat untuk siswa
const INIT_TRYOUTS = [
  { id: 1, studentId: 2, date: '2026-01-15', sessionName: 'TO #1', tps: 580, literasi: 620, numerasi: 540, total: 1740 },
  { id: 2, studentId: 2, date: '2026-02-20', sessionName: 'TO #2', tps: 610, literasi: 640, numerasi: 580, total: 1830 },
  { id: 3, studentId: 2, date: '2026-03-22', sessionName: 'TO #3', tps: 640, literasi: 660, numerasi: 610, total: 1910 },
  { id: 4, studentId: 2, date: '2026-04-25', sessionName: 'TO #4', tps: 660, literasi: 680, numerasi: 640, total: 1980 },
  { id: 5, studentId: 3, date: '2026-01-15', sessionName: 'TO #1', tps: 540, literasi: 560, numerasi: 510, total: 1610 },
  { id: 6, studentId: 3, date: '2026-02-20', sessionName: 'TO #2', tps: 560, literasi: 580, numerasi: 530, total: 1670 },
];

const INIT_NEWS = [
  { id: 1, title: 'Olimpiade Sains Nasional (OSN) 2026', category: 'Lomba Eksternal', content: 'Pendaftaran OSN tingkat sekolah dibuka hingga 30 Juni 2026. Segera daftarkan dirimu!', date: '2026-05-26', deadline: '2026-06-30', imageUrl: null, source: 'admin', pinned: false },
  { id: 2, title: 'Panduan Penggunaan Portal AKTIVA', category: 'Kegiatan Sekolah', content: 'Seluruh siswa diwajibkan melengkapi portofolio kegiatan semester ini melalui platform AKTIVA.', date: '2026-05-25', deadline: null, imageUrl: null, source: 'admin', pinned: true },
];

// ============================================================
// KOMPONEN PEMBANTU (DITARUH DI LUAR FUNGSI APP BIAR FOKUS KURSOR GAK LEPAS!)
// ============================================================

const InputField = ({ label, type = "text", value, onChange, placeholder, error, readOnly = false, C, isDarkMode }) => (
  <div style={{ marginBottom: '14px', width: '100%' }}>
    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: C.text }}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      readOnly={readOnly}
      style={{ 
        width: '100%', padding: '10px 14px', borderRadius: '8px', 
        border: `1px solid ${error ? C.danger : C.border}`, 
        background: readOnly ? (isDarkMode ? '#0F172A' : '#F5F0EB') : C.card,
        color: readOnly ? C.stone : C.text, 
        fontSize: '14px', outline: 'none', 
        transition: 'border 0.2s, background 0.2s, color 0.2s', 
        fontFamily: 'inherit', boxSizing: 'border-box',
        cursor: readOnly ? 'not-allowed' : 'text'
      }} 
    />
    {error && <div style={{ color: C.danger, fontSize: '12px', marginTop: '4px' }}>{error}</div>}
  </div>
);

const SidebarItem = ({ id, icon, label, badge, activeTab, setActiveTab, C }) => {
  const isActive = activeTab === id;
  return (
    <button 
      onClick={() => setActiveTab(id)} 
      style={{ 
        width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', 
        background: isActive ? C.accent : 'transparent', 
        color: isActive ? '#fff' : '#A0AAB5', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.2s', textAlign: 'left'
      }}
      onMouseOver={e => { if(!isActive) { e.currentTarget.style.background = C.sidebarHover; e.currentTarget.style.color = '#fff'; } }}
      onMouseOut={e => { if(!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0AAB5'; } }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon} {label}
      </span>
      {badge > 0 && (
        <span style={{ background: C.danger, color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '20px' }}>
          {badge}
        </span>
      )}
    </button>
  );
};

const StatusBadge = ({ status, C, isDarkMode }) => {
  const map = {
    approved: { bg: C.successLight, color: C.success, text: 'Disetujui' },
    pending: { bg: C.warningLight, color: C.warning, text: 'Menunggu' },
    draft: { bg: isDarkMode ? '#334155' : '#E2E8F0', color: isDarkMode ? '#CBD5E1' : '#64748B', text: 'Draf' },
    active: { bg: C.successLight, color: C.success, text: 'Aktif' }
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ padding: '4px 10px', borderRadius: '6px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: '700' }}>
      {s.text}
    </span>
  );
};

const StatCard = ({ title, value, icon, bg, C, trend }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card, padding: '22px', borderRadius: '20px',
        border: `1px solid ${hovered ? C.accent + '55' : C.border}`,
        display: 'flex', flexDirection: 'column', gap: '14px',
        boxShadow: hovered ? '0 10px 28px -8px rgba(46,125,140,0.18)' : '0 1px 3px rgba(15,23,42,0.03)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.22s ease', cursor: 'default',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '13px', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.22s ease',
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
            background: trend.up ? C.successLight : C.dangerLight,
            color: trend.up ? C.success : C.danger,
          }}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '12.5px', color: C.stone, fontWeight: '600', marginBottom: '5px', letterSpacing: '0.2px' }}>{title}</div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: C.text, letterSpacing: '-0.5px' }}>{value}</div>
      </div>
    </div>
  );
};

const ToastComponent = ({ toast, C }) => (
  <div style={{
    position: 'fixed', top: toast.show ? '20px' : '-100px', left: '50%', transform: 'translateX(-50%)',
    background: toast.type === 'success' ? C.successLight : C.dangerLight,
    border: `1px solid ${toast.type === 'success' ? C.success : C.danger}`,
    color: toast.type === 'success' ? C.success : C.danger,
    padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'top 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)', zIndex: 9999,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }}>
    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
    <span style={{ fontWeight: '600', fontSize: '13px' }}>{toast.message}</span>
  </div>
);


export default function App() {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => loadFromStorage('aktiva_theme_dark', false));
  const C = isDarkMode ? DARK_THEME : LIGHT_THEME; // Dynamic Theme Colors

  // --- STYLING BANTUAN ---
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: '14px', outline: 'none', transition: 'border 0.2s, background 0.2s, color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: C.text };
  const btnStyle = (bg, size='md') => ({ background: bg, color: '#fff', border: 'none', padding: size === 'xs' ? '6px 12px' : size === 'sm' ? '8px 16px' : '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: size === 'xs' ? '11px' : size === 'sm' ? '13px' : '14px', transition: 'opacity 0.2s' });

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers]             = useState(() => loadFromStorage('aktiva_users', INIT_USERS));
  const [activities, setActivities]   = useState(() => loadFromStorage('aktiva_activities', INIT_ACTIVITIES));
  const [grades, setGrades]           = useState(() => loadFromStorage('aktiva_grades', INIT_GRADES));
  const [news, setNews]               = useState(() => loadFromStorage('aktiva_news', INIT_NEWS));
  const [columns]                     = useState(['Tugas 1', 'Tugas 2', 'UTS', 'UAS']);
  const [customColumns, setCustomColumns] = useState(() => loadFromStorage('aktiva_custom_cols', {}));
  const [newColName, setNewColName]   = useState('');
  
  // State News Admin
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCat, setNewsCat] = useState('Lomba Eksternal');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState(null);
  const [newsImageName, setNewsImageName] = useState('');
  const newsImgRef = useRef(null);
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab]     = useState('dashboard');
  const [searchUser, setSearchUser]   = useState('');
  const [searchRapor, setSearchRapor] = useState('');
  const [searchNilaiGuru, setSearchNilaiGuru] = useState('');
  const [dashboardChartClass, setDashboardChartClass] = useState('');
  const [editColModal, setEditColModal] = useState(false);
  const [renameColDraft, setRenameColDraft] = useState({});

  // Auth state
  const [nip, setNip]                 = useState('');
  const [password, setPassword]       = useState('');
  const [loginError, setLoginError]   = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regRole, setRegRole]         = useState('siswa');
  const [regNip, setRegNip]           = useState('');
  const [regName, setRegName]         = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSchoolCode, setRegSchoolCode] = useState('');
  const [regErrors, setRegErrors]     = useState({});

  // Profile Edit State (Self)
  const [editNip, setEditNip]         = useState('');
  const [editName, setEditName]       = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Admin / Operator Editing User State
  const [adminEditUser, setAdminEditUser] = useState(null); 
  const [adminEditErrors, setAdminEditErrors] = useState({});

  // Admin state
  const [approvalData, setApprovalData]   = useState({});
  const [manageUserType, setManageUserType] = useState('siswa');

  // UI state
  const [showNotif, setShowNotif]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [toast, setToast]             = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); 
  const [rejectNote, setRejectNote]   = useState('');
  const [editModal, setEditModal]     = useState(null);

  // Form portofolio state
  const [newActTitle, setNewActTitle]       = useState('');
  const [newActCategory, setNewActCategory] = useState('Kompetisi');
  const [newActLevel, setNewActLevel]       = useState('Sekolah');
  const [newActRole, setNewActRole]         = useState('Peserta');
  const [newActOrganizer, setNewActOrganizer] = useState('Swasta');
  const [newActFileName, setNewActFileName] = useState('');
  const [newActFileUrl, setNewActFileUrl]   = useState(null);
  const [newActLink, setNewActLink]         = useState('');
  const fileInputRef = useRef(null);

  // News deadline state (admin)
  const [newsDeadline, setNewsDeadline] = useState('');

  // Siswa: usulan modal
  const [usulanModal, setUsulanModal] = useState(false);
  const [usulanForm, setUsulanForm] = useState({ title: '', category: 'Lomba Eksternal', content: '', deadline: '' });

  // Arsip view state
  const [showArsip, setShowArsip] = useState(false);

  // AI Future Path state — siap untuk injeksi API
  const [futurePathData, setFuturePathData] = useState({ cita: '', minat: '', skill: '', kekuatan: '' });
  const [futurePathLoading, setFuturePathLoading] = useState(false);
  const [futurePathResult, setFuturePathResult] = useState(null);

  // Try Out UTBK
  const [tryouts, setTryouts] = useState(() => loadFromStorage('aktiva_tryouts', INIT_TRYOUTS));
  const [tryoutForm, setTryoutForm] = useState({ sessionName: '', date: new Date().toISOString().split('T')[0], rows: {} });

  // Siswa: filter semester untuk halaman Nilai
  const [siswaSemester, setSiswaSemester] = useState('Sem 3');

  // Publish workflow nilai — 2-step verification
  const [publishConfirm, setPublishConfirm] = useState(null); // { className, semester, step }

  useEffect(() => { saveToStorage('aktiva_tryouts', tryouts); }, [tryouts]);


  // Persist ke localStorage
  useEffect(() => { if (users.length) saveToStorage('aktiva_users', users); }, [users]);
  useEffect(() => { if (activities.length) saveToStorage('aktiva_activities', activities); }, [activities]);
  useEffect(() => { if (grades.length) saveToStorage('aktiva_grades', grades); }, [grades]);
  useEffect(() => { if (news.length) saveToStorage('aktiva_news', news); }, [news]);
  useEffect(() => { saveToStorage('aktiva_custom_cols', customColumns); }, [customColumns]);
  useEffect(() => { saveToStorage('aktiva_theme_dark', isDarkMode); }, [isDarkMode]);

  // Sync poin user dari approved activities
  useEffect(() => {
    setUsers(prev => prev.map(u => {
      if (u.role !== 'siswa') return u;
      const totalPoin = activities.filter(a => a.studentId === u.id && a.status === 'approved').reduce((sum, a) => sum + (a.points || 0), 0);
      return { ...u, points: totalPoin };
    }));
  }, [activities]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // ---- AUTH ----
  const handleLogout = () => { setCurrentUser(null); setNip(''); setPassword(''); setActiveTab('dashboard'); setSelectedClass(null); setShowNotif(false); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!nip.trim()) return setLoginError('Mohon isi NIP/NPM!');
    if (!password.trim()) return setLoginError('Mohon isi password!');
    const user = users.find(u => u.nip === nip.trim() && u.password === password);
    if (!user) return setLoginError('NIP/NPM atau Password salah.');
    if (user.status === 'pending') return setLoginError('Akun belum di-approve Admin Sekolah.');
    
    setCurrentUser(user); 
    setLoginError(''); 
    setNip(''); 
    setPassword('');
    setEditNip(user.nip);
    setEditName(user.name);
    setEditPassword(user.password);
    showToast(`Selamat datang, ${user.name}!`, 'success');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const err = {};
    if (!regName.trim()) err.name = 'Nama harus diisi!';
    if (regNip.trim().length < 5) err.nip = 'NIP/NPM minimal 5 karakter!';
    if (users.some(u => u.nip === regNip.trim())) err.nip = 'NIP/NPM sudah terdaftar!';
    if (!regPassword.trim() || regPassword.length < 6) err.password = 'Password minimal 6 karakter!';
    if (regPassword !== regPasswordConfirm) err.passwordConfirm = 'Password tidak cocok!';
    if (regSchoolCode !== MOCK_SCHOOL_CODE) err.code = `Kode tidak valid! (Hint: ${MOCK_SCHOOL_CODE})`;
    
    if (Object.keys(err).length) return setRegErrors(err);

    const newUser = { 
      id: Math.max(...users.map(u => u.id)) + 1, 
      role: regRole, 
      nip: regNip.trim(), 
      password: regPassword, 
      name: regName.trim(), 
      status: 'pending', 
      isWaliKelas: false, 
      className: regRole === 'siswa' ? 'XI-MIPA-1' : null, 
      points: 0, 
      spamCount: 0 
    };

    setUsers([...users, newUser]);
    setIsRegistering(false);
    setLoginError('✓ Registrasi berhasil! Menunggu approval Admin Sekolah.');
    setRegNip(''); setRegName(''); setRegPassword(''); setRegPasswordConfirm(''); setRegSchoolCode(''); setRegErrors({});
    showToast('Registrasi sukses! Menunggu verifikasi admin.', 'success');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return showToast('Nama tidak boleh kosong!', 'error');
    if (editNip.trim().length < 5) return showToast('NIP/NPM minimal 5 karakter!', 'error');
    if (!editPassword.trim() || editPassword.length < 3) return showToast('Password minimal 3 karakter!', 'error');

    if (users.some(u => u.nip === editNip.trim() && u.id !== currentUser.id)) {
      return showToast('NIP/NPM sudah digunakan oleh akun lain!', 'error');
    }

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        const updated = { ...u, name: editName.trim(), nip: editNip.trim(), password: editPassword };
        setCurrentUser(updated);
        return updated;
      }
      return u;
    });

    setUsers(updatedUsers);
    showToast('Profil dan akun berhasil diperbarui!', 'success');
  };

  const handleUpdatePasswordSiswa = (e) => {
    e.preventDefault();
    if (!editPassword.trim() || editPassword.length < 3) return showToast('Password minimal 3 karakter!', 'error');

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, password: editPassword };
      }
      return u;
    });

    setUsers(updatedUsers);
    setCurrentUser({ ...currentUser, password: editPassword });
    showToast('Password kamu berhasil diperbarui!', 'success');
  };

  // ---- OPERATOR (ADMIN) USER & NEWS MANAGEMENT ----
  const handleApproveUser = (userId, role) => {
    let upd = { status: 'active' };
    if (role === 'guru') { const d = approvalData[userId] || {}; upd = { ...upd, ...d }; }
    setUsers(users.map(u => u.id === userId ? { ...u, ...upd } : u));
    showToast('Pengguna disetujui.', 'success');
  };

  const handleAdminUpdateUser = (e) => {
    e.preventDefault();
    const err = {};
    if (!adminEditUser.name.trim()) err.name = 'Nama harus diisi!';
    if (adminEditUser.nip.trim().length < 4) err.nip = 'Username/NIP minimal 4 karakter!';
    if (users.some(u => u.nip === adminEditUser.nip.trim() && u.id !== adminEditUser.id)) {
      err.nip = 'NIP/Username ini sudah digunakan!';
    }
    if (!adminEditUser.password.trim() || adminEditUser.password.length < 3) {
      err.password = 'Password minimal 3 karakter!';
    }

    if (Object.keys(err).length) return setAdminEditErrors(err);

    setUsers(users.map(u => u.id === adminEditUser.id ? { ...adminEditUser } : u));
    if (adminEditUser.id === currentUser.id) { setCurrentUser(adminEditUser); }

    setAdminEditUser(null); setAdminEditErrors({});
    showToast('User berhasil dimodifikasi oleh Admin!', 'success');
  };

  const handleAddNews = () => {
    if (!newsTitle.trim()) return showToast('Judul pengumuman harus diisi!', 'error');
    if (!newsContent.trim()) return showToast('Isi pengumuman tidak boleh kosong!', 'error');
    
    const newEntry = { 
      id: Date.now(), 
      title: newsTitle.trim(), 
      category: newsCat, 
      content: newsContent.trim(), 
      date: new Date().toISOString().split('T')[0], 
      deadline: newsDeadline || null,
      imageUrl: newsImageUrl,
      source: 'admin',
      pinned: false
    };
    
    setNews([newEntry, ...news]);
    setNewsTitle(''); setNewsContent(''); setNewsImageUrl(null); setNewsImageName(''); setNewsDeadline('');
    if(newsImgRef.current) newsImgRef.current.value = '';
    showToast('Pengumuman berhasil diposting!', 'success');
  };

  const handleTogglePin = (id) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    const target = news.find(n => n.id === id);
    showToast(target?.pinned ? 'Kegiatan dilepas dari pin.' : 'Kegiatan disematkan ke dashboard siswa!', 'success');
  };

  // ---- USULAN SISWA (struktur siap inject API eksternal nanti) ----
  const handleAddUsulan = () => {
    if (!usulanForm.title.trim() || !usulanForm.content.trim()) {
      return showToast('Judul dan deskripsi usulan wajib diisi!', 'error');
    }
    const newEntry = {
      id: Date.now(),
      title: usulanForm.title.trim(),
      category: usulanForm.category,
      content: usulanForm.content.trim(),
      date: new Date().toISOString().split('T')[0],
      deadline: usulanForm.deadline || null,
      imageUrl: null,
      source: 'usulan',
      proposedBy: currentUser.name,
    };
    setNews([newEntry, ...news]);
    setUsulanModal(false);
    setUsulanForm({ title: '', category: 'Lomba Eksternal', content: '', deadline: '' });
    showToast('Usulanmu terkirim ke admin sekolah!', 'success');
  };

  // ---- AI FUTURE PATH — placeholder, structure ready for API injection ----
  const handleGenerateFuturePath = async () => {
    if (!futurePathData.cita.trim() && !futurePathData.minat.trim()) {
      return showToast('Isi minimal cita-cita atau bidang minatmu!', 'error');
    }
    setFuturePathLoading(true);
    setFuturePathResult(null);
    // TODO: Ganti blok ini dengan fetch ke endpoint AI nanti.
    // const res = await fetch('/api/future-path', { method: 'POST', body: JSON.stringify({ ...futurePathData, profile: { points: currentUser.points, grades: getGradeInsights(currentUser.id) } }) });
    // const data = await res.json();
    setTimeout(() => {
      const insights = getGradeInsights(currentUser.id);
      const top = insights[insights.length - 1];
      setFuturePathResult({
        ringkasan: `Berdasarkan profil akademik & minatmu (${futurePathData.minat || futurePathData.cita}), AI Future Path merekomendasikan jalur berikut. Hasil ini adalah pratinjau — integrasi AI lengkap menyusul.`,
        rekomendasiJurusan: [
          { jurusan: 'Teknik Informatika', alasan: `Sesuai dengan minatmu di "${futurePathData.minat || 'teknologi'}" dan kekuatan analitismu.`, match: 92 },
          { jurusan: 'Sistem Informasi', alasan: 'Kombinasi teknologi & manajemen, cocok untuk industri startup.', match: 85 },
          { jurusan: 'Data Science', alasan: top ? `Nilai ${top.subject} kuat (${top.avg}) — modal awal yang bagus.` : 'Bidang masa depan dengan permintaan tinggi.', match: 80 },
        ],
        rekomendasiKampus: [
          { kampus: 'Institut Teknologi Bandung', kota: 'Bandung', alasan: 'Top di Teknik & Sains, ekosistem riset kuat.' },
          { kampus: 'Universitas Indonesia', kota: 'Depok', alasan: 'Kurikulum Ilkom kuat, networking luas.' },
          { kampus: 'Universitas Gadjah Mada', kota: 'Yogyakarta', alasan: 'Pilihan multi-disiplin & biaya hidup terjangkau.' },
        ],
        nextSteps: [
          'Konsisten tambah portofolio kompetisi (target +50 poin semester ini).',
          'Ikut bootcamp/komunitas sesuai minat (coding club / robotik).',
          'Persiapkan SNBT — fokus penalaran kuantitatif & literasi.',
        ],
      });
      setFuturePathLoading(false);
    }, 900);
  };

  // ---- PORTOFOLIO ----
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewActFileName(file.name); setNewActFileUrl(URL.createObjectURL(file)); }
  };

  const handleAddPortfolio = (e) => {
    e.preventDefault();
    if (!newActTitle.trim()) return showToast('Nama kegiatan harus diisi!', 'error');
    if (!newActFileUrl) return showToast('Upload sertifikat terlebih dahulu!', 'error');
    
    const pts = calculatePoints(newActLevel, newActRole, newActOrganizer);
    const act = { id: Date.now(), studentId: currentUser.id, title: newActTitle, category: newActCategory, level: newActLevel, role: newActRole, organizer: newActOrganizer, points: pts, status: 'draft', fileUrl: newActFileUrl, fileName: newActFileName, proofLink: newActLink.trim() || null, note: '' };
    
    setActivities([act, ...activities]);
    setNewActTitle(''); setNewActFileName(''); setNewActFileUrl(null); setNewActCategory('Kompetisi'); setNewActLevel('Sekolah'); setNewActRole('Peserta'); setNewActOrganizer('Swasta'); setNewActLink('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    showToast(`Draf disimpan! Estimasi poin: +${pts}`, 'success');
  };

  const handleSendDraft = (id) => {
    setActivities(activities.map(a => a.id === id ? { ...a, status: 'pending', note: '' } : a));
    showToast('Aktivitas dikirim untuk validasi!', 'success');
  };

  const handleCancelDraft = (id) => { 
    setConfirmDialog({
      message: 'Apakah Anda yakin ingin menghapus draf ini?',
      onConfirm: () => {
        setActivities(activities.filter(a => a.id !== id));
        setConfirmDialog(null);
        showToast('Draf berhasil dihapus.', 'success');
      }
    });
  };

  // ---- VERIFIKASI WALI KELAS ----
  const handleApproveActivity = (act) => {
    setActivities(prev => prev.map(a => a.id === act.id ? { ...a, status: 'approved', points: calculatePoints(a.level, a.role, a.organizer), note: '' } : a));
    showToast('Aktivitas disetujui!', 'success');
  };

  const handleRejectActivity = (actId) => {
    if (!rejectNote.trim()) return showToast('Mohon isi catatan penolakan!', 'error');
    setActivities(prev => prev.map(a => a.id === actId ? { ...a, status: 'draft', note: rejectNote } : a));
    setRejectModal(null); setRejectNote('');
    showToast('Aktivitas ditolak dan dikembalikan ke siswa.', 'success');
  };

  const handleSaveEditClassification = () => {
    if (!editModal) return;
    const pts = calculatePoints(editModal.level, editModal.role, editModal.organizer);
    setActivities(prev => prev.map(a => a.id === editModal.id ? { ...a, level: editModal.level, role: editModal.role, organizer: editModal.organizer, points: pts } : a));
    setEditModal(null);
    showToast('Klasifikasi berhasil dikoreksi.', 'success');
  };

  // ---- HELPERS & GETTERS ----
  const getColumnsForGuru = (nip) => customColumns[nip] || columns;

  const isWaliKelas  = currentUser?.role === 'guru' && currentUser.isWaliKelas;
  const pendingCount = isWaliKelas ? activities.filter(a => a.status === 'pending' && users.find(u => u.id === a.studentId)?.className === currentUser.waliClass).length : 0;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  const getGradeInsights = (studentId) => {
    const sg = grades.filter(g => g.studentId === studentId);
    return sg.map(g => {
      const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
      const avg = vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
      return { subject: g.subject, avg };
    }).filter(g => g.avg !== null).sort((a, b) => a.avg - b.avg);
  };

  const getChartData = (studentId) => {
    const sg = grades.filter(g => g.studentId === studentId);
    if (!sg.length) return [{ semester: 'Sem 1', rataRata: 0 }];
    const avg = sg.reduce((sum, g) => {
      const vals = Object.values(g.tasks).filter(v => v !== null);
      return sum + (vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0);
    }, 0) / sg.length;
    return [{ semester: sg[0]?.semester || 'Sem 1', rataRata: Math.round(avg) }];
  };

  // ============================================================
  // VIEW: AUTHENTICATION
  // ============================================================
  if (!currentUser) {
    const loginBg = isDarkMode
      ? `radial-gradient(circle at 15% 20%, ${C.accent}33 0%, transparent 40%), radial-gradient(circle at 85% 80%, ${C.accentMid}25 0%, transparent 45%), linear-gradient(135deg, #0B1120 0%, #0F172A 50%, #1E293B 100%)`
      : `radial-gradient(circle at 15% 20%, ${C.accent}25 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${C.warning}20 0%, transparent 45%), linear-gradient(135deg, #F5F0EB 0%, #FDFAF7 50%, #E8F4F6 100%)`;
    return (
      <div style={{ minHeight: '100vh', background: loginBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
        <ToastComponent toast={toast} C={C} />

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '380px', height: '380px', borderRadius: '50%', background: `radial-gradient(circle, ${C.accent}40 0%, transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-150px', right: '-100px', width: '420px', height: '420px', borderRadius: '50%', background: `radial-gradient(circle, ${C.accentMid}35 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${isDarkMode ? C.warning + '20' : C.warning + '25'} 0%, transparent 70%)`, filter: 'blur(35px)', pointerEvents: 'none' }} />

        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: isDarkMode ? 0.04 : 0.05, backgroundImage: `linear-gradient(${C.text} 1px, transparent 1px), linear-gradient(90deg, ${C.text} 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${C.border}`, borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            {isDarkMode ? <Sun size={20} color={C.warning} /> : <Moon size={20} color={C.stone} />}
          </button>
        </div>

        <div style={{
          background: isDarkMode ? 'rgba(30,41,59,0.85)' : 'rgba(253,250,247,0.92)',
          backdropFilter: 'blur(20px)',
          padding: '44px 40px',
          borderRadius: '24px',
          boxShadow: isDarkMode ? '0 25px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' : '0 25px 60px -15px rgba(46,125,140,0.25), 0 0 0 1px rgba(255,255,255,0.6)',
          width: '100%',
          maxWidth: '460px',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)'}`,
          position: 'relative',
          zIndex: 5,
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{ width: '72px', height: '72px', background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 14px 30px -8px ${C.accent}80, inset 0 1px 0 rgba(255,255,255,0.25)` }}>
              <Activity size={38} color="#fff" />
            </div>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', color: C.text, margin: '0 0 4px', letterSpacing: '-0.5px', background: `linear-gradient(135deg, ${C.text}, ${C.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AKTIVA</h1>
          <p style={{ textAlign: 'center', color: C.stone, marginBottom: '28px', fontSize: '13.5px', fontWeight: '500' }}>Platform Portofolio & Akademik Sekolah</p>

          {loginError && (
            <div style={{ padding: '12px 14px', borderRadius: '12px', marginBottom: '16px', background: loginError.includes('✓') ? C.successLight : C.dangerLight, color: loginError.includes('✓') ? C.success : C.danger, fontSize: '13px', fontWeight: '600', textAlign: 'center', border: `1px solid ${loginError.includes('✓') ? C.success + '40' : C.danger + '40'}` }}>
              {loginError}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <InputField label="NIP / NPM (Username)" value={nip} onChange={e => setNip(e.target.value)} placeholder="Masukkan NIP atau NPM" C={C} isDarkMode={isDarkMode} />
              <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" C={C} isDarkMode={isDarkMode} />
              <button type="submit" style={{...btnStyle(C.accent), justifyContent:"center", width:"100%", padding: '14px', fontSize: '14px', background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`, boxShadow: `0 10px 25px -8px ${C.accent}90`}}>Masuk ke Dashboard</button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: C.stone, margin: '4px 0 0' }}>Belum punya akun? <span onClick={() => { setIsRegistering(true); setLoginError(''); }} style={{ color: C.accent, fontWeight: '700', cursor: 'pointer' }}>Daftar di sini</span></p>
              <div style={{ marginTop: '8px', padding: '14px', background: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(245,240,235,0.6)', border: `1px dashed ${C.border}`, borderRadius: '12px', fontSize: '11px', color: C.textMuted, textAlign: 'center', lineHeight: '1.7' }}>
                <strong style={{ color: C.text }}>Demo Logins</strong><br/>
                Admin: <code style={{background: C.accentLight, color: C.accent, padding: '1px 6px', borderRadius: '4px'}}>admin/123</code> · Siswa: <code style={{background: C.accentLight, color: C.accent, padding: '1px 6px', borderRadius: '4px'}}>123456/123</code><br/>
                Guru: <code style={{background: C.accentLight, color: C.accent, padding: '1px 6px', borderRadius: '4px'}}>G01/123</code> · Kode Sekolah: <strong>{MOCK_SCHOOL_CODE}</strong>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: '10px', marginBottom: '5px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight: 800, color: C.text, fontSize: '15px' }}>Buat Akun Baru</span>
                <span onClick={() => { setIsRegistering(false); setRegErrors({}); }} style={{ color: C.accent, fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Kembali ke Login</span>
              </div>

              <div>
                <label style={labelStyle}>Mendaftar Sebagai</label>
                <select value={regRole} onChange={e => setRegRole(e.target.value)} style={inputStyle}>
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru / Wali Kelas</option>
                </select>
              </div>

              <InputField label="Nama Lengkap" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nama Lengkap Anda" error={regErrors.name} C={C} isDarkMode={isDarkMode} />
              <InputField label="NIP / NPM (Untuk Login)" value={regNip} onChange={e => setRegNip(e.target.value)} placeholder="Minimal 5 Karakter" error={regErrors.nip} C={C} isDarkMode={isDarkMode} />
              <InputField label="Password Akun Baru" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password Akun Anda" error={regErrors.password} C={C} isDarkMode={isDarkMode} />
              <InputField label="Kode Validasi Sekolah" value={regSchoolCode} onChange={e => setRegSchoolCode(e.target.value)} placeholder="Contoh: AKT-2026-X" error={regErrors.code} C={C} isDarkMode={isDarkMode} />
              <InputField label="Konfirmasi Password" type="password" value={regPasswordConfirm} onChange={e => setRegPasswordConfirm(e.target.value)} placeholder="Ulangi password kamu" error={regErrors.passwordConfirm} C={C} isDarkMode={isDarkMode} />

              <button type="submit" style={{...btnStyle(C.success), justifyContent:"center", width:"100%", marginTop: '10px', padding: '14px', background: `linear-gradient(135deg, ${C.success}, ${C.accent})`, boxShadow: `0 10px 25px -8px ${C.success}90`}}>Daftar Sekarang</button>
              <button type="button" onClick={() => { setIsRegistering(false); setRegErrors({}); }} style={{ background: 'none', border: 'none', color: C.accent, fontWeight: '600', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                Sudah punya akun? Login disini
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }


  // ============================================================
  // TAB RENDERING
  // ============================================================
  // ---------- TRY OUT UTBK ----------
  const renderTryoutSiswa = () => {
    const myTo = tryouts.filter(t => t.studentId === currentUser.id).sort((a,b) => a.date.localeCompare(b.date));
    const cardStyle = { background: C.card, padding: '24px', borderRadius: '20px', border: `1px solid ${C.border}` };
    const last = myTo[myTo.length - 1];
    const prev = myTo[myTo.length - 2];
    const delta = last && prev ? last.total - prev.total : 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>Try Out UTBK</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <StatCard title="Skor Terbaru" value={last?.total || '-'} icon={<Trophy size={22} color={C.accent}/>} bg={C.accentLight} C={C} />
          <StatCard title="Perubahan" value={delta > 0 ? `+${delta}` : delta || '-'} icon={<TrendingUp size={22} color={delta >= 0 ? C.success : C.danger}/>} bg={delta >= 0 ? C.successLight : C.dangerLight} C={C} />
          <StatCard title="Total Sesi TO" value={myTo.length} icon={<Activity size={22} color={C.accent}/>} bg={C.accentLight} C={C} />
        </div>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: C.text }}>Perkembangan Skor Try Out</h3>
          {myTo.length ? (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={myTo} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                  <XAxis dataKey="sessionName" tick={{ fontSize: 11, fill: C.stone }} />
                  <YAxis tick={{ fontSize: 11, fill: C.stone }} />
                  <RechartsTooltip contentStyle={{ background: C.card, borderColor: C.border, color: C.text, borderRadius: 10 }} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: C.text }} />
                  <Line type="monotone" dataKey="tps" stroke={C.accent} strokeWidth={2} dot={{ r: 4 }} name="TPS" />
                  <Line type="monotone" dataKey="literasi" stroke={C.success} strokeWidth={2} dot={{ r: 4 }} name="Literasi" />
                  <Line type="monotone" dataKey="numerasi" stroke={C.warning} strokeWidth={2} dot={{ r: 4 }} name="Numerasi" />
                  <Line type="monotone" dataKey="total" stroke={C.danger} strokeWidth={3} dot={{ r: 5 }} name="Total" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Wali kelas belum menginput skor TO kamu.</div>
          )}
        </div>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: C.text }}>Riwayat Sesi</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                <tr>
                  {['Sesi','Tanggal','TPS','Literasi','Numerasi','Total'].map(h => <th key={h} style={{ padding: '12px 14px', fontSize: '12px', color: C.stone }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {myTo.map(t => (
                  <tr key={t.id}>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, color: C.text }}>{t.sessionName}</td>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, color: C.stone }}>{t.date}</td>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.tps}</td>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.literasi}</td>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.numerasi}</td>
                    <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>{t.total}</td>
                  </tr>
                ))}
                {!myTo.length && <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: C.textMuted }}>Belum ada sesi TO.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTryoutWali = () => {
    const cardStyle = { background: C.card, padding: '24px', borderRadius: '20px', border: `1px solid ${C.border}` };
    const waliStudents = users.filter(u => u.role === 'siswa' && u.className === currentUser.waliClass);
    const handleSaveTryout = () => {
      if (!tryoutForm.sessionName.trim()) return showToast('Nama sesi wajib diisi.', 'error');
      const newRows = [];
      Object.entries(tryoutForm.rows).forEach(([sid, scores]) => {
        const tps = parseInt(scores.tps) || 0;
        const lit = parseInt(scores.literasi) || 0;
        const num = parseInt(scores.numerasi) || 0;
        if (tps || lit || num) {
          newRows.push({ id: Date.now() + Math.random(), studentId: parseInt(sid), date: tryoutForm.date, sessionName: tryoutForm.sessionName.trim(), tps, literasi: lit, numerasi: num, total: tps + lit + num });
        }
      });
      if (!newRows.length) return showToast('Isi minimal satu nilai siswa.', 'error');
      setTryouts(prev => [...prev, ...newRows]);
      setTryoutForm({ sessionName: '', date: new Date().toISOString().split('T')[0], rows: {} });
      showToast(`${newRows.length} skor TO tersimpan.`, 'success');
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>Input Try Out UTBK · Kelas {currentUser.waliClass}</h2>
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nama Sesi (mis. TO #5)</label>
              <input style={inputStyle} value={tryoutForm.sessionName} onChange={e => setTryoutForm({ ...tryoutForm, sessionName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Tanggal</label>
              <input type="date" style={inputStyle} value={tryoutForm.date} onChange={e => setTryoutForm({ ...tryoutForm, date: e.target.value })} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                <tr>
                  {['Nama Siswa','TPS','Literasi','Numerasi'].map(h => <th key={h} style={{ padding: '10px 12px', fontSize: '12px', color: C.stone, textAlign: 'left' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {waliStudents.map(s => {
                  const row = tryoutForm.rows[s.id] || {};
                  const set = (k, v) => setTryoutForm({ ...tryoutForm, rows: { ...tryoutForm.rows, [s.id]: { ...row, [k]: v } } });
                  return (
                    <tr key={s.id}>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, color: C.text }}>{s.name}</td>
                      {['tps','literasi','numerasi'].map(k => (
                        <td key={k} style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
                          <input type="number" value={row[k] || ''} onChange={e => set(k, e.target.value)} style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: `1px solid ${C.border}`, background: C.card, color: C.text }} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button onClick={handleSaveTryout} style={btnStyle(C.accent)}><Plus size={16}/> Simpan Sesi TO</button>
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: C.text }}>Riwayat TO Kelas</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                <tr>{['Siswa','Sesi','Tanggal','TPS','Lit','Num','Total',''].map(h => <th key={h} style={{ padding: '10px 12px', fontSize: '12px', color: C.stone, textAlign: 'left' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {tryouts.filter(t => waliStudents.some(s => s.id === t.studentId)).sort((a,b)=>b.date.localeCompare(a.date)).map(t => {
                  const s = users.find(u => u.id === t.studentId);
                  return (
                    <tr key={t.id}>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{s?.name}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.sessionName}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.stone }}>{t.date}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.tps}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.literasi}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{t.numerasi}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, color: C.accent, fontWeight: 700 }}>{t.total}</td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
                        <button onClick={() => setTryouts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'transparent', border: 'none', color: C.danger, cursor: 'pointer' }}><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {

    // ---- Data turunan untuk grafik (dashboard only) ----
    const myActivities = currentUser.role === 'siswa'
      ? activities.filter(a => a.studentId === currentUser.id) : [];
    const approvedCount = myActivities.filter(a => a.status === 'approved').length;
    const pendingMine   = myActivities.filter(a => a.status === 'pending').length;
    const rejectedMine  = myActivities.filter(a => a.status === 'rejected').length;

    // Poin per tingkat (Bar)
    const LEVELS = ['Sekolah', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'];
    const pointsByLevel = LEVELS.map(lv => ({
      level: lv,
      poin: myActivities.filter(a => a.level === lv && a.status === 'approved').reduce((s, a) => s + (a.points || 0), 0),
    }));

    // Distribusi status (Pie)
    const statusDist = [
      { name: 'Disetujui', value: approvedCount, fill: C.success },
      { name: 'Menunggu',  value: pendingMine,   fill: C.warning },
      { name: 'Ditolak',   value: rejectedMine,  fill: C.danger },
    ].filter(d => d.value > 0);

    // Tren nilai per mata pelajaran (Area) — pakai grades semua mapel siswa
    const subjectAvg = grades
      .filter(g => g.studentId === currentUser.id)
      .map(g => {
        const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
        return { subject: g.subject, rata: vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : 0 };
      });

    // Progress milestone — sistem bintang, 1 bintang = 50 poin, tanpa batas maksimal
    const POIN_PER_BINTANG = 50;
    const pts = currentUser.points || 0;
    const fullStars = Math.floor(pts / POIN_PER_BINTANG);
    const currentCycleStart = fullStars * POIN_PER_BINTANG;
    const progressPct = Math.min(100, Math.round(((pts - currentCycleStart) / POIN_PER_BINTANG) * 100));
    const nextStarPoin = currentCycleStart + POIN_PER_BINTANG;
    // Tampilkan 5 slot bintang per "baris", looping terus tanpa batas (mod 5 untuk display)
    const starsInCurrentRow = fullStars % 5;
    const rowNumber = Math.floor(fullStars / 5) + 1;

    // Admin: tren registrasi (mock dari users yg ada — semua dihitung "bulan ini")
    const adminStats = {
      siswa: users.filter(u => u.role === 'siswa').length,
      guru:  users.filter(u => u.role === 'guru').length,
      admin: users.filter(u => u.role === 'admin').length,
      pending: users.filter(u => u.status === 'pending').length,
    };
    const adminRoleDist = [
      { name: 'Siswa', value: adminStats.siswa, fill: C.accent },
      { name: 'Guru',  value: adminStats.guru,  fill: C.success },
      { name: 'Admin', value: adminStats.admin, fill: C.warning },
    ];
    const allApproved = activities.filter(a => a.status === 'approved');
    const adminPointsByLevel = LEVELS.map(lv => ({
      level: lv,
      jumlah: allApproved.filter(a => a.level === lv).length,
    }));

    // Guru: distribusi nilai (pilih kelas)
    const guruClassOptions = currentUser.role === 'guru'
      ? Array.from(new Set([...(currentUser.classesTaught || []), currentUser.waliClass].filter(Boolean)))
      : [];
    const chartClass = dashboardChartClass || guruClassOptions[0] || '';
    const chartStudents = users.filter(u => u.role === 'siswa' && u.className === chartClass);
    const buckets = [
      { range: '<60', min: 0, max: 59, fill: C.danger },
      { range: '60-69', min: 60, max: 69, fill: C.warning },
      { range: '70-79', min: 70, max: 79, fill: C.accentMid },
      { range: '80-89', min: 80, max: 89, fill: C.accent },
      { range: '90-100', min: 90, max: 100, fill: C.success },
    ].map(b => ({ ...b, jumlah: 0 }));
    chartStudents.forEach(s => {
      const gs = grades.filter(g => g.studentId === s.id && g.subject === currentUser.subject);
      gs.forEach(g => {
        const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
        if (!vals.length) return;
        const avg = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
        const b = buckets.find(x => avg >= x.min && avg <= x.max);
        if (b) b.jumlah += 1;
      });
    });

    const tooltipStyle = { backgroundColor: C.card, borderColor: C.border, color: C.text, borderRadius: '10px', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' };
    const cardStyle = { background: C.card, padding: '24px', borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: isDarkMode ? '0 4px 14px rgba(0,0,0,0.25)' : '0 4px 14px rgba(15,23,42,0.04)' };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* HERO */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentMid} 100%)`,
          padding: '16px 22px', borderRadius: '16px', color: '#fff',
          boxShadow: isDarkMode ? '0 10px 20px -14px rgba(0,0,0,0.5)' : '0 10px 20px -14px rgba(46,125,140,0.35)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase', opacity: 0.78, marginBottom: '4px' }}>
              {currentUser.role === 'admin' ? 'Dashboard Administrator' : currentUser.role === 'guru' ? `Dashboard Guru · ${currentUser.subject || ''}` : 'Dashboard Siswa'}
            </div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#fff' }}>Halo, {currentUser.name} 👋</h2>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', opacity: 0.9, color: '#fff' }}>
              {currentUser.role === 'siswa' && 'Pantau poin, portofolio, dan progres akademikmu di sini.'}
              {currentUser.role === 'guru'  && 'Ringkasan kelas wali, validasi, dan distribusi nilai.'}
              {currentUser.role === 'admin' && 'Ringkasan pengguna, pendaftaran, dan aktivitas sekolah.'}
            </p>
          </div>
        </div>

        {/* PINNED ACTIVITY BANNER — hanya muncul jika admin menyematkan kegiatan */}
        {currentUser.role === 'siswa' && news.some(n => n.pinned) && (() => {
          const pinnedNews = news.find(n => n.pinned);
          return (
            <div style={{
              background: C.warningLight, border: `1.5px solid ${C.warning}`, borderRadius: '14px',
              padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '14px', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.warning, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pin size={17} color="#fff" fill="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: C.warning, marginBottom: '2px' }}>
                    Kegiatan Disematkan Sekolah
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pinnedNews.title}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('pengumuman')}
                style={{ ...btnStyle(C.warning, 'sm'), flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                Lihat Detail <ChevronRight size={14} />
              </button>
            </div>
          );
        })()}

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {currentUser.role === 'siswa' && (
            <>
              <StatCard title="Total Poin" value={pts} icon={<Star size={24} color={C.warning} />} bg={C.warningLight} C={C} />
              <StatCard title="Portofolio Disetujui" value={approvedCount} icon={<Award size={24} color={C.success} />} bg={C.successLight} C={C} />
              <StatCard title="Menunggu Validasi" value={pendingMine} icon={<AlertTriangle size={24} color={C.accent} />} bg={C.accentLight} C={C} />
              <StatCard title="Total Aktivitas" value={myActivities.length} icon={<Activity size={24} color={C.accent} />} bg={C.accentLight} C={C} />
            </>
          )}
          {currentUser.role === 'admin' && (
            <>
              <StatCard title="Total Pengguna" value={users.length} icon={<Users size={24} color={C.accent} />} bg={C.accentLight} C={C} />
              <StatCard title="Menunggu Approval" value={pendingUsers} icon={<UserCog size={24} color={C.warning} />} bg={C.warningLight} C={C} />
              <StatCard title="Total Siswa" value={adminStats.siswa} icon={<BookOpen size={24} color={C.success} />} bg={C.successLight} C={C} />
              <StatCard title="Aktivitas Disetujui" value={allApproved.length} icon={<Award size={24} color={C.accent} />} bg={C.accentLight} C={C} />
            </>
          )}
          {currentUser.role === 'guru' && (
            <>
              <StatCard title="Siswa Didik (Wali)" value={users.filter(u => u.role === 'siswa' && u.className === currentUser.waliClass).length} icon={<Users size={24} color={C.accent} />} bg={C.accentLight} C={C} />
              <StatCard title="Validasi Tertunda" value={pendingCount} icon={<FileText size={24} color={C.warning} />} bg={C.warningLight} C={C} />
              <StatCard title="Kelas Diampu" value={currentUser.classesTaught?.length || 0} icon={<BookOpen size={24} color={C.success} />} bg={C.successLight} C={C} />
              <StatCard title="Mata Pelajaran" value={currentUser.subject || '-'} icon={<Star size={24} color={C.accent} />} bg={C.accentLight} C={C} />
            </>
          )}
        </div>

        {/* SISWA: progress milestone */}
{currentUser.role === 'siswa' && (
  <div
    style={{
      ...cardStyle,
      background: C.card,
      color: C.text,
      border: `1px solid ${C.border}`
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '14px'
      }}
    >
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            opacity: 0.7
          }}
        >
          Progres Milestone
        </div>

        <div
          style={{
            fontSize: '28px',
            fontWeight: 800,
            marginTop: '4px'
          }}
        >
          {pts} Poin
        </div>
      </div>

      <div
        style={{
          fontSize: '13px',
          opacity: 0.9,
          fontWeight: 600
        }}
      >
        Bintang ke-{fullStars + 1} pada {nextStarPoin} poin · {progressPct}%
      </div>
    </div>

    <div
      style={{
        height: '10px',
        background: C.border,
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}
    >
      <div
        style={{
          width: `${progressPct}%`,
          height: '100%',
          background: C.accent,
          borderRadius: '20px',
          transition: 'width 0.5s'
        }}
      />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2, 3, 4].map(i => {
          const isFull = i < starsInCurrentRow;
          const isPartial = i === starsInCurrentRow && progressPct > 0;
          return (
            <div key={i} style={{ position: 'relative', width: '32px', height: '32px' }}>
              <Star size={32} color={C.border} fill={C.border} style={{ position: 'absolute', top: 0, left: 0 }} />
              {(isFull || isPartial) && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: isFull ? '100%' : `${progressPct}%`, height: '100%', overflow: 'hidden' }}>
                  <Star size={32} color={C.warning} fill={C.warning} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: C.text, opacity: 0.75 }}>
        Total {fullStars} bintang{rowNumber > 1 ? ` · Level ${rowNumber}` : ''}
      </div>
    </div>
  </div>
)}

        {/* SISWA: AI Future Path entry card */}
{currentUser.role === 'siswa' && (
  <div
    onClick={() => setActiveTab('future-path')}
    style={{
      ...cardStyle,
      cursor: 'pointer',
      background: C.card,
      border: `1px solid ${C.border}`,
      color: C.text,
      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          flex: 1,
          minWidth: 240
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: C.accentLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sparkles size={28} color={C.accent} />
        </div>

        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: C.accentLight,
              color: C.accent,
              padding: '4px 10px',
              borderRadius: '20px',
              marginBottom: '8px'
            }}
          >
            <Rocket size={12} />
            AI Feature · Baru
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 800,
              color: C.text
            }}
          >
            AI Future Path
          </h3>

          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: C.textSecondary,
              lineHeight: 1.5
            }}
          >
            Dapatkan rekomendasi jurusan & kampus terbaik berdasarkan minat,
            skill, dan prestasimu.
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab('future-path');
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: C.accent,
          color: '#fff',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <GraduationCap size={16} />
        Rancang Masa Depanku
      </button>
    </div>
  </div>
)}

        {/* CHARTS — Siswa */}
        {currentUser.role === 'siswa' && (() => {
          const insights = getGradeInsights(currentUser.id);
          const lowest = insights[0];
          const highest = insights[insights.length - 1];
          const pointsPie = pointsByLevel.filter(p => p.poin > 0).map((p, i) => ({
            ...p, name: p.level, value: p.poin,
            fill: [C.accent, C.accentMid, C.success, C.warning, C.danger][i % 5],
          }));
          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} color={C.accent} /> Perkembangan Nilai per Semester
                    </h3>
                    <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600 }}>RATA-RATA</span>
                  </div>
                  {(() => {
                    const semData = ['Sem 1','Sem 2','Sem 3','Sem 4'].map(sem => {
                      const sg = grades.filter(g => g.studentId === currentUser.id && g.semester === sem && g.published !== false);
                      if (!sg.length) return null;
                      const totalAvg = sg.reduce((sum, g) => {
                        const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
                        return sum + (vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0);
                      }, 0) / sg.length;
                      return { semester: sem, rata: Math.round(totalAvg) };
                    }).filter(Boolean);
                    return semData.length ? (
                      <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={semData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gSem" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={C.accent} stopOpacity={0.5}/>
                                <stop offset="95%" stopColor={C.accent} stopOpacity={0.02}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={C.border} />
                            <XAxis dataKey="semester" tick={{ fontSize: 12, fill: C.stone }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.stone }} />
                            <RechartsTooltip contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="rata" stroke={C.accent} strokeWidth={3} fill="url(#gSem)" dot={{ r: 6, fill: C.accent, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: 13 }}>
                        Belum ada nilai akademik.
                      </div>
                    );
                  })()}

                </div>

                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: C.text }}>Poin per Tingkat Kegiatan</h3>
                    <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600 }}>DISETUJUI</span>
                  </div>
                  {pointsPie.length ? (
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pointsPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3} stroke="none" label={(e) => `${e.value}`}>
                            {pointsPie.map((d, i) => <Cell key={i} fill={d.fill} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={tooltipStyle} />
                          <Legend wrapperStyle={{ fontSize: '12px', color: C.text }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: 13 }}>
                      Belum ada poin disetujui pada tingkat apa pun.
                    </div>
                  )}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: C.text }}>Insight Akademik & Portofolio</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {highest && (
                    <div style={{ background: C.successLight, borderLeft: `4px solid ${C.success}`, padding: '12px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: C.success, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={14}/> Mapel Terbaik
                      </div>
                      <div style={{ fontSize: '13px', color: C.text, marginTop: '4px' }}>
                        <strong>{highest.subject}</strong> · rata-rata <strong>{highest.avg}</strong>
                      </div>
                    </div>
                  )}
                  {lowest && lowest !== highest && (
                    <div style={{ background: C.warningLight, borderLeft: `4px solid ${C.warning}`, padding: '12px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: C.warning, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14}/> Perlu Perhatian
                      </div>
                      <div style={{ fontSize: '13px', color: C.text, marginTop: '4px' }}>
                        <strong>{lowest.subject}</strong> rata-rata <strong>{lowest.avg}</strong>. Tingkatkan belajarmu!
                      </div>
                    </div>
                  )}
                  {pendingMine > 0 && (
                    <div style={{ background: C.accentLight, borderLeft: `4px solid ${C.accent}`, padding: '12px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: C.accent, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14}/> Portofolio Menunggu
                      </div>
                      <div style={{ fontSize: '13px', color: C.text, marginTop: '4px' }}>
                        Ada <strong>{pendingMine}</strong> portofolio menunggu disetujui wali kelas.
                      </div>
                    </div>
                  )}
                  {rejectedMine > 0 && (
                    <div style={{ background: C.dangerLight, borderLeft: `4px solid ${C.danger}`, padding: '12px 14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: C.danger, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14}/> Portofolio Ditolak
                      </div>
                      <div style={{ fontSize: '13px', color: C.text, marginTop: '4px' }}>
                        <strong>{rejectedMine}</strong> portofolio ditolak. Periksa catatan dan ajukan ulang.
                      </div>
                    </div>
                  )}
                  {!insights.length && pendingMine === 0 && rejectedMine === 0 && (
                    <div style={{ color: C.textMuted, fontSize: 13 }}>Belum ada data untuk dianalisis.</div>
                  )}
                </div>
              </div>
            </>
          );
        })()}

        {/* CHARTS — Admin */}
        {currentUser.role === 'admin' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: C.text }}>Distribusi Pengguna</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={adminRoleDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3} stroke="none" label />
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: C.text }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700, color: C.text }}>Aktivitas Disetujui per Tingkat</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminPointsByLevel}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="level" stroke={C.stone} fontSize={10} />
                    <YAxis stroke={C.stone} fontSize={11} allowDecimals={false} />
                    <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: isDarkMode ? '#33415555' : '#0000000a' }} />
                    <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                      {adminPointsByLevel.map((_, i) => <Cell key={i} fill={[C.accent, C.accentMid, C.success, C.warning, C.danger][i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* CHARTS — Guru */}
        {currentUser.role === 'guru' && guruClassOptions.length > 0 && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: C.text }}>Distribusi Nilai Kelas {chartClass}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 600 }}>{currentUser.subject?.toUpperCase()}</span>
                <select value={chartClass} onChange={e => setDashboardChartClass(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: '12px', fontWeight: 600 }}>
                  {guruClassOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="range" stroke={C.stone} fontSize={11} />
                  <YAxis stroke={C.stone} fontSize={11} allowDecimals={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} cursor={{ fill: isDarkMode ? '#33415555' : '#0000000a' }} />
                  <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
                    {buckets.map((b, i) => <Cell key={i} fill={b.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: C.textMuted }}>
              Distribusi rata-rata nilai siswa di kelas terpilih (mapel: {currentUser.subject}).
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderFuturePath = () => {
    const cardStyle = { background: C.card, padding: '24px', borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: isDarkMode ? '0 4px 14px rgba(0,0,0,0.25)' : '0 4px 14px rgba(15,23,42,0.04)' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'transparent', border: `1px solid ${C.border}`, color: C.stone,
            padding: '9px 16px', borderRadius: '12px', fontWeight: 600, fontSize: '13px',
            cursor: 'pointer', alignSelf: 'flex-start', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.accentLight; e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.stone; e.currentTarget.style.borderColor = C.border; }}
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>

        {/* HERO */}
        <div style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, #6D28D9 0%, ${C.accent} 50%, ${C.accentMid} 100%)`, padding: '32px 36px', borderRadius: '24px', color: '#fff', boxShadow: '0 20px 40px -20px rgba(109,40,217,0.5)' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Sparkles size={32} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.85 }}>AI Future Path</div>
              <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 6px' }}>Rancang Masa Depanmu</h2>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.92 }}>Dapatkan rekomendasi jurusan & kampus berdasarkan minat dan profil akademikmu.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={18} color={C.accent} /> Ceritakan tentang dirimu
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: '13px', color: C.stone }}>Semakin detail, semakin akurat saran yang AI berikan.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Cita-citamu</label>
              <input value={futurePathData.cita} onChange={e => setFuturePathData({ ...futurePathData, cita: e.target.value })} placeholder="Contoh: Software Engineer, Dokter" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bidang minat utama</label>
              <input value={futurePathData.minat} onChange={e => setFuturePathData({ ...futurePathData, minat: e.target.value })} placeholder="Contoh: Teknologi, Kesehatan, Seni" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Skill yang sudah kamu punya</label>
              <input value={futurePathData.skill} onChange={e => setFuturePathData({ ...futurePathData, skill: e.target.value })} placeholder="Contoh: Coding Python, Public Speaking" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Mata pelajaran kekuatanmu</label>
              <input value={futurePathData.kekuatan} onChange={e => setFuturePathData({ ...futurePathData, kekuatan: e.target.value })} placeholder="Contoh: Matematika, Bahasa Inggris" style={inputStyle} />
            </div>
          </div>
          <button onClick={handleGenerateFuturePath} disabled={futurePathLoading} style={{ ...btnStyle(C.accent), marginTop: '18px', background: futurePathLoading ? C.stone : `linear-gradient(135deg, #6D28D9, ${C.accent})`, boxShadow: '0 10px 25px -8px rgba(109,40,217,0.5)', cursor: futurePathLoading ? 'wait' : 'pointer' }}>
            <Sparkles size={16} /> {futurePathLoading ? 'AI sedang menganalisis...' : 'Buat Rekomendasi Saya'}
          </button>
        </div>

        {/* RESULT */}
        {futurePathResult && (
          <>
            <div style={{ ...cardStyle, borderLeft: `4px solid ${C.accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Rocket size={18} color={C.accent} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: C.text }}>Ringkasan AI</h3>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: C.stone, lineHeight: 1.6 }}>{futurePathResult.ringkasan}</p>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} color={C.accent} /> Rekomendasi Jurusan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {futurePathResult.rekomendasiJurusan.map((j, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: isDarkMode ? '#0F172A' : C.bg, borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ minWidth: 52, height: 52, borderRadius: '12px', background: `linear-gradient(135deg, ${C.accent}, ${C.accentMid})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>{j.match}</div>
                      <div style={{ fontSize: '9px', opacity: 0.85, marginTop: '-2px' }}>MATCH</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{j.jurusan}</div>
                      <div style={{ fontSize: '13px', color: C.stone, marginTop: '4px', lineHeight: 1.5 }}>{j.alasan}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: C.text }}>Rekomendasi Kampus</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {futurePathResult.rekomendasiKampus.map((k, i) => (
                  <div key={i} style={{ padding: '14px', background: C.accentLight, borderRadius: '12px', borderLeft: `3px solid ${C.accent}` }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{k.kampus}</div>
                    <div style={{ fontSize: '11px', color: C.accent, fontWeight: 600, margin: '2px 0 6px' }}>{k.kota}</div>
                    <div style={{ fontSize: '12px', color: C.stone, lineHeight: 1.5 }}>{k.alasan}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${C.successLight}, ${C.accentLight})` }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color={C.success} /> Langkah Selanjutnya
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: C.text, fontSize: '14px', lineHeight: 1.9 }}>
                {futurePathResult.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPortofolio = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Portofolio Kegiatan</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ background: C.card, padding: '24px', borderRadius: '16px', border: `1px solid ${C.border}`, height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: C.text }}>Tambah Aktivitas Baru</h3>
          <form onSubmit={handleAddPortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nama Kegiatan / Prestasi</label>
              <input value={newActTitle} onChange={e => setNewActTitle(e.target.value)} style={inputStyle} placeholder="Contoh: Juara 1 OSN Matematika" />
            </div>
            <div>
              <label style={labelStyle}>Tingkat</label>
              <select value={newActLevel} onChange={e => setNewActLevel(e.target.value)} style={inputStyle}>
                {['Sekolah','Kabupaten','Provinsi','Nasional','Internasional'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Peran</label>
              <select value={newActRole} onChange={e => setNewActRole(e.target.value)} style={inputStyle}>
                {['Peserta','Panitia','Juara/Perwakilan Resmi'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Penyelenggara</label>
              <select value={newActOrganizer} onChange={e => setNewActOrganizer(e.target.value)} style={inputStyle}>
                {['Swasta','Pemerintah','Sekolah'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Bukti Sertifikat / Dokumen</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <div style={{ flex:1, padding:'10px 12px', background: isDarkMode ? '#0F172A' : C.bg, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'12px', color: C.textMuted, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {newActFileName || 'Belum ada file...'}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,.pdf" />
                <button type="button" onClick={() => fileInputRef.current.click()} style={{...btnStyle(C.sidebar, 'sm'), padding: '0 12px'}}><Upload size={14}/></button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tautan Bukti / Website Penyelenggara (opsional)</label>
              <input type="url" value={newActLink} onChange={e => setNewActLink(e.target.value)} style={inputStyle} placeholder="https://contoh-lomba.com/hasil" />
            </div>
            <div style={{ background: C.accentLight, padding: '12px', borderRadius: '8px', fontSize: '12px', color: C.accent, fontWeight: '600' }}>
              Estimasi Poin: +{calculatePoints(newActLevel, newActRole, newActOrganizer)}
            </div>
            <button type="submit" style={{ ...btnStyle(C.accent), width: '100%', justifyContent: 'center' }}>
              <Plus size={16} /> Simpan Draf
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activities.filter(a => a.studentId === currentUser.id).map(act => (
            <div key={act.id} style={{ background: C.card, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: C.text }}>{act.title}</h4>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: C.stone, marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={14} /> {act.level}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UserCog size={14} /> {act.role}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <StatusBadge status={act.status} C={C} isDarkMode={isDarkMode} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: C.accent }}>+{act.points} Poin</span>
                  {act.fileUrl && (
                    <button onClick={() => setPreviewFile({ url: act.fileUrl, isPdf: act.fileName?.toLowerCase().endsWith('.pdf') })} style={{ background: 'none', border: 'none', color: C.stone, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'underline' }}>
                      Lihat Bukti
                    </button>
                  )}
                  {act.proofLink && (
                    <a href={act.proofLink} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'underline' }}>
                      <Globe size={12} /> Tautan Sumber
                    </a>
                  )}
                </div>
                {act.note && (
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: C.dangerLight, color: C.danger, borderRadius: '6px', fontSize: '12px' }}>
                    <strong>Catatan Penolakan:</strong> {act.note}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {act.status === 'draft' && (
                  <>
                    <button onClick={() => handleSendDraft(act.id)} style={{ ...btnStyle(C.success, 'sm'), background: 'none', border: `1px solid ${C.success}`, color: C.success }}>Kirim Validasi</button>
                    <button onClick={() => handleCancelDraft(act.id)} style={{ ...btnStyle(C.danger, 'sm'), background: 'none', border: `1px solid ${C.danger}`, color: C.danger }}>Hapus</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {activities.filter(a => a.studentId === currentUser.id).length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: '12px' }}>
              Belum ada aktivitas yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderValidasi = () => {
    const pendingActs = activities.filter(a => a.status === 'pending' && users.find(u => u.id === a.studentId)?.className === currentUser.waliClass);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: '0 0 4px' }}>Validasi Portofolio Siswa</h2>
          <p style={{ color: C.stone, margin: 0 }}>Periksa dan setujui aktivitas yang diajukan oleh siswa kelas {currentUser.waliClass}.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingActs.map(act => {
            const student = users.find(u => u.id === act.studentId);
            return (
              <div key={act.id} style={{ background: C.card, padding: '24px', borderRadius: '16px', border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: C.accent, marginBottom: '4px' }}>{student?.name} - {student?.nip}</div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '18px', color: C.text }}>{act.title}</h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: C.stone, marginBottom: '16px' }}>
                    <div><strong>Tingkat:</strong> {act.level}</div>
                    <div><strong>Peran:</strong> {act.role}</div>
                    <div><strong>Penyelenggara:</strong> {act.organizer}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {act.fileUrl && (
                      <button onClick={() => setPreviewFile({ url: act.fileUrl, isPdf: act.fileName?.toLowerCase().endsWith('.pdf') })} style={{ ...btnStyle(C.stone, 'sm'), background: 'transparent', border: `1px solid ${C.stone}`, color: C.stone }}>
                        <FileText size={16} /> Lihat Dokumen
                      </button>
                    )}
                    {act.proofLink && (
                      <a href={act.proofLink} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle(C.accent, 'sm'), background: 'transparent', border: `1px solid ${C.accent}`, color: C.accent, textDecoration: 'none' }}>
                        <Globe size={16} /> Cek Sumber Lomba
                      </a>
                    )}
                    <button onClick={() => setEditModal(act)} style={{ ...btnStyle(C.warning, 'sm'), background: 'transparent', border: `1px solid ${C.warning}`, color: C.warning }}>
                      <Edit size={16} /> Koreksi Bobot (+{act.points})
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', paddingLeft: '24px', borderLeft: `1px solid ${C.border}` }}>
                  <button onClick={() => handleApproveActivity(act)} style={btnStyle(C.success)}>Setujui (+{act.points})</button>
                  <button onClick={() => setRejectModal(act.id)} style={{ ...btnStyle(C.danger), background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger }}>Tolak</button>
                </div>
              </div>
            );
          })}
          {pendingActs.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, background: C.card, borderRadius: '16px', border: `1px dashed ${C.border}` }}>
              <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '16px', display: 'inline-block' }} />
              <p>Tidak ada portofolio yang menunggu validasi.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNilai = () => {
    if (currentUser.role === 'siswa') {
      const availableSem = Array.from(new Set(grades.filter(g => g.studentId === currentUser.id && g.published !== false).map(g => g.semester))).sort();
      const activeSem = availableSem.includes(siswaSemester) ? siswaSemester : (availableSem[availableSem.length - 1] || 'Sem 1');
      const studentGrades = grades.filter(g => g.studentId === currentUser.id && g.semester === activeSem && g.published !== false);
      const semInsights = studentGrades.map(g => {
        const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
        return { subject: g.subject, avg: vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null };
      }).filter(x => x.avg !== null);
      const lowest = semInsights.length ? semInsights.reduce((a,b) => a.avg < b.avg ? a : b) : null;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Nilai Akademik · {activeSem}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.stone }}>Pilih Semester:</span>
              <select value={activeSem} onChange={e => setSiswaSemester(e.target.value)} style={{ padding: '8px 14px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: '13px', fontWeight: 600 }}>
                {(availableSem.length ? availableSem : ['Sem 1']).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {lowest && (
            <div style={{ background: C.warningLight, borderLeft: `4px solid ${C.warning}`, padding: '14px 18px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.warning, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={14}/> Insight Semester Ini
              </div>
              <div style={{ fontSize: '13px', color: C.text }}>
                Mata pelajaran <strong>{lowest.subject}</strong> butuh perhatian (rata-rata <strong>{lowest.avg}</strong>). Yuk fokus belajar di sini!
              </div>
            </div>
          )}

          <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                <tr>
                  <th style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '13px', color: C.stone }}>Mata Pelajaran</th>
                  {columns.map(c => <th key={c} style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '13px', color: C.stone }}>{c}</th>)}
                  <th style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontSize: '13px', color: C.stone }}>Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((g, i) => {
                  const vals = Object.values(g.tasks).filter(v => v !== null);
                  const avg = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : '-';
                  return (
                    <tr key={i}>
                      <td style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: '600', color: C.text }}>{g.subject}</td>
                      {columns.map(c => <td key={c} style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{g.tasks[c] ?? '-'}</td>)}
                      <td style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: '700', color: avg < 70 ? C.danger : C.success }}>{avg}</td>
                    </tr>
                  );
                })}
                {studentGrades.length === 0 && (
                  <tr><td colSpan={columns.length + 2} style={{ padding: '32px', textAlign: 'center', color: C.textMuted }}>Belum ada nilai dipublikasikan untuk semester ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: '12px', color: C.textMuted, fontStyle: 'italic' }}>
            * Nilai baru tampil setelah guru memverifikasi & mem-publish data.
          </div>
        </div>
      );
    }

    
    // Tampilan Guru: Input Nilai
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Input Nilai Akademik</h2>
        <div style={{ background: C.card, padding: '24px', borderRadius: '16px', border: `1px solid ${C.border}`, display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={labelStyle}>Pilih Kelas Pembelajaran</label>
            <select style={{ ...inputStyle, width: '240px' }} value={selectedClass || ''} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">-- Pilih Kelas --</option>
              {currentUser.classesTaught?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Mata Pelajaran Diampu</label>
            <div style={{ background: isDarkMode ? '#0F172A' : C.bg, padding: '10px 16px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '14px', fontWeight: 'bold', color: C.accent }}>
              {currentUser.subject || 'Fisika'}
            </div>
          </div>
        </div>

        {selectedClass ? (
          <div style={{ background: C.card, padding: '24px', borderRadius: '16px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: C.text }}>Tabel Nilai Siswa: Kelas {selectedClass}</h3>
              <button onClick={() => {
                const cur = getColumnsForGuru(currentUser.nip);
                const draft = {}; cur.forEach(c => { draft[c] = c; });
                setRenameColDraft(draft);
                setEditColModal(true);
              }} style={btnStyle(C.accent, 'sm')}>
                <Edit size={14} /> Edit Kolom
              </button>
            </div>

            {editColModal && (() => {
              const cur = getColumnsForGuru(currentUser.nip);
              return (
                <div style={{ background: isDarkMode ? '#0F172A' : C.bg, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: C.text }}>Kelola Kolom Penilaian</h4>
                    <button onClick={() => { setEditColModal(false); setNewColName(''); }} style={{ background: 'none', border: 'none', color: C.stone, cursor: 'pointer' }}><X size={16}/></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {cur.map(col => (
                      <div key={col} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          value={renameColDraft[col] ?? col}
                          onChange={e => setRenameColDraft({ ...renameColDraft, [col]: e.target.value })}
                          style={{ ...inputStyle, flex: 1, padding: '8px 12px' }}
                        />
                        <button onClick={() => {
                          const newName = (renameColDraft[col] ?? '').trim();
                          if (!newName) return showToast('Nama kolom tidak boleh kosong.', 'error');
                          if (newName === col) return;
                          if (cur.includes(newName)) return showToast('Nama kolom sudah ada!', 'error');
                          const updatedCols = cur.map(c => c === col ? newName : c);
                          setCustomColumns({ ...customColumns, [currentUser.nip]: updatedCols });
                          setGrades(prev => prev.map(g => {
                            if (g.subject !== currentUser.subject) return g;
                            if (!(col in g.tasks)) return g;
                            const tasks = { ...g.tasks };
                            tasks[newName] = tasks[col];
                            delete tasks[col];
                            return { ...g, tasks };
                          }));
                          const nd = { ...renameColDraft }; nd[newName] = newName; delete nd[col];
                          setRenameColDraft(nd);
                          showToast('Nama kolom diperbarui.', 'success');
                        }} style={btnStyle(C.accentMid, 'sm')}>Simpan</button>
                        <button onClick={() => {
                          const updated = cur.filter(c => c !== col);
                          setCustomColumns({ ...customColumns, [currentUser.nip]: updated });
                          setGrades(prev => prev.map(g => {
                            if (g.subject !== currentUser.subject) return g;
                            const tasks = { ...g.tasks }; delete tasks[col];
                            return { ...g, tasks };
                          }));
                          const nd = { ...renameColDraft }; delete nd[col]; setRenameColDraft(nd);
                          showToast('Kolom dihapus.', 'info');
                        }} style={{ ...btnStyle(C.danger, 'sm'), background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
                    <input
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      placeholder="Nama kolom baru (mis. Kuis 1)"
                      style={{ ...inputStyle, flex: 1, padding: '8px 12px' }}
                    />
                    <button onClick={() => {
                      const name = newColName.trim();
                      if (!name) return;
                      if (cur.includes(name)) return showToast('Nama kolom sudah ada!', 'error');
                      const updatedCols = [...cur, name];
                      setCustomColumns({ ...customColumns, [currentUser.nip]: updatedCols });
                      setRenameColDraft({ ...renameColDraft, [name]: name });
                      setNewColName('');
                      showToast('Kolom ditambahkan.', 'success');
                    }} style={btnStyle(C.accent, 'sm')}><Plus size={14}/> Tambah</button>
                  </div>
                </div>
              );
            })()}

            <div style={{ position: 'relative', maxWidth: '300px', marginBottom: '14px' }}>
              <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: C.stone }} />
              <input
                type="text"
                value={searchNilaiGuru}
                onChange={e => setSearchNilaiGuru(e.target.value)}
                placeholder="Cari nama siswa di kelas ini..."
                style={{ ...inputStyle, paddingLeft: '36px', fontSize: '13px', padding: '8px 12px 8px 36px' }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: '13px', color: C.stone }}>Nama Siswa</th>
                    {getColumnsForGuru(currentUser.nip).map(col => (
                      <th key={col} style={{ padding: '12px 16px', fontSize: '13px', color: C.stone, textAlign: 'center' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'siswa' && u.className === selectedClass && (!searchNilaiGuru.trim() || u.name.toLowerCase().includes(searchNilaiGuru.trim().toLowerCase()))).map(student => {
                    const studentGradeObj = grades.find(g => g.studentId === student.id && g.subject === currentUser.subject) || { tasks: {} };
                    return (
                      <tr key={student.id}>
                        <td style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontWeight: '600', color: C.text }}>{student.name}</td>
                        {getColumnsForGuru(currentUser.nip).map(col => (
                          <td key={col} style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
                            <input 
                              type="number" 
                              defaultValue={studentGradeObj.tasks[col] || ''} 
                              style={{ width: '64px', padding: '6px', borderRadius: '6px', border: `1px solid ${C.border}`, textAlign: 'center', background: C.card, color: C.text }} 
                              onChange={(e) => {
                                const val = e.target.value !== '' ? parseInt(e.target.value) : null;
                                setGrades(prev => {
                                  const idx = prev.findIndex(g => g.studentId === student.id && g.subject === currentUser.subject && g.semester === 'Sem 1');
                                  if (idx > -1) {
                                    const updated = [...prev];
                                    updated[idx] = { ...updated[idx], tasks: { ...updated[idx].tasks, [col]: val }, published: false };
                                    return updated;
                                  } else {
                                    return [...prev, { studentId: student.id, subject: currentUser.subject, semester: 'Sem 1', published: false, tasks: { [col]: val } }];
                                  }
                                });
                              }}
                            />

                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {(() => {
              const classStudentIds = users.filter(u => u.role === 'siswa' && u.className === selectedClass).map(u => u.id);
              const targetGrades = grades.filter(g => classStudentIds.includes(g.studentId) && g.subject === currentUser.subject);
              const unpublishedCount = targetGrades.filter(g => g.published === false).length;
              const allPublished = targetGrades.length > 0 && unpublishedCount === 0;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px', background: isDarkMode ? '#0F172A' : C.bg, padding: '14px 18px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '13px', color: C.text }}>
                    {allPublished ? (
                      <span style={{ color: C.success, fontWeight: 600 }}>✓ Semua nilai sudah dipublikasikan ke siswa.</span>
                    ) : (
                      <span><strong style={{ color: C.warning }}>{unpublishedCount}</strong> entri belum dipublikasikan — siswa belum bisa melihat.</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => showToast('Draft disimpan ke penyimpanan lokal.', 'success')} style={btnStyle(C.stone, 'sm')}>Simpan Draft</button>
                    <button
                      disabled={!unpublishedCount}
                      onClick={() => setPublishConfirm({ step: 1, className: selectedClass, subject: currentUser.subject, count: unpublishedCount })}
                      style={{ ...btnStyle(C.success), opacity: unpublishedCount ? 1 : 0.45, cursor: unpublishedCount ? 'pointer' : 'not-allowed' }}
                    >
                      <Send size={14}/> Publish ke Siswa ({unpublishedCount})
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

        ) : (
          <div style={{ background: C.card, padding: '40px', borderRadius: '16px', border: `1px solid ${C.border}`, textAlign: 'center', color: C.stone }}>
            <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '16px', display: 'inline-block' }} />
            <p>Silakan pilih kelas terlebih dahulu untuk menginput dan memodifikasi nilai siswa.</p>
          </div>
        )}
      </div>
    );
  };

  // === Rapor Wali Kelas: lihat semua nilai mapel siswa di kelas wali ===
  const renderNilaiWali = () => {
    if (!currentUser.isWaliKelas) {
      return (
        <div style={{ padding: 40, textAlign: 'center', background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, color: C.stone }}>
          Menu ini hanya tersedia untuk guru wali kelas.
        </div>
      );
    }
    const waliClass = currentUser.waliClass;
    const waliStudents = users.filter(u => u.role === 'siswa' && u.className === waliClass);
    // Kumpulkan semua mapel yg ada di nilai siswa kelas ini
    const subjectSet = new Set();
    waliStudents.forEach(s => grades.filter(g => g.studentId === s.id).forEach(g => subjectSet.add(g.subject)));
    const subjects = Array.from(subjectSet).sort();

    const rows = waliStudents.map(s => {
      const subjScores = {};
      subjects.forEach(subj => {
        const g = grades.find(gr => gr.studentId === s.id && gr.subject === subj);
        if (g) {
          const vals = Object.values(g.tasks).filter(v => v !== null && v !== undefined);
          subjScores[subj] = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
        } else {
          subjScores[subj] = null;
        }
      });
      const finalVals = Object.values(subjScores).filter(v => v !== null);
      const avg = finalVals.length ? Math.round((finalVals.reduce((a,b)=>a+b,0)/finalVals.length) * 10) / 10 : null;
      return { student: s, subjScores, avg };
    });

    const ranked = [...rows].sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1))
      .map((r, i) => ({ ...r, rank: r.avg === null ? '-' : i + 1 }));

    const q = searchRapor.trim().toLowerCase();
    const rankedFiltered = q ? ranked.filter(r => r.student.name.toLowerCase().includes(q) || (r.student.nip || '').toLowerCase().includes(q)) : ranked;

    const classAvg = (() => {
      const vals = ranked.map(r => r.avg).filter(v => v !== null);
      return vals.length ? Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10 : '-';
    })();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Rapor Wali Kelas {waliClass}</h2>
          <p style={{ color: C.stone, margin: '4px 0 0' }}>Rekap nilai final seluruh mata pelajaran siswa kelas wali Anda beserta peringkatnya.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <StatCard title="Jumlah Siswa" value={waliStudents.length} icon={<Users size={24} color={C.accent} />} bg={C.accentLight} C={C} />
          <StatCard title="Mata Pelajaran" value={subjects.length} icon={<BookOpen size={24} color={C.success} />} bg={C.successLight} C={C} />
          <StatCard title="Rata-Rata Kelas" value={classAvg} icon={<TrendingUp size={24} color={C.warning} />} bg={C.warningLight} C={C} />
          <StatCard title="Peringkat 1" value={ranked[0]?.student?.name?.split(' ')[0] || '-'} icon={<Trophy size={24} color={C.warning} />} bg={C.warningLight} C={C} />
        </div>

        {subjects.length > 0 && (
          <div style={{ position: 'relative', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.stone }} />
            <input
              type="text"
              value={searchRapor}
              onChange={e => setSearchRapor(e.target.value)}
              placeholder="Cari nama atau NIP/NPM siswa..."
              style={{ ...inputStyle, paddingLeft: '38px' }}
            />
          </div>
        )}

        {subjects.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', background: C.card, borderRadius: 16, border: `1px dashed ${C.border}`, color: C.stone }}>
            Belum ada data nilai untuk siswa di kelas ini.
          </div>
        ) : (
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
                <tr>
                  <th style={{ padding: '14px 16px', fontSize: 12, color: C.stone, textAlign: 'center', width: 60 }}>Rank</th>
                  <th style={{ padding: '14px 16px', fontSize: 12, color: C.stone }}>Nama Siswa</th>
                  {subjects.map(s => (
                    <th key={s} style={{ padding: '14px 12px', fontSize: 12, color: C.stone, textAlign: 'center' }}>{s}</th>
                  ))}
                  <th style={{ padding: '14px 16px', fontSize: 12, color: C.stone, textAlign: 'center' }}>Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                {rankedFiltered.length === 0 && (
                  <tr><td colSpan={subjects.length + 3} style={{ padding: 30, textAlign: 'center', color: C.textMuted }}>Siswa tidak ditemukan.</td></tr>
                )}
                {rankedFiltered.map(r => (
                  <tr key={r.student.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: r.rank === 1 ? C.warning : r.rank === 2 ? C.accent : r.rank === 3 ? C.success : C.text }}>
                      {r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: C.text }}>{r.student.name}</td>
                    {subjects.map(subj => {
                      const v = r.subjScores[subj];
                      return (
                        <td key={subj} style={{ padding: '12px 12px', textAlign: 'center', color: v === null ? C.textMuted : v < 70 ? C.danger : C.text, fontWeight: v !== null && v < 70 ? 700 : 500 }}>
                          {v === null ? '-' : v}
                        </td>
                      );
                    })}
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 800, color: r.avg === null ? C.textMuted : r.avg < 70 ? C.danger : C.success, fontSize: 15 }}>
                      {r.avg === null ? '-' : r.avg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderPengguna = () => {

    const listPending = users.filter(u => u.status === 'pending');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItem: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Kelola Pengguna Sistem</h2>
            <p style={{ color: C.stone, margin: 0 }}>Admin dapat menyetujui pendaftaran dan memodifikasi username/password seluruh pengguna.</p>
          </div>
        </div>

        {/* Persetujuan Pendaftaran Akun */}
        <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: C.text, display:'flex', alignItems:'center', gap:'8px' }}>
            <ShieldCheck size={20} color={C.accent} /> Menunggu Persetujuan Registrasi ({listPending.length})
          </h3>
          {listPending.length === 0 ? (
            <p style={{ color: C.stone, margin: 0, fontSize: '13px' }}>Tidak ada pengajuan akun baru saat ini.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    <th style={{ padding: '10px', fontSize: '13px', color: C.stone }}>NIP/NPM</th>
                    <th style={{ padding: '10px', fontSize: '13px', color: C.stone }}>Nama</th>
                    <th style={{ padding: '10px', fontSize: '13px', color: C.stone }}>Peran</th>
                    <th style={{ padding: '10px', fontSize: '13px', color: C.stone }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {listPending.map(u => (
                    <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold', color: C.text }}>{u.nip}</td>
                      <td style={{ padding: '12px 10px', color: C.text }}>{u.name}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize', color: C.text }}>{u.role}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <button onClick={() => handleApproveUser(u.id, u.role)} style={btnStyle(C.success, 'sm')}>Setujui Akun</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pengaturan & Edit Akun Terdaftar */}
        <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems:'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: C.text }}>Daftar Pengguna Aktif</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: C.stone }} />
                <input
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  placeholder="Cari nama / NIP..."
                  style={{ padding: '6px 12px 6px 30px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: '13px', width: '220px' }}
                />
              </div>
              {['admin', 'siswa', 'guru'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setManageUserType(t)} 
                  style={{
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                    background: manageUserType === t ? C.accent : 'transparent',
                    color: manageUserType === t ? '#fff' : C.stone,
                    border: `1px solid ${manageUserType === t ? C.accent : C.border}`
                  }}
                >
                  {t === 'admin' ? 'Operator (Admin)' : t === 'siswa' ? 'Siswa' : 'Guru'}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: isDarkMode ? '#0F172A' : C.bg }}>
              <tr>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: C.stone }}>NIP/NPM (Username)</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: C.stone }}>Nama</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: C.stone }}>Password Aktif</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: C.stone }}>Atribut/Detail</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', color: C.stone, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => {
                if (u.status !== 'active' || u.role !== manageUserType) return false;
                const q = searchUser.trim().toLowerCase();
                if (!q) return true;
                return (u.name || '').toLowerCase().includes(q) || (u.nip || '').toLowerCase().includes(q);
              }).map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '16px 20px', fontWeight: '700', fontFamily: 'monospace', color: C.text }}>{u.nip}</td>
                  <td style={{ padding: '16px 20px', fontWeight: '600', color: C.text }}>{u.name}</td>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: C.stone }}>{u.password}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {u.role === 'siswa' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                        <span style={{ background: C.accentLight, color: C.accent, padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', alignSelf: 'flex-start' }}>Kelas: {u.className}</span>
                        <span style={{ color: C.stone }}>T.A. <strong style={{ color: C.text }}>{u.tahunAjaran || '-'}</strong> · Angkatan <strong style={{ color: C.text }}>{u.angkatan || '-'}</strong></span>
                      </div>
                    )}

                    {u.role === 'guru' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                        <span style={{color: C.text}}>Mapel: <strong>{u.subject || 'Fisika'}</strong></span>
                        {u.isWaliKelas && <span style={{ color: C.success }}>Wali Kelas: <strong>{u.waliClass}</strong></span>}
                      </div>
                    )}
                    {u.role === 'admin' && <span style={{ fontSize: '12px', background: isDarkMode ? '#334155' : '#E2E8F0', color: isDarkMode ? '#CBD5E1' : '#475569', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Sistem Utama</span>}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => {
                          setAdminEditUser({ ...u });
                          setAdminEditErrors({});
                        }} 
                        style={{ ...btnStyle(C.accent, 'sm'), padding: '6px 12px' }}
                      >
                        <Edit size={14} /> Edit User
                      </button>
                      {u.id !== currentUser.id && (
                        <button 
                          onClick={() => {
                            setConfirmDialog({
                              message: `Apakah Anda yakin ingin menghapus akun ${u.name}? Tindakan ini permanen.`,
                              onConfirm: () => {
                                setUsers(users.filter(x => x.id !== u.id));
                                setConfirmDialog(null);
                                showToast('Akun berhasil dihapus.', 'success');
                              }
                            });
                          }} 
                          style={{ ...btnStyle(C.danger, 'sm'), padding: '6px 12px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNewsAdmin = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Kelola News Hub</h2>
          <p style={{ color: C.stone, margin: 0 }}>Buat pengumuman atau informasi lomba untuk siswa.</p>
        </div>

        <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', color: C.text, fontWeight: '700' }}>Buat Pengumuman Baru</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <InputField label="Judul Pengumuman" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="Contoh: Pendaftaran OSN Dibuka" C={C} isDarkMode={isDarkMode} />
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={newsCat} onChange={e => setNewsCat(e.target.value)} style={inputStyle}>
                <option>Lomba Eksternal</option><option>Kegiatan Sekolah</option><option>Pengumuman Akademik</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Isi Pengumuman</label>
              <textarea value={newsContent} onChange={e => setNewsContent(e.target.value)} placeholder="Deskripsi lengkap..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Poster / Gambar (opsional)</label>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <div style={{flex:1,padding:'10px 12px',background: isDarkMode ? '#0F172A' : C.bg,border:`1px solid ${C.border}`,borderRadius:'8px',fontSize:'12px',color:C.textMuted,fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {newsImageName || 'Belum ada gambar...'}
                </div>
                <input type="file" accept="image/*" ref={newsImgRef} style={{display:'none'}} onChange={e=>{
                  const file=e.target.files[0];
                  if(file){setNewsImageName(file.name);setNewsImageUrl(URL.createObjectURL(file));}
                }}/>
                <button type="button" onClick={()=>newsImgRef.current.click()} style={{...btnStyle(C.sidebar,'sm'), background: 'transparent', border: `1px solid ${C.stone}`, color: C.stone}}><Upload size={14}/> Upload</button>
                {newsImageUrl && <button type="button" onClick={()=>{setNewsImageUrl(null);setNewsImageName('');}} style={{...btnStyle(C.danger,'sm'), background: 'transparent', border: `1px solid ${C.danger}`, color: C.danger}}><X size={14}/></button>}
              </div>
              {newsImageUrl && <img src={newsImageUrl} alt="preview" style={{marginTop:'12px',width:'100%',maxHeight:'200px',objectFit:'cover',borderRadius:'10px',border:`1px solid ${C.border}`}}/>}
            </div>
            <button onClick={handleAddNews} style={{...btnStyle(C.accent), width: 'fit-content'}}>Posting Sekarang</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {news.map(n => (
            <div key={n.id} style={{ background: C.card, padding: '20px', borderRadius: '12px', border: n.pinned ? `1.5px solid ${C.warning}` : `1px solid ${C.border}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                <button onClick={() => handleTogglePin(n.id)} title={n.pinned ? 'Lepas pin' : 'Sematkan ke dashboard siswa'} style={{ background: n.pinned ? C.warningLight : 'none', border: n.pinned ? `1px solid ${C.warning}` : 'none', borderRadius: '8px', padding: '4px', color: n.pinned ? C.warning : C.stone, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Pin size={15} fill={n.pinned ? C.warning : 'none'} />
                </button>
                <button onClick={() => setConfirmDialog({
                    message: 'Yakin mau hapus berita ini?',
                    onConfirm: () => { setNews(news.filter(x => x.id !== n.id)); setConfirmDialog(null); showToast('Berita dihapus', 'success'); }
                  })} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer' }}>
                    <Trash2 size={16} />
                </button>
              </div>
              {n.pinned && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: C.warningLight, color: C.warning, borderRadius: '4px', fontSize: '10px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  <Pin size={10} fill={C.warning} /> Disematkan di Dashboard
                </div>
              )}
              <div style={{ display: 'inline-block', padding: '4px 10px', background: C.accentLight, color: C.accent, borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginBottom: '12px', marginLeft: n.pinned ? '6px' : '0' }}>{n.category}</div>
              <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: C.text, paddingRight: '24px' }}>{n.title}</h4>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: C.stone, lineHeight: '1.5' }}>{n.content}</p>
              {n.imageUrl && <img src={n.imageUrl} alt={n.title} style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />}
              <div style={{ fontSize: '11px', color: C.textMuted }}>{new Date(n.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- MENU PENGUMUMAN KHUSUS SISWA (Request 3) ---
  const renderPengumumanSiswa = () => {
    // Sort news by newest date first
    const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: '0 0 4px' }}>Pengumuman & Event</h2>
          <p style={{ color: C.stone, margin: 0 }}>Informasi terbaru seputar akademik dan perlombaan dari sekolah.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {sortedNews.map((n) => (
            <div key={n.id} style={{ 
              background: C.card, 
              borderRadius: '16px', 
              border: `1px solid ${C.border}`, 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              {n.imageUrl ? (
                <img src={n.imageUrl} alt={n.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderBottom: `1px solid ${C.border}` }} />
              ) : (
                <div style={{ width: '100%', height: '120px', background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Newspaper size={40} color={C.accent} style={{ opacity: 0.5 }} />
                </div>
              )}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ padding: '4px 10px', background: C.accentLight, color: C.accent, borderRadius: '6px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                    {n.category}
                  </span>
                  <span style={{ fontSize: '11px', color: C.stone, fontWeight: '600' }}>
                    {new Date(n.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '700', color: C.text, lineHeight: '1.4' }}>{n.title}</h4>
                <p style={{ margin: '0', fontSize: '13px', color: C.stone, lineHeight: '1.6', flex: 1 }}>{n.content}</p>
              </div>
            </div>
          ))}
          {sortedNews.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: C.textMuted, border: `2px dashed ${C.border}`, borderRadius: '16px', gridColumn: '1 / -1' }}>
              <Calendar size={48} style={{ opacity: 0.3, marginBottom: '16px', display: 'inline-block' }} />
              <p>Belum ada jadwal acara atau pengumuman saat ini.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPengaturan = () => {
    // ---- PROFIL KHUSUS SISWA (Banyak Field Read-Only) ----
    if (currentUser.role === 'siswa') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Profilku</h2>
            <p style={{ color: C.stone, margin: 0 }}>Lihat biodata dan ubah password akun belajarmu.</p>
          </div>
          <div style={{ background: C.card, padding: '32px', borderRadius: '16px', border: `1px solid ${C.border}` }}>
            <form onSubmit={handleUpdatePasswordSiswa} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputField label="NIP / NPM (Username)" value={currentUser.nip} readOnly={true} C={C} isDarkMode={isDarkMode} />
              <InputField label="Nama Lengkap" value={currentUser.name} readOnly={true} C={C} isDarkMode={isDarkMode} />
              <div>
                <InputField label="Kelas Siswa" value={currentUser.className} readOnly={true} C={C} isDarkMode={isDarkMode} />
                <div style={{ fontSize: '11px', color: C.danger, marginTop: '-10px', marginBottom: '14px', fontWeight: '600' }}>
                  * NIP, Nama, dan Kelas dikunci sistem. Hubungi Admin jika ada kesalahan.
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px', marginTop: '8px' }}>
                <InputField label="Password Baru" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Ketik password baru untuk mengganti" C={C} isDarkMode={isDarkMode} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" style={btnStyle(C.accent)}>Perbarui Password</button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // ---- PENGATURAN UMUM (Admin / Guru) ----
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: C.text, margin: 0 }}>Pengaturan Akun</h2>
        <div style={{ background: C.card, padding: '32px', borderRadius: '16px', border: `1px solid ${C.border}` }}>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InputField label="Nama Lengkap" value={editName} onChange={e => setEditName(e.target.value)} C={C} isDarkMode={isDarkMode} />
            <InputField label="NIP / NPM (Username)" value={editNip} onChange={e => setEditNip(e.target.value)} C={C} isDarkMode={isDarkMode} />
            <InputField label="Password Baru" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Masukkan password baru untuk mengganti" C={C} isDarkMode={isDarkMode} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" style={btnStyle(C.accent)}>Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER WITH MODALS
  // ============================================================
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg, fontFamily: 'Inter, system-ui, sans-serif', transition: 'background-color 0.3s ease' }}>
      <ToastComponent toast={toast} C={C} />

      {/* MODAL: Edit Pengguna oleh Operator (Admin) */}
      {adminEditUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: C.card, borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '28px', border: `1px solid ${C.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${C.border}`, pb: '10px' }}>
              <h3 style={{ margin: 0, color: C.text, fontWeight: '800' }}>Edit Akun (Oleh Admin)</h3>
              <button onClick={() => setAdminEditUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.stone }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAdminUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Username / NIP / NPM</label>
                <input 
                  value={adminEditUser.nip} 
                  onChange={e => setAdminEditUser({ ...adminEditUser, nip: e.target.value })} 
                  style={inputStyle} 
                />
                {adminEditErrors.nip && <div style={{ color: C.danger, fontSize: '12px', marginTop: '4px' }}>{adminEditErrors.nip}</div>}
              </div>

              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input 
                  value={adminEditUser.name} 
                  onChange={e => setAdminEditUser({ ...adminEditUser, name: e.target.value })} 
                  style={inputStyle} 
                />
                {adminEditErrors.name && <div style={{ color: C.danger, fontSize: '12px', marginTop: '4px' }}>{adminEditErrors.name}</div>}
              </div>

              <div>
                <label style={labelStyle}>Password Akun</label>
                <input 
                  type="text" 
                  value={adminEditUser.password} 
                  onChange={e => setAdminEditUser({ ...adminEditUser, password: e.target.value })} 
                  style={inputStyle} 
                />
                {adminEditErrors.password && <div style={{ color: C.danger, fontSize: '12px', marginTop: '4px' }}>{adminEditErrors.password}</div>}
              </div>

              {/* Atribut Khusus Siswa */}
              {adminEditUser.role === 'siswa' && (
                <div>
                  <label style={labelStyle}>Kelas Siswa</label>
                  <select 
                    value={adminEditUser.className} 
                    onChange={e => setAdminEditUser({ ...adminEditUser, className: e.target.value })} 
                    style={inputStyle}
                  >
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {/* Atribut Khusus Guru */}
              {adminEditUser.role === 'guru' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: isDarkMode ? '#0F172A' : C.bg, padding: '14px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                  <div>
                    <label style={labelStyle}>Mata Pelajaran Utama</label>
                    <select 
                      value={adminEditUser.subject || ''} 
                      onChange={e => setAdminEditUser({ ...adminEditUser, subject: e.target.value })} 
                      style={inputStyle}
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="adminIsWali"
                      checked={adminEditUser.isWaliKelas || false} 
                      onChange={e => setAdminEditUser({ ...adminEditUser, isWaliKelas: e.target.checked })} 
                    />
                    <label htmlFor="adminIsWali" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Wali Kelas Aktif</label>
                  </div>

                  {adminEditUser.isWaliKelas && (
                    <div>
                      <label style={labelStyle}>Kelas Perwalian</label>
                      <select 
                        value={adminEditUser.waliClass || ''} 
                        onChange={e => setAdminEditUser({ ...adminEditUser, waliClass: e.target.value })} 
                        style={inputStyle}
                      >
                        <option value="">-- Pilih Kelas --</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setAdminEditUser(null)} style={btnStyle(C.stone, 'sm')}>Batal</button>
                <button type="submit" style={btnStyle(C.accent, 'sm')}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Aksi */}
      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setConfirmDialog(null)}>
          <div style={{ background: C.card, borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: C.text }}>Konfirmasi</h3>
            <p style={{ margin: '0 0 24px', color: C.stone, fontSize: '14px' }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDialog(null)} style={btnStyle(C.stone)}>Batal</button>
              <button onClick={confirmDialog.onConfirm} style={btnStyle(C.danger)}>Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Preview Dokumen */}
      {previewFile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setPreviewFile(null)}>
          <div style={{ background: C.card, borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: C.text }}>Pratinjau Dokumen</span>
              <button onClick={() => setPreviewFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.stone }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, background: isDarkMode ? '#0B1120' : '#E8E0D6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'auto' }}>
              {previewFile.isPdf ? <iframe src={previewFile.url} style={{ width: '100%', height: '70vh', borderRadius: '8px', border: 'none' }} title="PDF" /> : <img src={previewFile.url} alt="Sertifikat" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} />}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tolak dengan catatan */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: C.card, borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '28px', border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: '0 0 8px', color: C.text, fontWeight: '700' }}>Tolak Pengajuan</h3>
            <p style={{ margin: '0 0 16px', color: C.stone, fontSize: '13px' }}>Berikan catatan agar siswa tahu alasan penolakan dan bisa memperbaiki.</p>
            <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Contoh: Sertifikat tidak terbaca, mohon upload ulang dengan kualitas lebih baik." rows={4} style={{ ...inputStyle, resize: 'vertical', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setRejectModal(null); setRejectNote(''); }} style={btnStyle(C.stone, 'sm')}>Batal</button>
              <button onClick={() => handleRejectActivity(rejectModal)} style={btnStyle(C.danger, 'sm')}>Tolak & Kirim Catatan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Koreksi Klasifikasi Wali Kelas */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: C.card, borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '28px', border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: '0 0 6px', color: C.text, fontWeight: '700' }}>Koreksi Klasifikasi</h3>
            <p style={{ margin: '0 0 20px', color: C.stone, fontSize: '13px' }}>Ubah klasifikasi jika siswa salah mengisi. Poin akan dihitung ulang otomatis.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Tingkat</label>
                <select value={editModal.level} onChange={e => setEditModal({ ...editModal, level: e.target.value })} style={inputStyle}>
                  {['Sekolah','Kabupaten','Provinsi','Nasional','Internasional'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Peran</label>
                <select value={editModal.role} onChange={e => setEditModal({ ...editModal, role: e.target.value })} style={inputStyle}>
                  {['Peserta','Panitia','Juara/Perwakilan Resmi'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Penyelenggara</label>
                <select value={editModal.organizer} onChange={e => setEditModal({ ...editModal, organizer: e.target.value })} style={inputStyle}>
                  {['Swasta','Pemerintah','Sekolah'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ background: C.accentLight, padding: '12px', borderRadius: '10px', fontSize: '13px', color: C.accent, fontWeight: '600' }}>
                Estimasi poin setelah koreksi: <strong>+{calculatePoints(editModal.level, editModal.role, editModal.organizer)} poin</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setEditModal(null)} style={btnStyle(C.stone, 'sm')}>Batal</button>
              <button onClick={handleSaveEditClassification} style={btnStyle(C.accent, 'sm')}>Simpan Koreksi</button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH GRADES — 2-STEP VERIFICATION */}
      {publishConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: C.card, borderRadius: '18px', padding: '28px', maxWidth: '460px', width: '100%', border: `1px solid ${C.border}` }}>
            {publishConfirm.step === 1 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: C.warningLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={22} color={C.warning} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: C.text }}>Verifikasi Tahap 1</h3>
                </div>
                <p style={{ fontSize: '14px', color: C.stone, lineHeight: 1.6 }}>
                  Pastikan nilai sudah benar. Setelah dipublikasikan, <strong>{publishConfirm.count}</strong> entri nilai mapel <strong>{publishConfirm.subject}</strong> di kelas <strong>{publishConfirm.className}</strong> akan terlihat oleh siswa.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button onClick={() => setPublishConfirm(null)} style={btnStyle(C.stone, 'sm')}>Batal</button>
                  <button onClick={() => setPublishConfirm({ ...publishConfirm, step: 2 })} style={btnStyle(C.warning, 'sm')}>Lanjut Verifikasi →</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: C.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={22} color={C.success} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: C.text }}>Verifikasi Tahap 2 (Final)</h3>
                </div>
                <p style={{ fontSize: '14px', color: C.stone, lineHeight: 1.6 }}>
                  Konfirmasi akhir: publikasikan nilai sekarang? Tindakan ini akan langsung terlihat oleh seluruh siswa kelas <strong>{publishConfirm.className}</strong>.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button onClick={() => setPublishConfirm(null)} style={btnStyle(C.stone, 'sm')}>Batal</button>
                  <button onClick={() => {
                    const classStudentIds = users.filter(u => u.role === 'siswa' && u.className === publishConfirm.className).map(u => u.id);
                    setGrades(prev => prev.map(g => (
                      classStudentIds.includes(g.studentId) && g.subject === publishConfirm.subject
                        ? { ...g, published: true }
                        : g
                    )));
                    setPublishConfirm(null);
                    showToast(`${publishConfirm.count} entri nilai berhasil dipublikasikan!`, 'success');
                  }} style={btnStyle(C.success, 'sm')}><Send size={14}/> Publish Sekarang</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}



      {/* CSS RESPONSIVE */}
      <style>{`
        @media (min-width: 768px) {
          .aktiva-sidebar { transform: translateX(0) !important; }
          .aktiva-spacer { display: none !important; }
          .aktiva-bottomnav { display: none !important; }
          .aktiva-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .aktiva-sidebar { position: fixed !important; top: 0; left: 0; height: 100vh; z-index: 95; }
          .aktiva-spacer { display: none !important; }
          .aktiva-bottomnav { display: flex !important; }
          .aktiva-hamburger { display: flex !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #D0D8E0; border-radius: 4px; }
      `}</style>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 90 }} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="aktiva-sidebar" style={{ width: '240px', background: C.sidebar, color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, minHeight: '100vh', transition: 'transform 0.25s ease, background-color 0.3s', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={28} color={C.accentMid} />
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>AKTIVA</h2>
        </div>

        <div style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <SidebarItem id="dashboard" icon={<TrendingUp size={18} />} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
          
          {currentUser.role === 'siswa' && (
            <>
              {/* Menu Pengumuman Khusus Siswa */}
              <SidebarItem id="pengumuman" icon={<Calendar size={18} />} label="Pengumuman" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              <SidebarItem id="portofolio" icon={<Award size={18} />} label="Portofolioku" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              <SidebarItem id="nilai" icon={<BookOpen size={18} />} label="Nilai Akademik" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              <SidebarItem id="tryout" icon={<Trophy size={18} />} label="Try Out UTBK" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
            </>
          )}

          {currentUser.role === 'guru' && (
            <>
              {currentUser.isWaliKelas && <SidebarItem id="validasi" icon={<CheckCircle size={18} />} label="Validasi Portofolio" badge={pendingCount} activeTab={activeTab} setActiveTab={setActiveTab} C={C} />}
              <SidebarItem id="nilai" icon={<BookOpen size={18} />} label="Manajemen Nilai" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              {currentUser.isWaliKelas && <SidebarItem id="nilai-wali" icon={<Trophy size={18} />} label="Rapor Wali Kelas" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />}
              {currentUser.isWaliKelas && <SidebarItem id="tryout-input" icon={<Trophy size={18} />} label="Input Try Out UTBK" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />}

            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <SidebarItem id="pengguna" icon={<Users size={18} />} label="Kelola Pengguna" badge={pendingUsers} activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              <SidebarItem id="news" icon={<Newspaper size={18} />} label="Kelola News" activeTab={activeTab} setActiveTab={setActiveTab} C={C} />
              
            </>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }} onClick={() => setActiveTab(currentUser.role === 'siswa' ? 'profil' : 'pengaturan')}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.accentMid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#fff' }}>{currentUser.name}</div>
              <div style={{ fontSize: '11px', color: '#A0AAB5', textTransform: 'capitalize' }}>{currentUser.role} {currentUser.className ? `- ${currentUser.className}` : ''}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = C.danger} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* SIDEBAR SPACER DESKTOP */}
      <div className="aktiva-spacer" style={{ width: '0px', flexShrink: 0 }} />
      {/* MAIN LAYOUT */}
<main
  style={{
    flex: 1,
    height: '100vh',
    overflowY: 'auto',
    padding: '24px 32px 80px',
    width: '100%',
    boxSizing: 'border-box'
  }}
>
  <div
    style={{
      width: '100%',
      maxWidth: '1800px',
      margin: '0 auto'
    }}
  >
          {/* HEADER TOPBAR WITH NOTIFICATION & DARK MODE TOGGLE */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* HAMBURGER */}
              <button className="aktiva-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: 'none', background: C.card, border: `1px solid ${C.border}`, borderRadius: '10px', width: '38px', height: '38px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="2.5" rx="1.25" fill={C.stone}/><rect x="2" y="7.75" width="14" height="2.5" rx="1.25" fill={C.stone}/><rect x="2" y="12.5" width="14" height="2.5" rx="1.25" fill={C.stone}/></svg>
              </button>
              <div style={{ background: C.accentLight, color: C.accent, fontSize: '11px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentUser.role === 'siswa' ? `Siswa · Kelas ${currentUser.className}` : currentUser.role === 'guru' ? `Guru · ${currentUser.subject}` : 'Administrator'}
            </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

              {/* TOMBOL DARK MODE */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                title={isDarkMode ? "Matikan Mode Gelap" : "Aktifkan Mode Gelap"}
              >
                {isDarkMode ? <Sun size={18} color={C.warning} /> : <Moon size={18} color={C.stone} />}
              </button>

              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotif(!showNotif)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'background-color 0.3s' }}>
                  <Bell size={18} color={C.stone} />
                  {(pendingCount > 0 || pendingUsers > 0) && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: C.danger, borderRadius: '50%', border: '2px solid white' }} />}
                </button>
                
                {showNotif && (
                  <div style={{ position: 'absolute', right: 0, top: '48px', width: '280px', background: C.card, borderRadius: '16px', boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(44,53,64,0.15)', border: `1px solid ${C.border}`, zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, fontWeight: '700', fontSize: '13px', color: C.text }}>Notifikasi</div>
                    <div style={{ padding: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                      {currentUser.role === 'admin' && pendingUsers > 0 && (
                        <div onClick={() => { setActiveTab('pengguna'); setShowNotif(false); }} style={{ padding:'12px', borderRadius:'10px', cursor:'pointer', background: isDarkMode ? '#0F172A' : '#F5F0EB', marginBottom:'6px' }}>
                          <div style={{ fontWeight:'700', fontSize:'13px', color: C.text }}>{pendingUsers} pendaftaran akun baru</div>
                          <div style={{ fontSize:'12px', color: C.stone, marginTop:'2px' }}>Menunggu persetujuan</div>
                        </div>
                      )}
                      {isWaliKelas && pendingCount > 0 && (
                        <div onClick={() => { setActiveTab('validasi'); setShowNotif(false); }} style={{ padding:'12px', borderRadius:'10px', cursor:'pointer', background: isDarkMode ? '#0F172A' : '#F5F0EB', marginBottom:'6px' }}>
                          <div style={{ fontWeight:'700', fontSize:'13px', color: C.text }}>{pendingCount} dokumen portofolio</div>
                          <div style={{ fontSize:'12px', color: C.stone, marginTop:'2px' }}>Menunggu verifikasi</div>
                        </div>
                      )}
                      {((!isWaliKelas && pendingUsers === 0) || (pendingCount === 0 && pendingUsers === 0)) && (
                        <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: C.textMuted }}>Semua sudah dikerjakan 🎉</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB CONTENTS */}
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'pengumuman' && renderPengumumanSiswa()}
          {activeTab === 'portofolio' && renderPortofolio()}
          {activeTab === 'validasi' && renderValidasi()}
          {activeTab === 'nilai' && renderNilai()}
          {activeTab === 'nilai-wali' && renderNilaiWali()}
          {activeTab === 'pengguna' && renderPengguna()}
          {activeTab === 'news' && renderNewsAdmin()}
          {activeTab === 'future-path' && currentUser.role === 'siswa' && renderFuturePath()}
          {activeTab === 'tryout' && currentUser.role === 'siswa' && renderTryoutSiswa()}
          {activeTab === 'tryout-input' && currentUser.role === 'guru' && currentUser.isWaliKelas && renderTryoutWali()}

          {/* Untuk Siswa merujuk ke tab profil, Guru/Admin merujuk ke tab pengaturan */}
          {(activeTab === 'pengaturan' || activeTab === 'profil') && renderPengaturan()}
        </div>
      </main>
    </div>
  );
}
