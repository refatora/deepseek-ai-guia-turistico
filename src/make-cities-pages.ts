import { readFileSync, writeFileSync } from 'fs'
import { citiesSchema } from './schema.js'

const citiesJsonPath = './resources/cities.json' as const
const outputDir = './docs' as const
const layoutPath = `./resources/layout/layout.html` as const
const contentPlaceholder = '{{CONTENT}}' as const
const contentDir = `./resources/content` as const

const cities = citiesSchema.parse(JSON.parse(readFileSync(citiesJsonPath, 'utf-8')))
const layout = readFileSync(layoutPath, 'utf-8')

cities.forEach((c) => {
  const contentPath = `${contentDir}/${c.nameNormalized}.html`
  const content = readFileSync(contentPath, 'utf-8')
  const outputPath = `${outputDir}/${c.nameNormalized}.html`
  const output = layout.replace(contentPlaceholder, content)
  console.log(`Writting ${outputPath}`)
  writeFileSync(outputPath, output)
})