import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { getPostBySlug } from '@/data/posts'
import { ArrowLeft, Lightbulb } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

async function fetchPost(slug: string) {
  try {
    const { getSupabase } = await import('@/lib/supabase')
    const sb = getSupabase()
    if (sb) {
      const { data } = await sb.from('biblioteca_posts').select('*').eq('slug', slug).single()
      if (data) return { slug: data.slug, title: data.title, date: data.date || '', summary: data.summary || '', content: data.content || '', exercise: data.exercise || '' }
    }
  } catch {}
  return getPostBySlug(slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) return { title: 'No encontrado — Berzosa Neuro' }
  return { title: `${post.title} — Berzosa Neuro`, description: post.summary }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchPost(slug)
  if (!post) notFound()

  return (
    <>
      <section className="pt-24 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Button href="/biblioteca" variant="outline" className="mb-10 text-xs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la biblioteca
            </Button>

            <p className="text-text-secondary text-xs font-mono mb-4">{post.date}</p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-8 animate-fade-in">
              {post.title}
            </h1>
            <p className="text-accent-blue text-lg mb-10 animate-fade-in-up">
              {post.summary}
            </p>

            <div className="prose-custom space-y-4">
              {post.content.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className="text-text-secondary leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <Card className="mt-16">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-6 h-6 text-accent-blue shrink-0 mt-1" />
                <div>
                  <h3 className="text-accent-blue font-semibold text-sm uppercase tracking-wider mb-3">
                    Ejercicio práctico
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{post.exercise}</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
