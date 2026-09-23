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
                  combinatorial optimization. My research lies at the 
                  intersection of discrete mathematics and optimization, with a particular focus on 
                  the geometry of polytopes arising from combinatorial problems and what this 
                  geometry reveals about their underlying structure.
                </p>

                <h2>Education</h2>
                <ul>
                  <li>
                    <span className="font-medium text-ink-900">Ph.D. in Mathematics</span>, Otto-von-Guericke University Magdeburg — since Oct 2024
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">Institute for Mathematical Optimization, advised by Prof. Volker Kaibel</span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">M.Sc. Mathematics</span>, Otto-von-Guericke University Magdeburg — Oct 2021 – Sep 2024
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">GPA 1.1 (German scale, 1.0 = highest), awarded &ldquo;with distinction&rdquo; — Optimization, Artificial Intelligence</span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">B.Sc. Mathematics</span>, Otto-von-Guericke University Magdeburg — Oct 2018 – Sep 2021
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">GPA 1.1, awarded &ldquo;with distinction&rdquo; — Combinatorial Optimization, Computer Science</span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">Abitur</span>, Paul-Gerhardt-Gymnasium Gräfenhainichen — 2018
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      GPA 1.0 — national finalist in Bundeswettbewerb Mathematik and Jugend Debattiert
                    </span>
                  </li>
                </ul>

                <h2>Work Experience</h2>
                <ul>
                  <li>
                    <span className="font-medium text-ink-900">Consulting Intern</span>, d-fine GmbH — Apr – Jun 2023
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      Developed a web application for a pharmaceutical wholesale client (TypeScript, PostgreSQL, Java),
                      building core MVP modules for real-time truck tracking, inventory analysis, and dashboarding.
                    </span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">Research &amp; Teaching Assistant</span>, OVGU Magdeburg — 2021 – 2024
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      Digitized the faculty&rsquo;s module-handbook process and built a database-backed website,
                      reducing manual workflow and communication overhead by over 65%.
                    </span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">Parliamentary Aide</span>, Office of Bundestag Member Sepp Müller — Nov 2018 – Mar 2020
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      Provided policy research and election analysis, and managed the office&rsquo;s online presence.
                    </span>
                  </li>
                </ul>

                <h2>Teaching &amp; Leadership</h2>
                <ul>
                  <li>
                    <span className="font-medium text-ink-900">Instructor</span>, Math Olympiad Masterclass
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      Designed curriculum and problem sets for top 10th-grade students of the state.
                    </span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">Board Member</span>, eLeMeNTe e.V. — since Feb 2026
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      Math talent-development nonprofit; involved in organizing events since 2019.
                    </span>
                  </li>
                  <li>
                    <span className="font-medium text-ink-900">Chair, Faculty &amp; Department Student Council</span>, Mathematics, OVGU — 2019 – 2024
                    <span className="block mt-0.5 text-ink-500 text-sm leading-snug">
                      PhD student representative on the Faculty Council since Sep 2026.
                    </span>
                  </li>
                </ul>
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
