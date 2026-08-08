'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SessionProvider } from 'next-auth/react'

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', { email, password, redirect: false })

    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-text-secondary mt-1">Sign in to your account</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
          </form>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand hover:text-brand-hover">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <SessionProvider><LoginForm /></SessionProvider>
}
