import { useState } from 'react'
import { User, Store, Shield, Key, Check, Lock, AlertCircle } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Input from '../components/ui/Input'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo Store Owner',
    email: user?.email || 'owner@kiranastore.com',
    phone: '+91 98765 43210',
    storeName: 'Sharma General Kirana',
    gstin: '29ABCDE1234F1Z5',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
  })

  const [isSaved, setIsSaved] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required.')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setPasswordError('')
    setPasswordSuccess('Password successfully updated!')
    setTimeout(() => {
      setPasswordSuccess('')
      setIsPasswordModalOpen(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Store Profile & Account"
        description="Manage store owner details, business GSTIN number, access credentials, and security preferences."
        badge="Account Settings"
        actions={
          <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
            <Key className="h-3.5 w-3.5" /> Change Password
          </Button>
        }
      />

      {/* Header Profile Summary */}
      <Card className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-[#111827] via-[#030712] to-[#111827] border-[#00D9FF]/30">
        <Avatar name={profileData.name} size="lg" className="h-20 w-20 text-xl border-2 border-[#00D9FF]" />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-[#F8FAFC]">{profileData.name}</h2>
            <Badge tone="primary">Pro Store Manager</Badge>
          </div>
          <p className="text-sm text-[#94A3B8]">{profileData.email}</p>
          <p className="text-xs text-[#94A3B8] flex items-center justify-center sm:justify-start gap-1">
            <Store className="h-3.5 w-3.5 text-[#00D9FF]" /> {profileData.storeName} • GSTIN: {profileData.gstin}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal & Store Information Form */}
        <Card title="Store & Personal Information">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Manager Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
            <Input
              label="Primary Email Address"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              required
            />
            <Input
              label="Store Registered Name"
              value={profileData.storeName}
              onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
              required
            />
            <Input
              label="GSTIN Number"
              value={profileData.gstin}
              onChange={(e) => setProfileData({ ...profileData, gstin: e.target.value })}
            />
            <Input
              label="Store Premises Address"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            />

            {isSaved ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 p-3 text-xs text-[#10B981]">
                <Check className="h-4 w-4" /> Profile changes updated successfully!
              </div>
            ) : null}

            <Button type="submit" variant="primary" className="w-full">
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Security & Access Preferences */}
        <Card title="Security & Authentication Preferences">
          <div className="space-y-4 text-xs text-[#94A3B8]">
            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#F8FAFC]">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] mt-0.5">Protect POS billing terminal with TOTP</p>
              </div>
              <Badge tone="success">Enabled</Badge>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#F8FAFC]">AI Copilot API Key</p>
                <p className="text-[11px] mt-0.5">Encrypted local key active</p>
              </div>
              <Badge tone="neutral">Active</Badge>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#F8FAFC]">Account Password</p>
                <p className="text-[11px] mt-0.5">Last updated 14 days ago</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}>
                Update
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Account Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />
          <PasswordInput
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="Minimum 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            placeholder="Re-enter new password"
          />

          {passwordError ? (
            <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          ) : null}

          {passwordSuccess ? (
            <div className="flex items-center gap-2 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 p-3 text-xs text-[#10B981]">
              <Check className="h-4 w-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          ) : null}

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Profile

