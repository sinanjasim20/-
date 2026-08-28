import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Zap,
  BookOpen
} from 'lucide-react';
import { AppUser } from '../types';
import { AppStorageService, INITIAL_USERS } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
  initialMode?: 'login' | 'register';
  reasonMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  reasonMessage = 'لمشاهدة محتوى الدروس والفيديوهات، يرجى تسجيل الدخول أو إنشاء حساب جديد.',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('الهندسة والتقنيات الذكية');
  const [role, setRole] = useState<'student' | 'engineer' | 'instructor'>('engineer');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanIdentifier = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanIdentifier || !cleanPass) {
      setError('يرجى إدخال اسم الحساب (أو البريد) وكلمة المرور.');
      return;
    }

    const users = AppStorageService.getUsers();
    const foundUser = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier) &&
        (!u.password || u.password === cleanPass)
    );

    if (foundUser) {
      setSuccessMsg(`مرحباً بعودتك يا ${foundUser.fullName || foundUser.username}!`);
      setTimeout(() => {
        onSuccess(foundUser);
      }, 500);
    } else {
      setError('اسم الحساب أو كلمة المرور غير صحيحة. يمكنك إنشاء حساب جديد أو استخدام الحساب التجريبي.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanFullName = fullName.trim() || cleanUsername;

    if (!cleanUsername) {
      setError('يرجى إدخال اسم الحساب (Username).');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setError('كلمة المرور يجب أن تتكون من 4 أحرف أو أرقام على الأقل.');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    const users = AppStorageService.getUsers();
    const exists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      setError('اسم الحساب أو البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.');
      return;
    }

    // Create new user
    const newUser: AppUser = {
      id: 'user-' + Date.now(),
      username: cleanUsername,
      fullName: cleanFullName,
      email: cleanEmail,
      password: cleanPassword,
      role,
      specialty,
      avatar: `https://images.unsplash.com/photo-${role === 'engineer' ? '1535713875002-d1d0cf377fde' : '1570295999919-56ceb5ecca61'}?w=200&auto=format&fit=crop&q=80`,
      createdAt: Date.now(),
    };

    const updatedUsers = [newUser, ...users];
    AppStorageService.saveUsers(updatedUsers);

    setSuccessMsg(`تم إنشاء حسابك بنجاح! مرحباً بك في البعد السادس الهندسي يا ${cleanFullName}.`);
    setTimeout(() => {
      onSuccess(newUser);
    }, 600);
  };

  const handleQuickDemoLogin = (demoUser: AppUser) => {
    setError(null);
    setSuccessMsg(`تم تسجيل الدخول بحساب: ${demoUser.fullName}`);
    setTimeout(() => {
      onSuccess(demoUser);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-[#12141C] border border-[#242731] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="p-4 bg-gradient-to-r from-[#1D212B] to-[#12141C] border-b border-[#242731] flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#0A0B0E] flex items-center justify-center font-black shadow-lg shadow-[#D4AF37]/20">
              <Sparkles className="w-5 h-5 fill-[#0A0B0E]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-['Cairo',sans-serif]">
                البعد السادس الهندسي
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-bold">بوابة تسجيل ومصادقة المستخدمين</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reason banner */}
        {reasonMessage && (
          <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 px-4 py-2.5 flex items-center gap-2 text-xs text-[#E2E2E2]">
            <Lock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span className="leading-snug">{reasonMessage}</span>
          </div>
        )}

        {/* Auth Mode Toggle Tabs */}
        <div className="p-3 bg-[#0A0B0E] border-b border-[#242731]">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#12141C] rounded-2xl border border-[#242731]">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-[#D4AF37] text-[#0A0B0E] shadow font-extrabold'
                  : 'text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-[#D4AF37] text-[#0A0B0E] shadow font-extrabold'
                  : 'text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* Notifications */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Username / Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>اسم الحساب أو البريد الإلكتروني:</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: sinan_eng أو yourname@gmail.com"
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>كلمة المرور:</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الخاصة بحسابك"
                    className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl pr-3.5 pl-10 py-2.5 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8D98] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول وبدء المشاهدة الآن</span>
              </button>

              {/* Demo Account Quick Access */}
              <div className="pt-3 border-t border-[#242731] space-y-2">
                <span className="text-[11px] font-bold text-[#8A8D98] block text-center">
                  ⚡ حسابات تجريبية للدخول الفوري بنقرة واحدة:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(INITIAL_USERS[0])}
                    className="p-2 bg-[#1D212B] hover:bg-[#242731] border border-[#242731] hover:border-[#D4AF37]/40 rounded-xl text-right transition-all flex items-center gap-2"
                  >
                    <img
                      src={INITIAL_USERS[0].avatar}
                      alt="Sinan"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#D4AF37]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-white truncate">م. سنان جاسم</p>
                      <p className="text-[9px] text-[#D4AF37] truncate">مهندس تقني</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(INITIAL_USERS[1])}
                    className="p-2 bg-[#1D212B] hover:bg-[#242731] border border-[#242731] hover:border-[#D4AF37]/40 rounded-xl text-right transition-all flex items-center gap-2"
                  >
                    <img
                      src={INITIAL_USERS[1].avatar}
                      alt="Student"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#D4AF37]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-white truncate">أحمد التميمي</p>
                      <p className="text-[9px] text-[#D4AF37] truncate">طالب هندسة</p>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* MODE: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>اسم الحساب (Username) *:</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: sinan2026 أو engineer_user"
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>الاسم الظاهر / اللقب:</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: المهندس سنان جاسم"
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>البريد الإلكتروني (Email) *:</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-[#D4AF37]" />
                    <span>كلمة المرور *:</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>تأكيد المرور *:</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>
              </div>

              {/* Specialty & Role Selection */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#8A8D98]">صفة الحساب:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="engineer">مهندس مختص</option>
                    <option value="student">طالب / متدرب</option>
                    <option value="instructor">مدرب / محاضر</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#8A8D98]">التخصص الهندسي:</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="مثال: هندسة تقنية"
                    className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#6C707E] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/20 active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب والمشاهدة فوراً</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0A0B0E] border-t border-[#242731] text-center text-[10px] text-[#8A8D98]">
          <span>بياناتك محفوظة محلياً ومشفرة بأمان على تطبيق البعد السادس الهندسي ✓</span>
        </div>
      </div>
    </div>
  );
};
