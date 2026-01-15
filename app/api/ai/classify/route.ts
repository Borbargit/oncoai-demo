import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Имитация обработки ИИ
    const predictions = [
      { label: 'Рак легких', confidence: 0.87 },
      { label: 'Доброкачественное образование', confidence: 0.12 },
      { label: 'Пневмония', confidence: 0.01 },
    ]

    return NextResponse.json({
      success: true,
      message: 'Анализ завершен успешно',
      predictions,
      timestamp: new Date().toISOString(),
      model: 'onkoai-demo-v1',
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка обработки запроса',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'OnkoAI Classification API',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      POST: '/api/ai/classify - Анализ медицинских данных',
    },
    demo: {
      curl: 'curl -X POST https://oncoai-demo.vercel.app/api/ai/classify -H "Content-Type: application/json" -d \'{"data":"пример"}\'',
    }
  })
}
