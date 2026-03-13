import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import Card from '@/components/Card'
import Button from '@/components/Button'
import { posts, getPostBySlug } from '@/data/posts'
import { ArrowLeft, Lightbulb } from 'lucide-react'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'No encontrado — Berzosa Neuro' }
  return {
    title: `${post.title} — Berzosa Neuro`,
    description: post.summary,
  }
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

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
              {post.content.split('\n\n').map((paragraph, i) => (
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
