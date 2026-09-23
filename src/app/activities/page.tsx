import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { ExpandableCard } from '@/components/ui/ExpandableCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'Activities',
  description: 'Mathematical outreach, education, and exploration projects.',
};

interface Project {
  title: string;
  description: string;
  href?: string;
  tag?: string;
  details?: string[];
}

interface ProjectGroup {
  id: string;
  symbol: string;
  title: string;
  description: string;
  projects: Project[];
}

const groups: ProjectGroup[] = [
  {
    id: 'university',
    symbol: 'A',
    title: 'University Activities',
    description: 'Teaching and other academic contributions.',
    projects: [
      {
        title: 'Teaching',
        description: 'Exercise sessions in introduction to optimization, mathematical methods, and linear algebra.',
        tag: 'Teaching',
        details: [
          'SS 2026: Einführung in die Optimierung',
          'WS 2025 / 2026: Mathematical Methods I',
          'SS 2025: Mathematical Methods II',
          'WS 2024 / 2025: Lineare Algebra',
        ],
      },
      {
        title: 'Academic Service',
        description: 'Contributions to departmental activities, committee work, and academic organization.',
        tag: 'Service',
        details: [
          'Research Communication: Regular presentations at the Institute’s Advanced Research Seminar.',
          'University Governance: Served on the Faculty Council, Search Committees, and other university-level boards.',
        ],
      },
      {
        title: 'Outreach Acitivities',
        description: 'Organized student recruitment events and university outreach programs.',
        tag: 'Outreach',
        details: [
          'University Open Days: Lead the planning and execution of the annual Student Information Day.',
          'Intensive Courses: Co-organize biannual intensive science courses for high school students.',
          'Internship Programs: Design and supervise various internship projects for visiting students.',
          'Recruitment Fairs: Coordinate event logistics and represent the university at various educational fairs.',
        ],
      },
    ],
  },
  {
    id: 'outreach',
    symbol: 'B',
    title: 'Mathematical Outreach',
    description: 'Communicating mathematical ideas to broader audiences through talks, festivals, and public events.',
    projects: [
      {
        title: 'PCA of the Wahl-O-Mat',
        description: 'An interactive talk exploring how singular value decomposition reveals hidden structure in political opinion data.',
        tag: 'Talk · SVD/PCA',
      },
      {
        title: 'History of Mathematics',
        description: 'A series of talks for school students about interesting mathematical discoveries. The focus of these talks is explaining how and why the ideas emerged.',
        tag: 'Series of Talks',
      },
      {
        title: 'Visual Mathematics',
        description: 'A composition exploring mathematical counterintuition through the Collatz conjecture, circle division, square packing, and the aperiodic Einstein tile.',
        tag: 'Art',
      },
    ],
  },
  {
    id: 'education',
    symbol: 'C',
    title: 'Education & Talent Development',
    description: 'Nurturing mathematical talent through competition preparation, seminars, and structured problem-solving.',
    projects: [
      {
        title: 'State Math Olympiad',
        description: 'Preparing and organizing the yearly mathematical olympiad of Saxony-Anhalt with about 250 participants and 200 helper.',
        tag: 'Competition · Organization',
      },
      {
        title: 'Landesseminar Mathematics',
        description: 'Organizing a state-level seminar on competition mathematics and giving lectures on combinatorics.',
        tag: 'Seminar · Organization',
      },
      {
        title: 'Math Olympiad Coaching',
        description: 'Training and mentoring students for mathematical competitions at regional and national levels.',
        tag: 'Competition',
      },
    ],
  },
  {
    id: 'ai',
    symbol: 'D',
    title: 'AI in Academia',
    description: 'Exploring the role of AI tools in mathematical research and academic workflows.',
    projects: [
      {
        title: 'arXiv Monitoring Tool',
        description: 'An automated Python pipeline that monitors daily arXiv submissions, scores abstracts for research relevance using AI, and delivers curated results via Telegram and email.',
        tag: 'Tool · Python',
      },
      {
        title: 'AI-Assisted Research Workflows',
        description: 'Exploring how large language models can augment mathematical research — from literature review to LaTeX drafting to computational verification.',
        tag: 'Exploration',
      },
    ],
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Mathematics lives in many places — in research, in classrooms, in conversations, and at the boundary of disciplines. These are some of the projects I'm involved in."
        ornament="⊞"
      />

      <div className="section-container pb-24">
        {groups.map((group, gi) => (
          <AnimatedSection key={group.id} delay={gi * 0.05}>
            <div className="mb-20" id={group.id}>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-sm text-accent/60">{group.symbol}.</span>
                <h2 className="font-display text-display-sm text-ink-950">{group.title}</h2>
              </div>
              <p className="text-ink-500 mb-8 max-w-wide">{group.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.projects.map((project) =>
                  project.details ? (
                    <ExpandableCard
                      key={project.title}
                      title={project.title}
                      description={project.description}
                      tag={project.tag}
                      details={project.details}
                    />
                  ) : (
                    <Card
                      key={project.title}
                      title={project.title}
                      description={project.description}
                      tag={project.tag}
                      href={project.href}
                    />
                  )
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </>
  );
}
