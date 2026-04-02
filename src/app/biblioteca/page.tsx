'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'
import Card from '@/components/Card'
import FadeInSection from '@/components/FadeInSection'
import PremiumLock from '@/components/PremiumLock'
import PremiumBadge from '@/components/PremiumBadge'
import { posts as fallbackPosts } from '@/data/posts'
import { BookOpen, Loader2 } from 'lucide-react'

type PostItem = { slug: string; title: string; date: string; summary: string; free?: boolean }

export default function BibliotecaPage() {
  const [posts, setPosts] = useState<PostItem[]>(fallbackPosts)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/biblioteca')
      .then(r => r.ok ? r.json() : fallbackPosts)
      .then(data => setPosts(Array.isArray(data) ? data : fallbackPosts))
      .catch(() => setPosts(fallbackPosts))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    )
  }

  return (
    <>
      <section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in">
              BIBLIOTECA
            </h1>
            <p className="text-text-secondary text-lg md:text-xl animate-fade-in-up">
              Textos cortos para ordenar la cabeza. Sin relleno.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            {posts.map((post) => {
              const isFree = !!post.free || ['por-que-tu-mente-no-se-calla', 'ego-mecanismo-defensivo'].includes(post.slug)
              const cardContent = (
                <Link href={`/biblioteca/${post.slug}`}>
                  <Card className="group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <BookOpen className="w-5 h-5 text-accent-blue mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-text-secondary text-xs font-mono">{post.date}</p>
                          {!isFree && <PremiumBadge />}
                        </div>
                        <h2 className="font-heading text-lg font-semibold text-white group-hover:text-accent-blue transition-colors mb-2">
                          {post.title}
                        </h2>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )

              return (
                <FadeInSection key={post.slug}>
                  {isFree ? cardContent : (
                    <PremiumLock label={post.title}>
                      {cardContent}
                    </PremiumLock>
                  )}
                </FadeInSection>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
