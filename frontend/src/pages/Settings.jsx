import { useState } from 'react'
import { Settings as SettingsIcon, Sliders, Shield, Bell, Moon, Database, Check, Printer, Globe } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaved, setIsSaved] = useState(false)

  // Settings State
  const [settings, setSettings] = useState({
    storeName: 'Sharma General Kirana',
    currency: '₹ (INR)',
    gstRate: '5',
    language: 'English (India)',
    printerType: 'Thermal 80mm (ESC/POS)',
    autoPrintReceipt: true,
    soundAlerts: true,
    whatsappReminders: true,
    lowStockSms: true,
    dailyEmailSummary: false,
    darkMode: true,
    cloudSync: true,
    autoBackupFrequency: 'Daily at 11:50 PM',
  })

  const tabs = [
    { id: 'general', label: 'General & Localization', icon: Globe },
    { id: 'pos', label: 'POS & Thermal Printer', icon: Printer },
    { id: 'notifications', label: 'Alerts & Communications', icon: Bell },
    { id: 'security', label: 'Cloud & Database Backups', icon: Database },
  ]

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="System Configuration & Preferences"
        description="Configure store parameters, POS receipt thermal printer drivers, tax defaults, and backup policies."
        badge="Settings Control"
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1F2937] pb-2 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === id
                ? 'border border-[#00D9FF]/40 bg-[#00D9FF] text-[#030712] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'border border-[#1F2937] bg-[#111827] text-[#94A3B8] hover:border-[#374151] hover:text-[#F8FAFC]'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: General Settings */}
        {activeTab === 'general' ? (
          <Card title="General & Localization Defaults">
            <div className="space-y-4 max-w-xl">
              <Input
                label="Store Display Name"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                  Currency Symbol & Formatting
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
                >
                  <option value="₹ (INR)">₹ (INR - Indian Rupee)</option>
                  <option value="$ (USD)">$ (USD - US Dollar)</option>
                </select>
              </div>
              <Input
                label="Default GST Tax Percentage (%)"
                type="number"
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: e.target.value })}
              />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                  Interface Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
                >
                  <option value="English (India)">English (India)</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                  <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                  <option value="Telugu (తెలుగు)">Telugu (తెలుగు)</option>
                  <option value="Kannada (கன்னட)">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Tab 2: POS Settings */}
        {activeTab === 'pos' ? (
          <Card title="POS Billing & Thermal Printer Driver">
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                  Receipt Thermal Printer Paper Size
                </label>
                <select
                  value={settings.printerType}
                  onChange={(e) => setSettings({ ...settings, printerType: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
                >
                  <option value="Thermal 80mm (ESC/POS)">80mm / 3 Inch Roll (Standard POS)</option>
                  <option value="Thermal 58mm (ESC/POS)">58mm / 2 Inch Mini Roll</option>
                  <option value="A4 Standard Laser">A4 Full Sheet (Laser Printer)</option>
                </select>
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">Auto-Print Receipt on Sale Completion</p>
                  <p className="text-[11px] text-[#94A3B8]">Trigger browser print popup immediately after billing</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPrintReceipt}
                  onChange={(e) => setSettings({ ...settings, autoPrintReceipt: e.target.checked })}
                  className="h-4 w-4 accent-[#00D9FF]"
                />
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">Sound FX Beep on Barcode Scan</p>
                  <p className="text-[11px] text-[#94A3B8]">Audio confirmation on item addition</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => setSettings({ ...settings, soundAlerts: e.target.checked })}
                  className="h-4 w-4 accent-[#00D9FF]"
                />
              </div>
            </div>
          </Card>
        ) : null}

        {/* Tab 3: Notifications Settings */}
        {activeTab === 'notifications' ? (
          <Card title="Alert Communication Channels">
            <div className="space-y-4 max-w-xl text-xs">
              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">WhatsApp Udhar Payment Reminders</p>
                  <p className="text-[11px] text-[#94A3B8]">Automated 1-click WhatsApp message button generation</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsappReminders}
                  onChange={(e) => setSettings({ ...settings, whatsappReminders: e.target.checked })}
                  className="h-4 w-4 accent-[#00D9FF]"
                />
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">Low Stock SMS Dispatch to Supplier</p>
                  <p className="text-[11px] text-[#94A3B8]">Send automated purchase orders via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.lowStockSms}
                  onChange={(e) => setSettings({ ...settings, lowStockSms: e.target.checked })}
                  className="h-4 w-4 accent-[#00D9FF]"
                />
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">Daily Evening E-mail Summary</p>
                  <p className="text-[11px] text-[#94A3B8]">E-mailed total sales and GST calculation PDF</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyEmailSummary}
                  onChange={(e) => setSettings({ ...settings, dailyEmailSummary: e.target.checked })}
                  className="h-4 w-4 accent-[#00D9FF]"
                />
              </div>
            </div>
          </Card>
        ) : null}

        {/* Tab 4: Security & Backups */}
        {activeTab === 'security' ? (
          <Card title="Cloud Database & Local Backup Policy">
            <div className="space-y-4 max-w-xl text-xs">
              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#F8FAFC]">Automated Cloud Sync</p>
                  <p className="text-[11px] text-[#94A3B8]">Sync transaction ledger every 5 minutes</p>
                </div>
                <Badge tone="success">Active Sync</Badge>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                  Database Snapshot Schedule
                </label>
                <select
                  value={settings.autoBackupFrequency}
                  onChange={(e) => setSettings({ ...settings, autoBackupFrequency: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
                >
                  <option value="Daily at 11:50 PM">Daily at 11:50 PM</option>
                  <option value="Weekly Every Sunday">Weekly Every Sunday</option>
                  <option value="Manual Only">Manual Backup Only</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => alert('Kirana OS database snapshot JSON exported!')}
                >
                  Export Local Database Snapshot (.JSON)
                </Button>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="mt-6 flex items-center gap-4">
          <Button type="submit" variant="primary">
            Save System Settings
          </Button>

          {isSaved ? (
            <span className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold animate-fade-in">
              <Check className="h-4 w-4" /> Preferences saved!
            </span>
          ) : null}
        </div>
      </form>
    </div>
  )
}

export default Settings
