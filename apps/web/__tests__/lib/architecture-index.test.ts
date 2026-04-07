import {
  apiRouteFileToRoute,
  appPageFileToRoute,
  appSpecialFileToRoute,
  renderArchitectureMarkdown,
} from '@/lib/architecture-index';

describe('architecture index helpers', () => {
  test('maps app pages to routes', () => {
    expect(appPageFileToRoute('apps/web/app/page.tsx')).toBe('/');
    expect(appPageFileToRoute('apps/web/app/routines/[id]/edit/page.tsx')).toBe('/routines/[id]/edit');
    expect(appPageFileToRoute('apps/web/app/stretches/[workoutName]/page.tsx')).toBe('/stretches/[workoutName]');
  });

  test('ignores route groups and parallel route markers', () => {
    expect(appPageFileToRoute('apps/web/app/(marketing)/about/page.tsx')).toBe('/about');
    expect(appPageFileToRoute('apps/web/app/@modal/settings/page.tsx')).toBe('/settings');
  });

  test('maps special app files to routes', () => {
    expect(appSpecialFileToRoute('apps/web/app/manifest.ts')).toBe('/manifest.webmanifest');
    expect(appSpecialFileToRoute('apps/web/app/favicon.ico')).toBe('/favicon.ico');
    expect(appSpecialFileToRoute('apps/web/app/layout.tsx')).toBeNull();
  });

  test('maps api route handlers to endpoints', () => {
    expect(apiRouteFileToRoute('apps/web/app/api/workout/[name]/route.ts')).toBe('/api/workout/[name]');
    expect(apiRouteFileToRoute('apps/web/app/api/routines/[id]/favorite/route.ts')).toBe('/api/routines/[id]/favorite');
  });

  test('renders stable markdown sections', () => {
    const markdown = renderArchitectureMarkdown({
      schemaVersion: 1,
      appRoot: 'apps/web',
      generatedBy: 'apps/web/scripts/generate-architecture-index.ts',
      commands: {
        dev: 'bun run dev',
        unitTests: 'bun run test:run',
        e2eTests: 'bun run test:e2e',
        refreshArchitecture: 'bun run docs:architecture',
      },
      keyConfigFiles: ['apps/web/tsconfig.json'],
      appShellFiles: ['apps/web/app/layout.tsx'],
      appRoutes: [{ route: '/', file: 'apps/web/app/page.tsx' }],
      specialRoutes: [{ route: '/manifest.webmanifest', file: 'apps/web/app/manifest.ts' }],
      apiRoutes: [{ route: '/api/routines', file: 'apps/web/app/api/routines/route.ts' }],
      sharedComponents: ['apps/web/app/components/Header.tsx'],
      libraryGroups: [{ group: 'root', files: ['apps/web/lib/types.ts'] }],
      unitTests: ['apps/web/__tests__/lib/architecture-index.test.ts'],
      e2eSpecs: ['apps/web/e2e/home-login.spec.ts'],
      e2eFlowDoc: 'apps/web/e2e/flows.md',
      adrFiles: ['docs/adr/0001-web-app-source-of-truth.md'],
    });

    expect(markdown).toContain('# Architecture Index');
    expect(markdown).toContain('`/api/routines`');
    expect(markdown).toContain('## ADRs');
  });
});
