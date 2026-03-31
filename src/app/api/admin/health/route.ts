import { NextResponse } from 'next/server'
import { requireAdminOr401 } from '@/lib/api-auth'
import { runHealthCheck } from '@/lib/health-check'

export async function GET(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError

  const report = await runHealthCheck()
  return NextResponse.json(report, { status: report.ok ? 200 : 503 })
}
