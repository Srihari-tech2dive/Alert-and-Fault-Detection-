'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { SensorData } from '@/types/alert';

interface OBDStatus {
  connected: boolean;
  port: string | null;
  protocol: string | null;
  lastUpdate: string | null;
  error: string | null;
}

export function useOBD() {
  const [status, setStatus] = useState<OBDStatus>({
    connected: false,
    port: null,
    protocol: null,
    lastUpdate: null,
    error: null,
  });

  const updateSensorData = useAppStore((state) => state.updateSensorData);

  // Simulate OBD connection
  const connect = useCallback(async () => {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus({
      connected: true,
      port: '/dev/ttyUSB0',
      protocol: 'ISO 15765-4 CAN (11 bit ID, 500 kbaud)',
      lastUpdate: new Date().toISOString(),
      error: null,
    });
  }, []);

  // Simulate OBD disconnection
  const disconnect = useCallback(async () => {
    setStatus({
      connected: false,
      port: null,
      protocol: null,
      lastUpdate: null,
      error: null,
    });
  }, []);

  // Simulate live data polling
  useEffect(() => {
    if (!status.connected) return;

    const pollInterval = setInterval(() => {
      // Generate simulated sensor data with realistic variations
      const newSensorData: Partial<SensorData> = {
        rpm: Math.floor(2000 + Math.random() * 3000),
        speed: Math.floor(30 + Math.random() * 60),
        engineTemp: Math.floor(190 + Math.random() * 15),
        fuelLevel: Math.max(0, Math.floor(70 - Math.random() * 0.1)),
        oilPressure: Math.floor(40 + Math.random() * 15),
        batteryVoltage: 13.8 + Math.random() * 0.8,
        mafSensor: 25 + Math.random() * 10,
        o2Sensor1: 0.8 + Math.random() * 0.1,
        o2Sensor2: 0.78 + Math.random() * 0.1,
        throttlePosition: 15 + Math.random() * 30,
        intakeTemp: 90 + Math.random() * 15,
        coolantTemp: 188 + Math.random() * 10,
      };

      updateSensorData(newSensorData);
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [status.connected, updateSensorData]);

  // Clear DTCs (simulated)
  const clearDTCs = useCallback(async () => {
    if (!status.connected) {
      throw new Error('OBD not connected');
    }

    // Simulate command execution
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: 'DTCs cleared successfully' };
  }, [status.connected]);

  // Read DTCs (simulated)
  const readDTCs = useCallback(async () => {
    if (!status.connected) {
      throw new Error('OBD not connected');
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      codes: ['P0300', 'P0171'],
      count: 2,
    };
  }, [status.connected]);

  return {
    status,
    connect,
    disconnect,
    clearDTCs,
    readDTCs,
    isConnected: status.connected,
  };
}
