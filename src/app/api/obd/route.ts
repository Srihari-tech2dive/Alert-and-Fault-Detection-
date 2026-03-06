import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    connected: true,
    sensorData: {
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
    },
    lastUpdate: new Date().toISOString(),
  });
}