import { NextResponse } from 'next/server';
import { mockAlerts } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({ alerts: mockAlerts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newAlert = {
    ...body,
    id: `alert-${Date.now()}`,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    resolved: false,
  };
  return NextResponse.json(newAlert);
}