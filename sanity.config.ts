import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Import schemas
import { filmSchema } from './sanity/schemas/film'
import { awardSchema } from './sanity/schemas/award'
import { teamMemberSchema } from './sanity/schemas/teamMember'
import { serviceSchema } from './sanity/schemas/service'

export default defineConfig({
  name: 'alibi-studios',
  title: 'Alibi Studios CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      filmSchema,
      awardSchema,
      teamMemberSchema,
      serviceSchema,
    ],
  },
})
