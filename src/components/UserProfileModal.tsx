import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  School,
  Award,
  Trophy,
  Flame,
  TrendingUp,
  LogOut,
  UserCheck,
  Edit3,
  Check,
  Sparkles,
} from 'lucide-react';

const AVATAR_OPTIONS = ['👦', '👧', '👨‍🎓', '👩‍🎓', '🧑‍💻', '🚀', '🌟', '🦁', '🐯', '👩‍🏫', '👨‍🏫', '🦊'];

export const UserProfileModal: React.FC = () => {
  const {
    currentUser,
    isUserProfileModalOpen,
    setIsUserProfileModalOpen,
    updateCurrentProfile,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    currentStudent,
    role,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '👦');
  const [bio, setBio] = useState(currentUser?.bio || '');

  if (!isUserProfileModalOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile({
      name: name.trim() || currentUser.name,
      avatar,
      bio: bio.trim(),
    });
    setIsEditing(false);
  };

  const handleSwitchAccount = () => {
    setIsUserProfileModalOpen(false);
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <div
      id="user-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="user-profile-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-indigo-900/60 via-slate-800 to-indigo-950/60 p-6 border-b border-slate-800">
          <button
            id="close-profile-modal-btn"
            onClick={() => {
              setIsEditing(false);
              setIsUserProfileModalOpen(false);
            }}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500/60 flex items-center justify-center text-3xl shadow-lg">
              {currentUser.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-100">{currentUser.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentUser.role === 'teacher'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-mono mt-0.5">{currentUser.email}</p>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser.className} • {currentUser.sectionName}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Edit Profile Details
              </h3>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Avatar</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        avatar === av
                          ? 'bg-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Bio block */}
              {currentUser.bio && (
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-750 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 block mb-0.5 text-[10px] uppercase">
                    Bio / Status
                  </span>
                  {currentUser.bio}
                </div>
              )}

              {/* Student Stats Cards (if student) */}
              {role === 'student' && currentStudent && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-750 text-center">
                    <div className="flex items-center justify-center text-amber-400 mb-1">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">#{currentStudent.rankInClass}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Class Rank</div>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-750 text-center">
                    <div className="flex items-center justify-center text-orange-400 mb-1">
                      <Flame className="w-4 h-4 fill-orange-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">{currentStudent.streakDays}d</div>
                    <div className="text-[10px] text-slate-400 font-medium">Streak</div>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-750 text-center">
                    <div className="flex items-center justify-center text-indigo-400 mb-1">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-indigo-300">{currentStudent.points}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Total Points</div>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-800 text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Login:</span>
                  </span>
                  <span className="font-semibold text-slate-200 font-mono">{currentUser.email}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800 text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <School className="w-3.5 h-3.5" />
                    <span>Enrolled Section:</span>
                  </span>
                  <span className="font-semibold text-slate-200">
                    {currentUser.className} - {currentUser.sectionName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Member Since:</span>
                  </span>
                  <span className="font-semibold text-slate-200">{currentUser.createdAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  id="edit-profile-btn"
                  onClick={() => {
                    setName(currentUser.name);
                    setAvatar(currentUser.avatar);
                    setBio(currentUser.bio || '');
                    setIsEditing(true);
                  }}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Edit Profile</span>
                </button>

                <button
                  id="switch-account-btn"
                  onClick={handleSwitchAccount}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch Account</span>
                </button>

                <button
                  id="logout-btn"
                  onClick={logout}
                  className="py-2 px-3 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
