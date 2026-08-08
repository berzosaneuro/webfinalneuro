'use client'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Instagram, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function SettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const igConnected = searchParams.get('ig_connected')
  const igError     = searchParams.get('ig_error')

  useEffect(() => {
    fetch('/api/instagram/accounts')
      .then((r) => r.json())
      .then(setAccounts)
      .finally(() => setLoading(false))
  }, [])

  function connectInstagram() {
    window.location.href = '/api/instagram/connect'
  }

  async function disconnectAccount(id: string) {
    if (!confirm('Disconnect this Instagram account? This will pause all related flows.')) return
    await fetch(`/api/instagram/accounts/${id}`, { method: 'DELETE' })
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="p-8 max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account and integrations</p>
      </div>

      {/* Alerts */}
      {igConnected && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 text-success rounded-2xl px-5 py-3 mb-6">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Instagram account connected successfully!
        </div>
      )}
      {igError && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 text-danger rounded-2xl px-5 py-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Failed to connect Instagram. Please try again.
        </div>
      )}

      {/* Profile */}
      <Card className="mb-5">
        <CardHeader>
          <h2 className="font-semibold">Profile</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center font-bold text-brand">
              {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-text-muted">{session?.user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instagram accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Instagram Accounts</h2>
            <Button variant="instagram" size="sm" onClick={connectInstagram}>
              <Instagram className="w-4 h-4" />
              Connect account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <Instagram className="w-8 h-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted text-sm">No Instagram accounts connected yet.</p>
              <p className="text-text-muted text-xs mt-1">
                You need an Instagram Business or Creator account.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc) => (
                <div key={acc.id} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl">
                  <div className="w-9 h-9 instagram-gradient rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {acc.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">@{acc.username}</p>
                    {acc.name && <p className="text-xs text-text-muted truncate">{acc.name}</p>}
                  </div>
                  <Badge variant={acc.isActive ? 'success' : 'warning'}>
                    {acc.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <button
                    onClick={() => disconnectAccount(acc.id)}
                    className="text-text-muted hover:text-danger transition-colors ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
