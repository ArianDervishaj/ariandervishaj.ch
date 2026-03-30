import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const jsonDataCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/staticData' }),
  schema: z.object({
    profileTitle: z.string(),
    profileName: z.string(),
    github: z.string().url(),
    linkedin: z.string().url(),
    alias: z.string(),
    techsTitle: z.string(),
    githubIconName: z.string(),
    linkedinIconName: z.string(),
    pageTitle: z.string(),
    pageDescription: z.string(),
  }),
});

export const collections = {
  staticData: jsonDataCollection,
};