import type { AlertPayload, VehicleProfile, DTCCode, ChartDataPoint, AlertPriority } from '@/types/alert';

// Mock Vehicle Profile
export const mockVehicle: VehicleProfile = {
  id: 'vehicle-001',
  vin: '1HGBH41JXMN109186',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  engineType: '2.5L 4-Cylinder',
  mileage: 45280,
  lastServiceDate: '2024-11-15',
  nextServiceDue: '2025-02-15',
};

// DTC Code Database
export const dtcDatabase: Record<string, DTCCode> = {
  P0300: {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    system: 'Powertrain',
    severity: 'CRITICAL',
    possibleCauses: ['Faulty spark plugs', 'Ignition coil failure', 'Fuel injector issues', 'Low fuel pressure', 'Vacuum leak'],
  },
  P0171: {
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    system: 'Powertrain',
    severity: 'WARNING',
    possibleCauses: ['Vacuum leak', 'Mass Air Flow sensor faulty', 'Oxygen sensor failure', 'Fuel pump weak'],
  },
  P0420: {
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold',
    system: 'Emissions',
    severity: 'WARNING',
    possibleCauses: ['Catalytic converter failure', 'Oxygen sensor malfunction', 'Exhaust leak'],
  },
  P0128: {
    code: 'P0128',
    description: 'Coolant Thermostat Below Regulating Temperature',
    system: 'Powertrain',
    severity: 'ADVISORY',
    possibleCauses: ['Thermostat stuck open', 'Coolant temperature sensor faulty', 'Low coolant level'],
  },
  C0035: {
    code: 'C0035',
    description: 'Left Front Wheel Speed Circuit Malfunction',
    system: 'Chassis',
    severity: 'WARNING',
    possibleCauses: ['Wheel speed sensor failure', 'Wiring issue', 'ABS module fault'],
  },
};

// Helper to create properly typed alerts
const createAlert = (
  id: string,
  timestamp: string,
  priority: AlertPriority,
  source: AlertPayload['source'],
  title: string,
  message: string,
  actionRequired: string,
  options: Partial<AlertPayload> = {}
): AlertPayload => ({
  id,
  timestamp,
  priority,
  source,
  title,
  message,
  actionRequired,
  acknowledged: false,
  resolved: false,
  ...options,
});

// Mock Alerts
export const mockAlerts: AlertPayload[] = [
  createAlert(
    'alert-001',
    new Date().toISOString(),
    'CRITICAL',
    'DTC',
    'Engine Overheating',
    'Engine coolant temperature has exceeded safe operating limits. Immediate action required to prevent engine damage.',
    'Stop vehicle immediately and allow engine to cool. Check coolant levels.',
    {
      technicalData: {
        dtcCode: 'P0217',
        dtcStatus: 'STORED',
        system: 'Powertrain',
        pidData: { coolantTemp: 245, radiatorFanSpeed: 100 },
        freezeFrame: { rpm: 3500, load: 85, fuelTrim: -12 },
      },
    }
  ),
  createAlert(
    'alert-002',
    new Date(Date.now() - 300000).toISOString(),
    'WARNING',
    'DTC',
    'Catalyst Efficiency Low',
    'Catalytic converter efficiency has dropped below acceptable thresholds. Emissions may exceed legal limits.',
    'Schedule service appointment within 1-2 weeks.',
    {
      technicalData: {
        dtcCode: 'P0420',
        dtcStatus: 'PENDING',
        system: 'Emissions',
        pidData: { o2Sensor1: 0.85, o2Sensor2: 0.78, catalystTemp: 1450 },
      },
    }
  ),
  createAlert(
    'alert-003',
    new Date(Date.now() - 600000).toISOString(),
    'WARNING',
    'OBD',
    'Low Tire Pressure - Front Left',
    'Front left tire pressure is 28 PSI, below recommended 35 PSI.',
    'Inflate tire to recommended pressure at earliest convenience.',
    {
      acknowledged: true,
      technicalData: {
        system: 'Chassis',
        pidData: { tirePressureFL: 28, tirePressureFR: 34, tirePressureRL: 35, tirePressureRR: 35 },
      },
    }
  ),
  createAlert(
    'alert-004',
    new Date(Date.now() - 900000).toISOString(),
    'WARNING',
    'ML_PREDICTION',
    'Battery Health Declining',
    'ML model predicts battery failure within 3 months with 87% confidence. Current state of health: 68%.',
    'Schedule battery replacement before predicted failure date.',
    {
      mlMetrics: {
        modelVersion: 'v2.3.1',
        confidenceScore: 0.87,
        predictedFailureDate: '2025-03-15',
        degradationTrend: 'DECLINING',
      },
    }
  ),
  createAlert(
    'alert-005',
    new Date(Date.now() - 1200000).toISOString(),
    'ADVISORY',
    'MANUAL',
    'Oil Change Due',
    'Vehicle has traveled 5,000 miles since last oil change. Manufacturer recommends service.',
    'Schedule oil change within 500 miles.'
  ),
  createAlert(
    'alert-006',
    new Date(Date.now() - 1500000).toISOString(),
    'WARNING',
    'BEHAVIOR',
    'Hard Braking Detected',
    'Hard braking event detected with 0.8g deceleration force. This driving pattern can accelerate brake wear.',
    'Consider smoother braking for improved fuel economy and brake life.',
    {
      acknowledged: true,
      behaviorData: {
        eventType: 'HARD_BRAKE',
        severityScore: 75,
        location: { lat: 37.7749, lng: -122.4194 },
        gForce: 0.8,
      },
    }
  ),
  createAlert(
    'alert-007',
    new Date(Date.now() - 1800000).toISOString(),
    'WARNING',
    'DTC',
    'Multiple Cylinder Misfire',
    'Random cylinder misfires detected across multiple cylinders. Engine performance may be affected.',
    'Schedule diagnostic service. Avoid high-load driving.',
    {
      technicalData: {
        dtcCode: 'P0300',
        dtcStatus: 'STORED',
        system: 'Powertrain',
        pidData: { misfireCount: 127, misfireCylinder1: 1, misfireCylinder3: 1, misfireCylinder4: 1 },
        freezeFrame: { rpm: 2200, load: 45, fuelTrim: 8 },
      },
    }
  ),
  createAlert(
    'alert-008',
    new Date(Date.now() - 2100000).toISOString(),
    'ADVISORY',
    'OBD',
    'Air Filter Service Recommended',
    'Mass Air Flow sensor readings indicate possible air filter restriction.',
    'Inspect and replace air filter if necessary.',
    {
      technicalData: {
        system: 'Powertrain',
        pidData: { mafReading: 18.5, expectedMaf: 24.0 },
      },
    }
  ),
  createAlert(
    'alert-009',
    new Date(Date.now() - 2400000).toISOString(),
    'ADVISORY',
    'BEHAVIOR',
    'Rapid Acceleration Event',
    'Rapid acceleration detected with 0.6g force. This affects fuel efficiency and engine wear.',
    'Gradual acceleration improves fuel economy by up to 30%.',
    {
      acknowledged: true,
      behaviorData: {
        eventType: 'RAPID_ACCEL',
        severityScore: 60,
        location: { lat: 37.7849, lng: -122.4094 },
        gForce: 0.6,
      },
    }
  ),
  createAlert(
    'alert-010',
    new Date(Date.now() - 2700000).toISOString(),
    'INFO',
    'MANUAL',
    'Maintenance Reminder',
    'Scheduled maintenance check completed 30 days ago. Next service due in 60 days.',
    'No action required at this time.',
    {
      acknowledged: true,
      resolved: true,
    }
  ),
];

