// Alert Priority Types
export type AlertPriority = 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';

// Alert Source Types
export type AlertSource = 'DTC' | 'ML_PREDICTION' | 'BEHAVIOR' | 'MANUAL' | 'OBD';

// Technical Data for alerts
export interface TechnicalData {
  dtcCode?: string;
  dtcDescription?: string;
  freezeFrame?: {
    rpm: number;
    speed: number;
    engineLoad: number;
    fuelTrim: number;
    throttlePosition: number;
  };
  sensorValues?: Record<string, number>;
  affectedSystems?: string[];
  severityScore?: number;
}

// ML Metrics for predictions
export interface MLMetrics {
  confidence: number;
  predictedFailureDate?: string;
  healthScore: number;
  degradationRate: number;
  historicalAccuracy?: number;
  modelVersion?: string;
}

// Behavior Data for driving events
export interface BehaviorData {
  eventType: 'HARD_BRAKE' | 'RAPID_ACCELERATION' | 'SHARP_TURN' | 'SPEEDING' | 'IDLE';
  intensity: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  duration?: number;
  videoClipUrl?: string;
}

// Tuning Context for ECU modifications
export interface TuningContext {
  parameter: string;
  oldValue: number;
  newValue: number;
  unit: string;
  category: 'ENGINE' | 'TRANSMISSION' | 'FUEL' | 'EMISSIONS' | 'PERFORMANCE';
  requiresConfirmation: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Main Alert Payload
export interface AlertPayload {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  source: AlertSource;
  timestamp: string;
  acknowledged: boolean;
  dismissed: boolean;
  technicalData?: TechnicalData;
  mlMetrics?: MLMetrics;
  behaviorData?: BehaviorData;
  tuningContext?: TuningContext;
  recommendedActions?: string[];
  relatedAlerts?: string[];
  vehicleId: string;
}

// Vehicle Profile
export interface VehicleProfile {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  mileage: number;
  engineType: string;
  transmissionType: 'AUTOMATIC' | 'MANUAL' | 'CVT' | 'DCT';
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  lastServiceDate: string;
  nextServiceDue: string;
  image?: string;
}

// User Persona Types
export type UserPersonaType = 'DRIVER' | 'MECHANIC' | 'TUNER';

// User Persona
export interface UserPersona {
  id: string;
  type: UserPersonaType;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    alertNotifications: boolean;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    autoAcknowledge: boolean;
    darkMode: boolean;
    language: string;
  };
  vehicles: string[];
}

// OBD Sensor Data
export interface OBDSensorData {
  timestamp: string;
  rpm: number;
  speed: number;
  engineTemp: number;
  fuelLevel: number;
  oilPressure: number;
  batteryVoltage: number;
  mafSensor: number;
  o2Sensor1: number;
  o2Sensor2: number;
  throttlePosition: number;
  engineLoad: number;
  fuelTrim: number;
  intakeTemp: number;
  coolantTemp: number;
}

// Degradation Trend Data Point
export interface DegradationPoint {
  date: string;
  healthScore: number;
  component: string;
}

// Driving Score Components
export interface DrivingScoreComponents {
  braking: number;
  acceleration: number;
  cornering: number;
  speeding: number;
  idling: number;
  overall: number;
}

// DTC Code with details
export interface DTCCode {
  code: string;
  description: string;
  severity: AlertPriority;
  system: string;
  possibleCauses: string[];
  isPending: boolean;
  occurrenceCount: number;
  firstSeen: string;
  lastSeen: string;
}

// Sensor Thresholds
export interface SensorThreshold {
  sensor: string;
  minValue: number;
  maxValue: number;
  unit: string;
  warningThreshold?: number;
  criticalThreshold?: number;
}

// Vehicle Health Summary
export interface VehicleHealthSummary {
  overallScore: number;
  engineHealth: number;
  transmissionHealth: number;
  brakeHealth: number;
  tireHealth: number;
  batteryHealth: number;
  lastUpdated: string;
}

// Alert Statistics
export interface AlertStatistics {
  total: number;
  critical: number;
  warning: number;
  advisory: number;
  info: number;
  acknowledged: number;
  pending: number;
}

// Tuning Parameter
export interface TuningParameter {
  id: string;
  name: string;
  category: 'ENGINE' | 'TRANSMISSION' | 'FUEL' | 'EMISSIONS' | 'PERFORMANCE';
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresEngineOff: boolean;
  requiresConfirmation: boolean;
}

// Tuning Change Log
export interface TuningChangeLog {
  id: string;
  parameterId: string;
  parameterName: string;
  oldValue: number;
  newValue: number;
  timestamp: string;
  userId: string;
  vehicleId: string;
  rolledBack: boolean;
  rollbackTimestamp?: string;
}
