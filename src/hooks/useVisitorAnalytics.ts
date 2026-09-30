import { useEffect, useRef, useState, useCallback } from 'react';
import { ActivePage, UserProfile, DeviceType } from '../types';
import {
  recordLocalSessionStart,
  recordLocalPageView,
  recordLocalHeartbeat,
  recordLocalSessionEnd,
} from '../utils/localAnalyticsStore';

const VISITOR_ID_KEY = 'cybermentor_visitor_id';
const SESSION_ID_KEY = 'cybermentor_active_session_id';
const PRIVACY_DISMISSED_KEY = 'cybermentor_analytics_notice_dismissed';

function getOrGenerateVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return `anon_transient_${Date.now()}`;
  }
}

function getOrGenerateSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return `sess_transient_${Date.now()}`;
  }
}

function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  const isTabletUa =
    /ipad|android(?!.*mobile)|tablet/.test(ua) ||
    (navigator.maxTouchPoints > 1 && /macintosh/.test(ua));
  const isMobileUa = /mobile|iphone|ipod|android.*mobile|windows phone/.test(ua);

  if (isTabletUa || (width >= 640 && width <= 1024 && navigator.maxTouchPoints > 0)) {
    return 'tablet';
  }
  if (isMobileUa || width < 768) {
    return 'mobile';
  }
  return 'desktop';
}

interface UseVisitorAnalyticsOptions {
  activePage: ActivePage;
  user?: UserProfile;
}

export function useVisitorAnalytics({ activePage, user }: UseVisitorAnalyticsOptions) {
  const visitorIdRef = useRef<string>(getOrGenerateVisitorId());
  const sessionIdRef = useRef<string>(getOrGenerateSessionId());
  const deviceTypeRef = useRef<DeviceType>(detectDeviceType());
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const previousPageRef = useRef<string>('');

  const [hasDismissedPrivacyNotice, setHasDismissedPrivacyNotice] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRIVACY_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const dismissPrivacyNotice = useCallback(() => {
    setHasDismissedPrivacyNotice(true);
    try {
      localStorage.setItem(PRIVACY_DISMISSED_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  // Track user activity (mouse, key, touch, scroll) to pause heartbeats when idle
  useEffect(() => {
    const handleUserActivity = () => {
      lastActiveTimestampRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, []);

  // 1. Initialize Session on mount
  useEffect(() => {
    const visitorId = visitorIdRef.current;
    const sessionId = sessionIdRef.current;
    const deviceType = deviceTypeRef.current;
    const audienceType = user?.audienceType || 'unspecified';
    const isIdentified = !!(user && user.email && user.email.trim().length > 0);

    const payload = {
      sessionId,
      visitorId,
      deviceType,
      page: activePage,
      audienceType,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userId: isIdentified ? user.studentId || user.email : undefined,
      userEmail: isIdentified ? user.email : undefined,
    };

    // Keep client-side mirror updated for static deployments (e.g. Vercel, Netlify)
    recordLocalSessionStart({
      sessionId,
      visitorId,
      deviceType,
      page: activePage,
      audienceType: audienceType as any,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userId: isIdentified ? user.studentId || user.email : undefined,
      userEmail: isIdentified ? user.email : undefined,
    });

    fetch('/api/analytics/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Fail silently to keep application performance 100% resilient
    });
  }, []); // Run once on startup

  // 2. Track Page View whenever activePage changes
  useEffect(() => {
    if (previousPageRef.current === activePage) return;
    previousPageRef.current = activePage;

    const visitorId = visitorIdRef.current;
    const sessionId = sessionIdRef.current;
    const audienceType = user?.audienceType || 'unspecified';
    const isIdentified = !!(user && user.email && user.email.trim().length > 0);

    recordLocalPageView({
      sessionId,
      visitorId,
      page: activePage,
      audienceType,
      userId: isIdentified ? user?.studentId || user?.email : undefined,
      userEmail: isIdentified ? user?.email : undefined,
    });

    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        visitorId,
        page: activePage,
        audienceType,
        deviceType: deviceTypeRef.current,
        userId: isIdentified ? user?.studentId || user?.email : undefined,
        userEmail: isIdentified ? user?.email : undefined,
      }),
    }).catch(() => {
      // Non-blocking
    });
  }, [activePage, user?.email, user?.audienceType]);

  // 3. Heartbeat tracking every 35 seconds while user is active
  useEffect(() => {
    const interval = setInterval(() => {
      // Pause heartbeat if user has been inactive for more than 10 minutes
      const idleTime = Date.now() - lastActiveTimestampRef.current;
      if (idleTime > 10 * 60 * 1000) {
        return;
      }

      // Check document visibility
      if (document.visibilityState === 'hidden') {
        return;
      }

      const visitorId = visitorIdRef.current;
      const sessionId = sessionIdRef.current;
      const audienceType = user?.audienceType || 'unspecified';
      const isIdentified = !!(user && user.email && user.email.trim().length > 0);

      recordLocalHeartbeat({
        sessionId,
        visitorId,
        currentPage: activePage,
        audienceType,
        userId: isIdentified ? user?.studentId || user?.email : undefined,
        userEmail: isIdentified ? user?.email : undefined,
      });

      fetch('/api/analytics/session/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          visitorId,
          currentPage: activePage,
          audienceType,
          deviceType: deviceTypeRef.current,
          userId: isIdentified ? user?.studentId || user?.email : undefined,
          userEmail: isIdentified ? user?.email : undefined,
        }),
      }).catch(() => {
        // Non-blocking
      });
    }, 35000); // 35 seconds heartbeat

    return () => clearInterval(interval);
  }, [activePage, user?.email, user?.audienceType]);

  // 4. End session on window unload / beforeunload
  useEffect(() => {
    const handleUnload = () => {
      const sessionId = sessionIdRef.current;
      recordLocalSessionEnd(sessionId);
      const payload = JSON.stringify({ sessionId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/session/end', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/session/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return {
    visitorId: visitorIdRef.current,
    sessionId: sessionIdRef.current,
    deviceType: deviceTypeRef.current,
    hasDismissedPrivacyNotice,
    dismissPrivacyNotice,
  };
}
