import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: 'postgresql://postgres:04brian04@localhost:5432/skills_marketplace',
  },
})