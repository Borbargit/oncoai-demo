import { NextResponse } from 'next/server'

// Упрощенная модель для демо
const cancerKeywords: Record<string, string[]> = {
  'желудок': ['желудок', 'гастрит', 'C16'],
  'кишка': ['кишка', 'колоректальный', 'C18', 'C19', 'C20'],
  'прямая кишка': ['прямая кишка', 'ректум', 'C20'],
  'молочная железа': ['молочная', 'грудь', 'C50']
}

const stageKeywords = {
  'I': ['стадия I', 'T1', 'ранняя'],
  'II': ['стадия II', 'T2'],
  'III': ['стадия III', 'T3', 'N+'],
  'IV': ['стадия IV', 'M1', 'метастаз']
}

export async function POST(request: Request) {
  const { text } = await request.json()
  
  // Простая логика классификации
  let detectedCancer = 'не определен'
  let detectedStage = 'не определена'
  
  for (const [cancer, keywords] of Object.entries(cancerKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
      detectedCancer = cancer
      break
    }
  }
  
  for (const [stage, keywords] of Object.entries(stageKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
      detectedStage = stage
      break
    }
  }
  
  return NextResponse.json({
    cancer_type: detectedCancer,
    stage: detectedStage,
    confidence: 0.8,
    extracted_info: {
      has_metastasis: text.toLowerCase().includes('метастаз'),
      lymph_nodes: text.toLowerCase().includes('n+') || text.toLowerCase().includes('n1')
    }
  })
}
