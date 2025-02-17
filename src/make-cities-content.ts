import { readFileSync, writeFileSync } from "fs"
import { citiesSchema, City } from "./schema.js"
import axios from "axios"
import { Marked } from "@ts-stack/markdown"

const citiesJsonPath = './resources/cities.json'
const llamaUrl = 'http://localhost:11434/api/generate'
const outputDir  = './resources/content'

const cities = citiesSchema.parse(JSON.parse(readFileSync(citiesJsonPath, 'utf-8')))

for(const city of cities) {
  const prompt = makePrompt(city)
  console.log(`Asking Llama about ${city.name}`)
  const content = await askLlama(prompt)
  console.log(`Answer saved in ${outputDir}/${city.nameNormalized}.html`)
  writeContent(city, content)
}

function makePrompt(city: City) {
  return `
Responda em português.
Escreva um roteiro turístico detalhado para a cidade de ${city.name}-${city.region} com a seguinte estrutura:

## Introdução
Apresente a cidade destacando:
- Sua importância histórica e cultural.
- Principais características geográficas.
- Um resumo sobre o que a torna única e atrativa para visitantes.

## Atrações
Descreva cinco atrações turísticas, com um equilíbrio entre opções gratuitas e pagas.
Para cada atração, inclua:
- Características ou histórias que a diferenciam indicando porque a atrção é especial.
- Atividades, pontos de interesse, e experiências que o local oferece para o visitante entender o que esperar da atração.
- Preços (se aplicável), horários de funcionamento, e dias de visitação.  

## Restaurantes
Indique três restaurantes na cidade sendo: dois restaurantes acessíveis com pratos típicos da culinária local, enfatizando sabores autênticos; e um restaurante sofisticado que ofereça uma experiência gastronômica especial.

Para cada restaurante, mencione:
- Especialidades do cardápio.
- Ambiente e estilo.
- Faixa de preço e horários de funcionamento.

## Dicas de Viagem
Inclua dicas úteis para os viajantes:
- Sugira a melhor época para visitar a cidade, considerando clima, eventos ou festivais.
- Inclua recomendações sobre vestuário, transporte e segurança.
- Dicas exclusivas para melhorar a experiência do visitante.
`
}

async function askLlama(prompt: string): Promise<string> {
  const data = {
      model: 'deepseek-r1:14b',
      prompt,
      stream: false,
  }
  const response = await axios.post(llamaUrl, data)
  const answer = response.data.response
  const markdown = answer
  .substring(answer.indexOf('</think>') + '</think>'.length)
    .trim()
  return Marked.parse(markdown)
}

function writeContent(city: City, content: string): void {
  const outputPath = `${outputDir}/${city.nameNormalized}.html`
  writeFileSync(outputPath, content)
}