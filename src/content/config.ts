// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const jsonDataCollection = defineCollection({
  type: 'data',
  schema: z.object({
    //Define JSON-file structure
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
