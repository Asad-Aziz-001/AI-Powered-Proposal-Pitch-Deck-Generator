"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, FileText, Presentation } from "lucide-react"
import Link from "next/link"
import PitchDeckViewer from "./pitch-deck-viewer"
import { getTemplate, type Template } from "@/lib/templates"

interface GeneratedContent {
  success: boolean
  proposal?: any
  pitchDeck?: any
  metadata: {
    companyName: string
    industry: string
    generatedAt: string
  }
}

export default function ResultsPage() {
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [documentType, setDocumentType] = useState<string>("proposal")
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const storedContent = localStorage.getItem("generatedContent")
    const storedType = localStorage.getItem("documentType")
    const storedTemplate = localStorage.getItem("selectedTemplate")

    if (storedContent) {
      setContent(JSON.parse(storedContent))
    }
    if (storedType) {
      setDocumentType(storedType)
    }
    if (storedTemplate) {
      const templateData = getTemplate(storedTemplate, storedType as "proposal" | "pitch-deck")
      setTemplate(templateData || null)
    }
    setIsLoading(false)
  }, [])

  const handleExportPDF = async () => {
    if (!content) return

    setIsExporting(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.proposal || content.pitchDeck,
          documentType: documentType,
          metadata: content.metadata,
          template: template,
        }),
      })

      const result = await response.json()

      if (result.success) {
        await generatePDF(result.pdfData)
      } else {
        alert("Failed to export PDF. Please try again.")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("An error occurred during export. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const generatePDF = async (pdfData: any) => {
    const jsPDF = (await import("jspdf")).default
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = margin

    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont("helvetica", "bold")
      } else {
        doc.setFont("helvetica", "normal")
      }

      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        if (yPosition > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          yPosition = margin
        }
        doc.text(line, margin, yPosition)
        yPosition += fontSize * 0.5
      })
      yPosition += 5
    }

    addText(pdfData.title, 20, true)
    yPosition += 10

    addText(`Company: ${pdfData.company}`, 12, true)
    addText(`Industry: ${pdfData.industry}`, 12, true)
    addText(`Generated: ${new Date(pdfData.generatedAt).toLocaleDateString()}`, 12, true)
    yPosition += 15

    if (pdfData.documentType === "proposal") {
      const proposal = pdfData.content
      if (proposal.executiveSummary) {
        addText("Executive Summary", 16, true)
        addText(proposal.executiveSummary, 12)
        yPosition += 10
      }
      if (proposal.projectOverview) {
        addText("Project Overview", 16, true)
        addText(proposal.projectOverview, 12)
        yPosition += 10
      }
      if (proposal.proposedSolution) {
        addText("Proposed Solution", 16, true)
        addText(proposal.proposedSolution, 12)
        yPosition += 10
      }
      if (proposal.timeline) {
        addText("Timeline & Milestones", 16, true)
        addText(proposal.timeline, 12)
        yPosition += 10
      }
      if (proposal.budget) {
        addText("Budget Breakdown", 16, true)
        addText(proposal.budget, 12)
      }
    } else {
      const pitchDeck = pdfData.content
      Object.entries(pitchDeck).forEach(([key, slide]: [string, any]) => {
        addText(slide.title, 16, true)
        addText(slide.content, 12)
        yPosition += 15
      })
    }

    const fileName = `${pdfData.company}_${pdfData.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(fileName)
  }

  const handleShare = async () => {
    if (!content) return

    const shareData = {
      title: `${documentType === "proposal" ? "Business Proposal" : "Pitch Deck"} - ${content.metadata.companyName}`,
      text: `Check out this ${documentType} generated for ${content.metadata.companyName}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No content found</h1>
          <Link href="/dashboard/create">
            <Button>Create New Document</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isProposal = documentType === "proposal"
  const data = content.proposal || content.pitchDeck

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isProposal ? (
                  <FileText className="h-6 w-6 text-primary" />
                ) : (
                  <Presentation className="h-6 w-6 text-primary" />
                )}
                <h1 className="text-3xl font-bold">{isProposal ? "Business Proposal" : "Pitch Deck"}</h1>
                {template && (
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: template.colors.primary + "20",
                      color: template.colors.primary,
                    }}
                  >
                    {template.name}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">
                Generated for {content.metadata.companyName} • {content.metadata.industry}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleExportPDF} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {isProposal ? (
          <div className="space-y-6">
            {data.executiveSummary && (
              <Card
                style={{
                  borderColor: template?.colors.primary + "40",
                }}
              >
                <CardHeader
                  style={{
                    background: template
                      ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
                      : undefined,
                  }}
                >
                  <CardTitle className={template?.fonts.heading} style={{ color: template?.colors.primary }}>
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`whitespace-pre-wrap ${template?.fonts.body}`} style={{ color: template?.colors.text }}>
                    {data.executiveSummary}
                  </p>
                </CardContent>
              </Card>
            )}
            {data.projectOverview && (
              <Card
                style={{
                  borderColor: template?.colors.primary + "40",
                }}
              >
                <CardHeader
                  style={{
                    background: template
                      ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
                      : undefined,
                  }}
                >
                  <CardTitle className={template?.fonts.heading} style={{ color: template?.colors.primary }}>
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`whitespace-pre-wrap ${template?.fonts.body}`} style={{ color: template?.colors.text }}>
                    {data.projectOverview}
                  </p>
                </CardContent>
              </Card>
            )}
            {data.proposedSolution && (
              <Card
                style={{
                  borderColor: template?.colors.primary + "40",
                }}
              >
                <CardHeader
                  style={{
                    background: template
                      ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
                      : undefined,
                  }}
                >
                  <CardTitle className={template?.fonts.heading} style={{ color: template?.colors.primary }}>
                    Proposed Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`whitespace-pre-wrap ${template?.fonts.body}`} style={{ color: template?.colors.text }}>
                    {data.proposedSolution}
                  </p>
                </CardContent>
              </Card>
            )}
            {data.timeline && (
              <Card
                style={{
                  borderColor: template?.colors.primary + "40",
                }}
              >
                <CardHeader
                  style={{
                    background: template
                      ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
                      : undefined,
                  }}
                >
                  <CardTitle className={template?.fonts.heading} style={{ color: template?.colors.primary }}>
                    Timeline & Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`whitespace-pre-wrap ${template?.fonts.body}`} style={{ color: template?.colors.text }}>
                    {data.timeline}
                  </p>
                </CardContent>
              </Card>
            )}
            {data.budget && (
              <Card
                style={{
                  borderColor: template?.colors.primary + "40",
                }}
              >
                <CardHeader
                  style={{
                    background: template
                      ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
                      : undefined,
                  }}
                >
                  <CardTitle className={template?.fonts.heading} style={{ color: template?.colors.primary }}>
                    Budget Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`whitespace-pre-wrap ${template?.fonts.body}`} style={{ color: template?.colors.text }}>
                    {data.budget}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <PitchDeckViewer pitchDeck={data} metadata={content.metadata} />
        )}
      </div>
    </div>
  )
}
