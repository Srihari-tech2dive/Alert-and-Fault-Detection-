'use client';

import { useCallback, useMemo } from 'react';
import { useAppStore, useAlerts as useAlertsSelector } from '@/store/useAppStore';
import type { AlertPayload, AlertPriority } from '@/types/alert';

export function useAlerts() {
  const alerts = useAlertsSelector();
  const addAlert = useAppStore((state) => state.addAlert);
  const acknowledgeAlert = useAppStore((state) => state.acknowledgeAlert);
  const resolveAlert = useAppStore((state) => state.resolveAlert);
  const clearAlerts = useAppStore((state) => state.clearAlerts);
  const setCriticalAlert = useAppStore((state) => state.setCriticalAlert);

  // Get alerts filtered by priority
  const getAlertsByPriority = useCallback(
    (priority: AlertPriority) => alerts.filter((alert) => alert.priority === priority),
    [alerts]
  );

  // Get unacknowledged alerts
  const unacknowledgedAlerts = useMemo(
    () => alerts.filter((alert) => !alert.acknowledged && !alert.resolved),
    [alerts]
  );

  // Get active (non-resolved) alerts
  const activeAlerts = useMemo(
    () => alerts.filter((alert) => !alert.resolved),
    [alerts]
  );

  // Get resolved alerts
  const resolvedAlerts = useMemo(
    () => alerts.filter((alert) => alert.resolved),
    [alerts]
  );

  // Count by priority
  const counts = useMemo(
    () => ({
      critical: alerts.filter((a) => a.priority === 'CRITICAL' && !a.resolved).length,
      warning: alerts.filter((a) => a.priority === 'WARNING' && !a.resolved).length,
      advisory: alerts.filter((a) => a.priority === 'ADVISORY' && !a.resolved).length,
      info: alerts.filter((a) => a.priority === 'INFO' && !a.resolved).length,
      total: alerts.filter((a) => !a.resolved).length,
      unacknowledged: unacknowledgedAlerts.length,
    }),
    [alerts, unacknowledgedAlerts]
  );

  // Handle acknowledge with critical alert dismissal
  const handleAcknowledge = useCallback(
    (id: string) => {
      const alert = alerts.find((a) => a.id === id);
      if (alert?.priority === 'CRITICAL') {
        setCriticalAlert(null);
      }
      acknowledgeAlert(id);
    },
    [alerts, acknowledgeAlert, setCriticalAlert]
  );

  // Create a new alert
  const createAlert = useCallback(
    (alert: Omit<AlertPayload, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>) => {
      const newAlert: AlertPayload = {
        ...alert,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        resolved: false,
      };
      addAlert(newAlert);

      // If critical, show fullscreen
      if (alert.priority === 'CRITICAL') {
        setCriticalAlert(newAlert);
      }

      return newAlert;
    },
    [addAlert, setCriticalAlert]
  );

  return {
    alerts,
    unacknowledgedAlerts,
    activeAlerts,
    resolvedAlerts,
    counts,
    getAlertsByPriority,
    acknowledgeAlert: handleAcknowledge,
    resolveAlert,
    clearAlerts,
    createAlert,
  };
}
