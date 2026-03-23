import type { Locale } from '@/lib/i18n';

export interface ProjectDetailSection {
  type: 'text' | 'highlight' | 'metrics' | 'quote' | 'two-column' | 'process-steps' | 'challenge-solution' | 'gallery-text' | 'full-width-statement';
}

export interface TextSection extends ProjectDetailSection {
  type: 'text';
  heading?: string;
  body: string;
}

export interface HighlightSection extends ProjectDetailSection {
  type: 'highlight';
  icon?: string;
  heading: string;
  body: string;
  bgColor?: string;
}

export interface MetricsSection extends ProjectDetailSection {
  type: 'metrics';
  heading?: string;
  items: Array<{ value: string; label: string }>;
}

export interface QuoteSection extends ProjectDetailSection {
  type: 'quote';
  text: string;
  attribution?: string;
}

export interface TwoColumnSection extends ProjectDetailSection {
  type: 'two-column';
  left: { heading: string; body: string };
  right: { heading: string; body: string };
}

export interface ProcessStepsSection extends ProjectDetailSection {
  type: 'process-steps';
  heading?: string;
  steps: Array<{ number: string; title: string; description: string }>;
}

export interface ChallengeSolutionSection extends ProjectDetailSection {
  type: 'challenge-solution';
  challenges: Array<{ title: string; description: string }>;
  solutions: Array<{ title: string; description: string }>;
  challengeHeading?: string;
  solutionHeading?: string;
}

export interface GalleryTextSection extends ProjectDetailSection {
  type: 'gallery-text';
  heading: string;
  body: string;
  items: Array<{ label: string; description: string }>;
}

export interface FullWidthStatementSection extends ProjectDetailSection {
  type: 'full-width-statement';
  statement: string;
  subtext?: string;
}

export type AnySection =
  | TextSection
  | HighlightSection
  | MetricsSection
  | QuoteSection
  | TwoColumnSection
  | ProcessStepsSection
  | ChallengeSolutionSection
  | GalleryTextSection
  | FullWidthStatementSection;

export interface ProjectDetail {
  slug: string;
  category: 'imagery' | 'technology' | 'consultancy';
  title: string;
  subtitle: string;
  industry: string;
  year: string;
  duration: string;
  overview: string;
  sections: AnySection[];
  outcome: {
    heading: string;
    body: string;
  };
  nextProject?: {
    slug: string;
    title: string;
  };
}

// Registry of all project detail content loaders
// Each project will register its content here
const projectRegistry: Record<string, Record<Locale, () => ProjectDetail>> = {};

export function registerProject(slug: string, loaders: Record<Locale, () => ProjectDetail>) {
  projectRegistry[slug] = loaders;
}

export function getProjectDetail(slug: string, locale: Locale): ProjectDetail | null {
  const loaders = projectRegistry[slug];
  if (!loaders) return null;
  return loaders[locale]();
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projectRegistry);
}
