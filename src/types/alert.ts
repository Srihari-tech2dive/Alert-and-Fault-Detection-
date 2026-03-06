// Alert Priority Types
export type AlertPriority = 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
export type AlertSource = 'DTC' | 'ML_PREDICTION' | 'BEHAVIOR' | 'MANUAL' | 'OBD';
export type DTCStatus = 'PENDING' | 'STORED' | 'PERMANENT' | 'CLEARED';
export type DegradationTrend = 'STABLE' | 'DECLINING' | 'CRITICAL';
export type BehaviorEventType = 'HARD_BRAKE' | 'RAPID_ACCEL' | 'CORNERING';

// Technical Data Interface
export interface TechnicalData {
  dtcCode?: string;
  dtcStatus?: DTCStatus;
  system?: string;
  pidData?: Record<string, number>;
  freezeFrame?: Record<string, unknown>;
}

// ML Metrics Interface
export interface MLMetrics {
  modelVersion: string;
  confidenceScore: number;
  predictedFailureDate?: string;
  degradationTrend: DegradationTrend;
}

// Behavior Data Interface
export interface BehaviorData {
  eventType: BehaviorEventType;
  severityScore: number;
  location?: { lat: number; lng: number };
  gForce?: number;
}

// Tuning Context Interface
export interface TuningContext {
  parameterId: string;
  oldValue: number;
  newValue?: number;
  isReversible: boolean;
}

// Main Alert Payload Interface
export interface AlertPayload {
  id: string;
  timestamp: string;
  priority: AlertPriority;
  source: AlertSource;
  title: string;
  message: string;
  actionRequired: string;
  technicalData?: TechnicalData;
  mlMetrics?: MLMetrics;
  behaviorData?: BehaviorData;
  tuningContext?: TuningContext;
  acknowledged: boolean;
  resolved: boolean;
  reportUrl?: string;
}

// Vehicle Profile Interface
export interface VehicleProfile {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  engineType: string;
  mileage: number;
  lastServiceDate: string;
  nextServiceDue?: string;
}

// Sensor Data Interface
export interface SensorData {
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
  intakeTemp: number;
  coolantTemp: number;
}

// Health Score Interface
export interface HealthScore {
  overall: number;
  engine: number;
  transmission: number;
  brakes: number;
  tires: number;
  battery: number;
  emissions: number;
}

// Driving Score Interface
export interface DrivingScore {
  score: number;
  hardBrakeCount: number;
  rapidAccelCount: number;
  corneringEvents: number;
  averageSpeed: number;
  fuelEfficiency: number;
}

// DTC Code Definition
export interface DTCCode {
  code: string;
  description: string;
  system: string;
  severity: AlertPriority;
  possibleCauses: string[];
}

// Tuning Parameter
export interface TuningParameter {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  description: string;
  isReversible: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

// User Persona Type
export type UserPersona = 'DRIVER' | 'MECHANIC';

// View Mode Type
export type ViewMode = 'DRIVER' | 'MECHANIC' | 'TUNING';

// Chart Data Point
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// Degradation History
export interface DegradationHistory {
  component: string;
  data: ChartDataPoint[];
  trend: DegradationTrend;
  predictedFailure?: string;
}
