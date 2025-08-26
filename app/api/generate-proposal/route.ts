import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      clientName,
      industry,
      projectDescription,
      targetMarket,
      budget,
      goals,
      competitors,
      timeline,
      additionalRequirements,
    } = body

    const prompt = `Create a comprehensive business proposal for the following project:

Company: ${companyName}
Client: ${clientName}
Industry: ${industry}
Project Description: ${projectDescription}
Target Market: ${targetMarket}
Budget: ${budget}
Goals: ${goals}
Timeline: ${timeline}
${competitors ? `Competitors: ${competitors}` : ""}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ""}

Generate a professional business proposal with the following sections:
1. Executive Summary
2. Project Overview
3. Target Market Analysis
4. Proposed Solution
5. Timeline & Milestones
6. Budget Breakdown
7. Expected Outcomes
8. Next Steps

Format the response as a structured JSON object with each section as a key containing the content.`

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxTokens: 4000,
    })

    // Parse the AI response and structure it
    let proposalData
    try {
      proposalData = JSON.parse(text)
    } catch {
      // If JSON parsing fails, create structured response from text
      proposalData = {
        executiveSummary: text.substring(0, 500),
        projectOverview: projectDescription,
        targetMarket: targetMarket,
        proposedSolution: text.substring(500, 1500),
        timeline: timeline,
        budget: budget,
        expectedOutcomes: goals,
        nextSteps: "Contact us to discuss implementation details and begin the project.",
      }
    }

    return NextResponse.json({
      success: true,
      proposal: proposalData,
      metadata: {
        companyName,
        clientName,
        industry,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json({ success: false, error: "Failed to generate proposal" }, { status: 500 })
  }
}
