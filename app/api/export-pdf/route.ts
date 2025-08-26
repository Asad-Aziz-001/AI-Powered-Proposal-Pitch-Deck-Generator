import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, documentType, metadata } = body

    // For now, we'll return the content formatted for PDF generation
    // In a production app, you might use puppeteer or a PDF generation service
    const pdfData = {
      title: documentType === "proposal" ? "Business Proposal" : "Pitch Deck",
      company: metadata.companyName,
      industry: metadata.industry,
      generatedAt: metadata.generatedAt,
      content: content,
      documentType: documentType,
    }

    return NextResponse.json({
      success: true,
      pdfData: pdfData,
      downloadUrl: `/api/download-pdf?id=${Date.now()}`, // Temporary URL
    })
  } catch (error) {
    console.error("Error preparing PDF export:", error)
    return NextResponse.json({ success: false, error: "Failed to prepare PDF export" }, { status: 500 })
  }
}
