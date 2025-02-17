import { cpSync, readFileSync, writeFileSync } from 'fs'
import { citiesSchema } from './schema.js'

const citiesJsonPath = './resources/cities.json' as const
const layoutDir = './resources/layout' as const
const outputDir = './docs' as const

const layoutPath = `./resources/layout/layout.html` as const
const contentPlaceholder = '{{CONTENT}}' as const

console.log(`Copying directory ${layoutDir} to ${outputDir}`)
copyDirectory(layoutDir, outputDir)

const cities = citiesSchema.parse(JSON.parse(readFileSync(citiesJsonPath, 'utf-8')))

const citiesLinks = cities
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => `<p><a href="./${c.nameNormalized}.html">${c.name}</a><p>`)
  .join('\n')

const citiesDiv = `
<h1>Cidades</h1>
<p>Descubra o melhor de cada destino! Escolha uma das cidades abaixo e explore o roteiro turístico exclusivo que preparamos para você.</p>
<div class="cities-links">
${citiesLinks}
</div>`

console.log(citiesDiv)

const layout = readFileSync(layoutPath, 'utf-8')
const output = layout.replace(contentPlaceholder, citiesDiv)
const outputPath = `${outputDir}/index.html`
console.log(`Writting file ${outputPath}`)
writeFileSync(outputPath, output)


function copyDirectory(src: string, dest: string) {
  cpSync(src, dest, { recursive: true })
}
