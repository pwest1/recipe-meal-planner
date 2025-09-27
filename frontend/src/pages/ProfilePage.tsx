import type { UserProfile } from '../services/userService';
import type { AuthUser } from '../auth/useAuth'; 

interface ProfilePageProps {
  user: AuthUser | null;
  profile: UserProfile | null;
}

export const ProfilePage = ({ user, profile }: ProfilePageProps) => {
  return (
    <div className="card p-8 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 gradient-text">Profile Information</h2>
      <div className="space-y-6">
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
          <div className="text-lg text-neutral-900 font-medium">{user?.email}</div>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Username</label>
          <div className="text-lg text-neutral-900 font-medium">{profile?.username}</div>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Member Since</label>
          <div className="text-lg text-neutral-900 font-medium">
            {profile && new Date(profile.createdAt || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};