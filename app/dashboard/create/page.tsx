"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Sparkles, Palette } from "lucide-react"
import Link from "next/link"
import { proposalTemplates, pitchDeckTemplates } from "@/lib/templates"

export default function CreatePage() {
  const [documentType, setDocumentType] = useState("proposal")
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    clientName: "",
    industry: "",
    projectDescription: "",
    targetMarket: "",
    budget: "",
    goals: "",
    competitors: "",
    timeline: "",
    additionalRequirements: "",
    includeFinancials: false,
    includeTimeline: true,
    includeCompetitorAnalysis: false,
  })

  const currentTemplates = documentType === "proposal" ? proposalTemplates : pitchDeckTemplates
  const currentTemplate = currentTemplates.find((t) => t.id === selectedTemplate) || currentTemplates[0]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocumentTypeChange = (newType: string) => {
    setDocumentType(newType)
    // Reset template selection when document type changes
    setSelectedTemplate(newType === "proposal" ? "professional" : "startup")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const endpoint = documentType === "proposal" ? "/api/generate-proposal" : "/api/generate-pitch-deck"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          template: currentTemplate,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Store the generated content and redirect to results page
        localStorage.setItem("generatedContent", JSON.stringify(result))
        localStorage.setItem("documentType", documentType)
        localStorage.setItem("selectedTemplate", selectedTemplate)
        window.location.href = "/dashboard/results"
      } else {
        alert("Failed to generate content. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Document</h1>
            <p className="text-muted-foreground">Generate professional proposals and pitch decks with AI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Document Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Document Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proposal">Business Proposal</SelectItem>
                  <SelectItem value="pitch-deck">Pitch Deck</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Choose Template</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md border-slate-950 ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.accent }} />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{template.preview}</div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    placeholder="Client or prospect name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="industry">Industry/Niche *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectDescription">Project Description *</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                  placeholder="Describe your project, product, or service in detail..."
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetMarket">Target Market *</Label>
                <Textarea
                  id="targetMarket"
                  value={formData.targetMarket}
                  onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                  placeholder="Who is your target audience? Demographics, size, characteristics..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget/Investment *</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="e.g., $50,000 - $100,000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange("timeline", e.target.value)}
                    placeholder="e.g., 3-6 months"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals and Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Goals & Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goals">Goals & Objectives *</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  placeholder="What are your main goals and expected outcomes?"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="competitors">Competitors (Optional)</Label>
                <Textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange("competitors", e.target.value)}
                  placeholder="List main competitors or similar solutions..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                <Textarea
                  id="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                  placeholder="Any specific requirements, constraints, or preferences..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customization Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeFinancials"
                  checked={formData.includeFinancials}
                  onCheckedChange={(checked) => handleInputChange("includeFinancials", checked)}
                />
                <Label htmlFor="includeFinancials">Include detailed financial projections</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTimeline"
                  checked={formData.includeTimeline}
                  onCheckedChange={(checked) => handleInputChange("includeTimeline", checked)}
                />
                <Label htmlFor="includeTimeline">Include project timeline and milestones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCompetitorAnalysis"
                  checked={formData.includeCompetitorAnalysis}
                  onCheckedChange={(checked) => handleInputChange("includeCompetitorAnalysis", checked)}
                />
                <Label htmlFor="includeCompetitorAnalysis">Include competitor analysis</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full h-12 text-lg" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Generate {documentType === "proposal" ? "Business Proposal" : "Pitch Deck"}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
