import { useState, useEffect } from "react";
import type { Language } from "../fhevm/fhevmTypes";

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.sessions': 'Sessions',
    'nav.create': 'Create',
    'nav.profile': 'Profile',
    
    // Welcome page
    'welcome.title': 'Anonymous Check-In System',
    'welcome.subtitle': 'Privacy-preserving attendance tracking with FHEVM',
    'welcome.description': 'Create and participate in check-in sessions while keeping your data encrypted and private.',
    'welcome.getStarted': 'Get Started',
    'welcome.features.title': 'Features',
    'welcome.features.privacy': 'Complete Privacy',
    'welcome.features.privacy.desc': 'All check-in data is encrypted using FHEVM technology',
    'welcome.features.anonymous': 'Anonymous Participation',
    'welcome.features.anonymous.desc': 'Only verification status is public, not personal data',
    'welcome.features.secure': 'Secure & Decentralized',
    'welcome.features.secure.desc': 'Built on Ethereum with homomorphic encryption',
    
    // Wallet
    'wallet.connect': 'Connect Wallet',
    'wallet.disconnect': 'Disconnect',
    'wallet.connected': 'Connected',
    'wallet.notConnected': 'Not Connected',
    'wallet.switchNetwork': 'Switch Network',
    
    // Sessions
    'sessions.title': 'Check-In Sessions',
    'sessions.create': 'Create New Session',
    'sessions.active': 'Active Sessions',
    'sessions.ended': 'Ended Sessions',
    'sessions.participants': 'Participants',
    'sessions.duration': 'Duration',
    'sessions.timeLeft': 'Time Left',
    'sessions.checkIn': 'Check In',
    'sessions.checkedIn': 'Checked In',
    'sessions.endSession': 'End Session',
    'sessions.noSessions': 'No sessions available',
    'sessions.loading': 'Loading sessions...',
    
    // Create Session
    'create.title': 'Create Check-In Session',
    'create.sessionTitle': 'Session Title',
    'create.description': 'Description',
    'create.duration': 'Duration (hours)',
    'create.create': 'Create Session',
    'create.cancel': 'Cancel',
    'create.creating': 'Creating...',
    'create.success': 'Session created successfully!',
    
    // Check-in
    'checkin.title': 'Check In',
    'checkin.encrypting': 'Encrypting data...',
    'checkin.submitting': 'Submitting check-in...',
    'checkin.success': 'Check-in successful!',
    'checkin.error': 'Check-in failed',
    'checkin.alreadyCheckedIn': 'Already checked in',
    
    // Profile
    'profile.title': 'Profile',
    'profile.activityScore': 'Activity Score',
    'profile.totalCheckIns': 'Total Check-ins',
    'profile.sessionsCreated': 'Sessions Created',
    'profile.sessionsParticipated': 'Sessions Participated',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.retry': 'Retry',
    'common.refresh': 'Refresh',
    
    // Time
    'time.hours': 'hours',
    'time.minutes': 'minutes',
    'time.seconds': 'seconds',
    'time.ended': 'Ended',
    'time.active': 'Active',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.sessions': '签到会话',
    'nav.create': '创建',
    'nav.profile': '个人资料',
    
    // Welcome page
    'welcome.title': '匿名签到系统',
    'welcome.subtitle': '基于FHEVM的隐私保护考勤追踪',
    'welcome.description': '创建和参与签到会话，同时保持您的数据加密和私密。',
    'welcome.getStarted': '开始使用',
    'welcome.features.title': '功能特点',
    'welcome.features.privacy': '完全隐私',
    'welcome.features.privacy.desc': '所有签到数据使用FHEVM技术加密',
    'welcome.features.anonymous': '匿名参与',
    'welcome.features.anonymous.desc': '只有验证状态公开，个人数据保密',
    'welcome.features.secure': '安全去中心化',
    'welcome.features.secure.desc': '基于以太坊和同态加密构建',
    
    // Wallet
    'wallet.connect': '连接钱包',
    'wallet.disconnect': '断开连接',
    'wallet.connected': '已连接',
    'wallet.notConnected': '未连接',
    'wallet.switchNetwork': '切换网络',
    
    // Sessions
    'sessions.title': '签到会话',
    'sessions.create': '创建新会话',
    'sessions.active': '活跃会话',
    'sessions.ended': '已结束会话',
    'sessions.participants': '参与者',
    'sessions.duration': '持续时间',
    'sessions.timeLeft': '剩余时间',
    'sessions.checkIn': '签到',
    'sessions.checkedIn': '已签到',
    'sessions.endSession': '结束会话',
    'sessions.noSessions': '暂无可用会话',
    'sessions.loading': '加载会话中...',
    
    // Create Session
    'create.title': '创建签到会话',
    'create.sessionTitle': '会话标题',
    'create.description': '描述',
    'create.duration': '持续时间（小时）',
    'create.create': '创建会话',
    'create.cancel': '取消',
    'create.creating': '创建中...',
    'create.success': '会话创建成功！',
    
    // Check-in
    'checkin.title': '签到',
    'checkin.encrypting': '加密数据中...',
    'checkin.submitting': '提交签到中...',
    'checkin.success': '签到成功！',
    'checkin.error': '签到失败',
    'checkin.alreadyCheckedIn': '已经签到过了',
    
    // Profile
    'profile.title': '个人资料',
    'profile.activityScore': '活跃度分数',
    'profile.totalCheckIns': '总签到次数',
    'profile.sessionsCreated': '创建的会话',
    'profile.sessionsParticipated': '参与的会话',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.close': '关闭',
    'common.retry': '重试',
    'common.refresh': '刷新',
    
    // Time
    'time.hours': '小时',
    'time.minutes': '分钟',
    'time.seconds': '秒',
    'time.ended': '已结束',
    'time.active': '活跃',
  },
};

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language['code']>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language['code'];
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (code: Language['code']) => {
    setCurrentLanguage(code);
    localStorage.setItem('language', code);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]] || key;
  };

  return {
    currentLanguage,
    languages,
    changeLanguage,
    t,
  };
}
