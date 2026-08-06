import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'About',
  description: 'Mathematician working in combinatorial optimization and discrete mathematics.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        ornament="∗"
      />

      <div className="section-container pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main text */}
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="prose prose-lg max-w-reading">
                <p className="text-xl text-ink-700 leading-relaxed font-light">
                  I am a PhD student at the Otto-von-Guericke University Magdeburg, working in 
                  combinatorial optimization and integer programming. My research lies at the 
                  intersection of discrete mathematics and optimization, with a particular focus on 
                  the geometry of polytopes arising from combinatorial problems — and what this 
                  geometry reveals about their underlying structure.
                </p>

                <h2>How I think about mathematics</h2>
                <p>
                  What draws me to mathematics is the process of uncovering structure: starting from 
                  a seemingly opaque problem and gradually revealing the ideas that make it work. 
                  Early on, I was particularly fascinated by the puzzle-like nature of combinatorial 
                  optimization, which ultimately led me to specialize in this area.
                </p>
                <p>
                  I completed both my Bachelor's and Master's degrees with distinction at the 
                  Otto-von-Guericke University Magdeburg, focusing on mathematical optimization 
                  while maintaining a broad interest across mathematics. During my Master's studies, 
                  I worked as an intern at d-fine GmbH, where I applied mathematical and computational 
                  methods to problems in the healthcare sector.
                </p>

                <h2>Beyond the office</h2>
                <p>
                  I am actively involved in mathematical outreach and talent development, including 
                  coaching for the Mathematical Olympiad and organizing seminars for gifted students 
                  at the state level. I am particularly interested in making abstract mathematical 
                  ideas tangible through visualization, interactive formats, and public talks.
                </p>
                <p>
                  More recently, I have developed an interest in the role of artificial intelligence 
                  in academic work. I build tools to integrate AI into my research workflow and enjoy 
                  exploring how these technologies may shape the future of mathematical practice.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AnimatedSection delay={0.15}>
              <div className="space-y-8">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src="/about-photo.png"
                    alt="Photo"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Quick facts */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono text-ink-400 uppercase tracking-wider mb-1">
                      Areas
                    </h3>
                    <p className="text-sm text-ink-700">
                      Combinatorial Optimization, Polyhedral Combinatorics, Discrete Mathematics 
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-ink-400 uppercase tracking-wider mb-1">
                      Interests
                    </h3>
                    <p className="text-sm text-ink-700">
                      Mathematical Outreach, Education, AI in Research
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-ink-400 uppercase tracking-wider mb-1">
                      Contact
                    </h3>
                    <p className="text-sm text-ink-500 italic">
                      frederic.horn@ovgu.de
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}
