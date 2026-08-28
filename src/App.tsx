import React, { useState } from 'react';
import { Header } from './components/Header';
import { SentinelBanner } from './components/SentinelBanner';
import { DashboardView } from './components/DashboardView';
import { RuleManager } from './components/RuleManager';
import { SchedulerDirectory } from './components/SchedulerDirectory';
import { SimulatorPlayground } from './components/SimulatorPlayground';
import { AuditLogView } from './components/AuditLogView';
import { ICloudConnectionModal } from './components/iCloudConnectionModal';
import { ProfileModal } from './components/ProfileModal';
import { EmailDiagnosticsModal } from './components/EmailDiagnosticsModal';

import { storageService } from './services/storageService';
import { ICloudCalDAVClient } from './engine/caldavClient';
import { generateClinicalEmail } from './engine/dispatcher';
import { ProtectionRule, Scheduler, NotificationRecord, ICloudConnectionConfig, SurgeonProfile, EmailRelayConfig } from './types/vigilor';

export const App: React.FC = () => {
  // App State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'schedulers' | 'simulator' | 'audit'>('dashboard');
  const [rules, setRules] = useState<ProtectionRule[]>(storageService.getRules());
  const [schedulers, setSchedulers] = useState<Scheduler[]>(storageService.getSchedulers());
  const [notifications, setNotifications] = useState<NotificationRecord[]>(storageService.getNotifications());
  const [icloudConfig, setIcloudConfig] = useState<ICloudConnectionConfig>(storageService.getICloudConfig());
  const [emailConfig, setEmailConfig] = useState<EmailRelayConfig>(storageService.getEmailConfig());
  const [profile, setProfile] = useState<SurgeonProfile>(storageService.getSurgeonProfile());
  const [isPaused, setIsPaused] = useState<boolean>(storageService.isSentinelPaused());
  
  // Modals & UI States
  const [isICloudModalOpen, setIsICloudModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(icloudConfig.lastSyncAt);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show quick toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Profile Handlers
  const handleSaveProfile = (updatedProfile: SurgeonProfile) => {
    setProfile(updatedProfile);
    storageService.saveSurgeonProfile(updatedProfile);
    triggerToast('Surgeon profile updated.');
  };

  // Rule Handlers
  const handleSaveRules = (updatedRules: ProtectionRule[]) => {
    setRules(updatedRules);
    storageService.saveRules(updatedRules);
    triggerToast('Protection rules saved successfully.');
  };

  const handleToggleRule = (ruleId: string) => {
    const updated = rules.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r);
    setRules(updated);
    storageService.saveRules(updated);
  };

  // Scheduler Handlers
  const handleSaveSchedulers = (updatedSchedulers: Scheduler[]) => {
    setSchedulers(updatedSchedulers);
    storageService.saveSchedulers(updatedSchedulers);
    triggerToast('Scheduler directory updated.');
  };

  const handleSendTestPing = (scheduler: Scheduler) => {
    const emailPayload = generateClinicalEmail(
      profile,
      scheduler,
      'Wednesday from 12:00 PM to 5:00 PM',
      'Personal Block (OR Blackout)',
      `test_${Date.now()}`
    );

    const testRecord: NotificationRecord = {
      id: `notif_test_${Date.now()}`,
      ruleId: 'rule_test_ping',
      ruleName: 'Verification Handshake Test',
      schedulerId: scheduler.id,
      schedulerName: scheduler.fullName,
      schedulerFacility: scheduler.facilityName,
      recipientEmail: scheduler.email,
      eventUid: 'evt_ping_test',
      eventSummary: 'VigilOR Test Verification Notice',
      eventStart: new Date().toISOString(),
      eventEnd: new Date().toISOString(),
      emailSubject: emailPayload.subject,
      emailHtml: emailPayload.html,
      emailText: emailPayload.text,
      deliveryStatus: 'SENT',
      sentAt: new Date().toISOString(),
      ackStatus: 'UNACKNOWLEDGED'
    };

    const updated = [testRecord, ...notifications];
    setNotifications(updated);
    storageService.saveNotifications(updated);
    
    // Open default mail client
    const mailto = `mailto:${scheduler.email}?subject=${encodeURIComponent(emailPayload.subject)}&body=${encodeURIComponent(emailPayload.text)}`;
    window.open(mailto, '_blank');

    triggerToast(`Official test notice prepared for ${scheduler.fullName} (${scheduler.email}).`);
  };

  // Notification / Ack Handlers
  const handleRecordNotification = (newRecord: NotificationRecord) => {
    const updated = [newRecord, ...notifications];
    setNotifications(updated);
    storageService.saveNotifications(updated);
    triggerToast(`Email alert sent to ${newRecord.schedulerName}`);
  };

  const handleAckNotification = (notificationId: string, status: 'ACKNOWLEDGED' | 'CONFLICT') => {
    storageService.updateNotificationAck(notificationId, status);
    setNotifications(storageService.getNotifications());
    triggerToast(`Alert status updated to ${status}.`);
  };

  const handleClearLogs = () => {
    storageService.resetToDefaults();
    setRules(storageService.getRules());
    setSchedulers(storageService.getSchedulers());
    setNotifications(storageService.getNotifications());
    setProfile(storageService.getSurgeonProfile());
    setEmailConfig(storageService.getEmailConfig());
    triggerToast('History reset to clean state.');
  };

  // CalDAV Sync Trigger
  const handleManualSync = async () => {
    setIsSyncing(true);
    const client = new ICloudCalDAVClient(icloudConfig.appleId, icloudConfig.appSpecificPasswordMasked, icloudConfig.selectedCalendarName);
    const report = await client.performDeltaSync();
    
    setIsSyncing(false);
    const nowIso = new Date().toISOString();
    setLastSyncTime(nowIso);
    
    const updatedConfig = { ...icloudConfig, lastSyncAt: nowIso, isConnected: true };
    setIcloudConfig(updatedConfig);
    storageService.saveICloudConfig(updatedConfig);
    
    triggerToast(`iCloud CalDAV Delta Sync: Scanned ${report.totalEventsScanned} calendar events.`);
  };

  // Snooze / Pause Toggle
  const handleTogglePause = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    storageService.setSentinelPaused(nextState);
    triggerToast(nextState ? 'Sentinel paused. Alerts suspended.' : 'Sentinel monitoring resumed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-semibold text-xs py-3 px-5 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center space-x-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPaused={isPaused}
        isSyncing={isSyncing}
        onManualSync={handleManualSync}
        icloudConfig={icloudConfig}
        onOpenICloudModal={() => setIsICloudModalOpen(true)}
        profile={profile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* Sentinel Live Status Banner */}
      <SentinelBanner
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        rules={rules}
        schedulers={schedulers}
        lastSyncTime={lastSyncTime}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            rules={rules}
            schedulers={schedulers}
            notifications={notifications}
            profile={profile}
            icloudConfig={icloudConfig}
            onNavigate={setActiveTab}
            onToggleRule={handleToggleRule}
            onOpenICloudModal={() => setIsICloudModalOpen(true)}
          />
        )}

        {activeTab === 'rules' && (
          <RuleManager
            rules={rules}
            schedulers={schedulers}
            onSaveRules={handleSaveRules}
          />
        )}

        {activeTab === 'schedulers' && (
          <SchedulerDirectory
            schedulers={schedulers}
            onSaveSchedulers={handleSaveSchedulers}
            onSendTestPing={handleSendTestPing}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorPlayground
            rules={rules}
            schedulers={schedulers}
            profile={profile}
            onRecordNotification={handleRecordNotification}
            onAckNotification={handleAckNotification}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView
            notifications={notifications}
            schedulers={schedulers}
            onAckNotification={handleAckNotification}
            onClearLogs={handleClearLogs}
          />
        )}
      </main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* iCloud Connection Modal */}
      <ICloudConnectionModal
        isOpen={isICloudModalOpen}
        onClose={() => setIsICloudModalOpen(false)}
        config={icloudConfig}
        onSaveConfig={(updated) => {
          setIcloudConfig(updated);
          storageService.saveICloudConfig(updated);
          triggerToast('iCloud configuration saved.');
        }}
      />

      {/* Clinical Email Relay Diagnostics Modal */}
      <EmailDiagnosticsModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailConfig={emailConfig}
        onSaveEmailConfig={(updated) => {
          setEmailConfig(updated);
          storageService.saveEmailConfig(updated);
          triggerToast('Email relay settings saved.');
        }}
        icloudConfig={icloudConfig}
        profile={profile}
        schedulers={schedulers}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VigilOR • {profile.name}, {profile.title} • {profile.specialty}</span>
          <span>Apple iCloud CalDAV (RFC 4791) • Official OR Blackout Email Relay</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
