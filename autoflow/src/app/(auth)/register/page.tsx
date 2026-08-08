'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 instagram-gradient rounded-xl flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">AutoFlow</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-text-secondary mt-1">Start automating Instagram for free</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              minLength={8}
              required
            />

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>

            <p className="text-xs text-text-muted text-center">
              By signing up you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand hover:text-brand-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
