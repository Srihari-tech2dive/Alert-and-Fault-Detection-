import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    predictions: [
      {
        component: 'Battery',
        healthScore: 68,
        predictedFailure: '2025-03-15',
        confidence: 0.87,
        trend: 'DECLINING',
      },
      {
        component: 'Brakes',
        healthScore: 72,
        predictedFailure: '2025-06-20',
        confidence: 0.75,
        trend: 'DECLINING',
      },
      {
        component: 'Tires',
        healthScore: 88,
        predictedFailure: null,
        confidence: 0.92,
        trend: 'STABLE',
      },
    ],
    modelVersion: 'v2.3.1',
    lastTraining: '2025-01-01',
  });
}