// Health score history for charts
export const healthScoreHistory: ChartDataPoint[] = [
  { timestamp: '2024-07-01', value: 95 },
  { timestamp: '2024-08-01', value: 93 },
  { timestamp: '2024-09-01', value: 91 },
  { timestamp: '2024-10-01', value: 89 },
  { timestamp: '2024-11-01', value: 88 },
  { timestamp: '2024-12-01', value: 87 },
  { timestamp: '2025-01-01', value: 85 },
];

// Battery degradation history
export const batteryDegradationHistory: ChartDataPoint[] = [
  { timestamp: '2024-01', value: 98 },
  { timestamp: '2024-03', value: 95 },
  { timestamp: '2024-05', value: 91 },
  { timestamp: '2024-07', value: 86 },
  { timestamp: '2024-09', value: 78 },
  { timestamp: '2024-11', value: 72 },
  { timestamp: '2025-01', value: 68 },
];

// Brake wear history
export const brakeWearHistory: ChartDataPoint[] = [
  { timestamp: '2024-01', value: 92 },
  { timestamp: '2024-04', value: 88 },
  { timestamp: '2024-07', value: 83 },
  { timestamp: '2024-10', value: 78 },
  { timestamp: '2025-01', value: 72 },
];

// Driving events by day
export const drivingEventsByDay: ChartDataPoint[] = [
  { timestamp: 'Mon', value: 3 },
  { timestamp: 'Tue', value: 5 },
  { timestamp: 'Wed', value: 2 },
  { timestamp: 'Thu', value: 7 },
  { timestamp: 'Fri', value: 4 },
  { timestamp: 'Sat', value: 8 },
  { timestamp: 'Sun', value: 2 },
];

// Sensor readings over time
export const sensorReadingsHistory = {
  rpm: [
    { timestamp: '00:00', value: 2500 },
    { timestamp: '00:30', value: 2800 },
    { timestamp: '01:00', value: 3200 },
    { timestamp: '01:30', value: 2900 },
    { timestamp: '02:00', value: 2600 },
    { timestamp: '02:30', value: 3100 },
  ],
  temp: [
    { timestamp: '00:00', value: 190 },
    { timestamp: '00:30', value: 195 },
    { timestamp: '01:00', value: 198 },
    { timestamp: '01:30', value: 203 },
    { timestamp: '02:00', value: 200 },
    { timestamp: '02:30', value: 197 },
  ],
  speed: [
    { timestamp: '00:00', value: 45 },
    { timestamp: '00:30', value: 62 },
    { timestamp: '01:00', value: 55 },
    { timestamp: '01:30', value: 70 },
    { timestamp: '02:00', value: 48 },
    { timestamp: '02:30', value: 58 },
  ],
};

// Fuel economy over time
export const fuelEconomyHistory: ChartDataPoint[] = [
  { timestamp: 'Week 1', value: 28.5 },
  { timestamp: 'Week 2', value: 27.8 },
  { timestamp: 'Week 3', value: 29.2 },
  { timestamp: 'Week 4', value: 26.5 },
  { timestamp: 'Week 5', value: 28.0 },
  { timestamp: 'Week 6', value: 27.2 },
];