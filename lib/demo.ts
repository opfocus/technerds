export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: 'Develop',
    items: [
      {
        name: 'Dashboard',
        slug: 'layouts',
        description: 'Create UI that is shared across routes',
      },
      {
        name: '[TBA]',
        slug: 'route-groups',
        description: 'Organize routes without affecting URL paths',
      },
      {
        name: '[TBA2]',
        slug: 'parallel-routes',
        description: 'Render multiple pages in the same layout',
      },
    ],
  },
  {
    name: 'TechNerd Program',
    items: [
      {
        name: '[TBA]Members',
        slug: 'loading',
        description:
          'Create meaningful Loading UI for specific parts of an app',
      },
      {
        name: '[TBA]Tracking',
        slug: 'error-handling',
        description: 'Create Error UI for specific parts of an app',
      },
      {
        name: '[TBA]Insight',
        slug: 'not-found',
        description: 'Create Not Found UI for specific parts of an app',
      },
    ],
  },
];