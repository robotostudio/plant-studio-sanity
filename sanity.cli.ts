/**
 * Sanity CLI config: used by `sanity schema extract` and `sanity typegen generate`.
 * The Studio itself is embedded in Next.js at /studio (see sanity.config.ts).
 */
import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {projectId, dataset},
  typegen: {
    path: './{app,sanity}/**/*.{ts,tsx,js,jsx}',
    schema: './schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
