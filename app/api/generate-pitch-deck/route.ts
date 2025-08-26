import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, industry, projectDescription, targetMarket, budget, goals, competitors, timeline } = body

    const prompt = `Create a compelling pitch deck for the following business:

Company: ${companyName}
Industry: ${industry}
Project/Product: ${projectDescription}
Target Market: ${targetMarket}
Budget/Funding: ${budget}
Goals: ${goals}
Timeline: ${timeline}
${competitors ? `Competitors: ${competitors}` : ""}

Generate content for a 10-slide pitch deck with the following slides:
1. Title Slide - Company name and tagline
2. Problem - What problem are we solving?
3. Solution - Our unique solution
4. Market Opportunity - Size and potential
5. Product/Service - Key features and benefits
6. Business Model - How we make money
7. Competition - Competitive landscape
8. Marketing Strategy - How we'll reach customers
9. Financial Projections - Revenue and growth
10. Funding Ask - Investment needed and use of funds

Format the response as a JSON object with each slide as a key containing title and content.`

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxTokens: 3000,
    })

    // Parse the AI response and structure it
    let pitchDeckData
    try {
      pitchDeckData = JSON.parse(text)
    } catch {
      // If JSON parsing fails, create structured response
      pitchDeckData = {
        slide1: { title: `${companyName}`, content: `Revolutionizing ${industry}` },
        slide2: { title: "Problem", content: "Market challenges and pain points we address" },
        slide3: { title: "Solution", content: projectDescription },
        slide4: { title: "Market Opportunity", content: `Targeting ${targetMarket}` },
        slide5: { title: "Product/Service", content: "Key features and benefits" },
        slide6: { title: "Business Model", content: "Revenue generation strategy" },
        slide7: { title: "Competition", content: competitors || "Competitive analysis" },
        slide8: { title: "Marketing Strategy", content: "Customer acquisition plan" },
        slide9: { title: "Financial Projections", content: `Budget: ${budget}` },
        slide10: { title: "Funding Ask", content: "Investment opportunity" },
      }
    }

    return NextResponse.json({
      success: true,
      pitchDeck: pitchDeckData,
      metadata: {
        companyName,
        industry,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating pitch deck:", error)
    return NextResponse.json({ success: false, error: "Failed to generate pitch deck" }, { status: 500 })
  }
}
