"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react"
import { getTemplate, type Template } from "@/lib/templates"

interface PitchDeckViewerProps {
  pitchDeck: any
  metadata: {
    companyName: string
    industry: string
    generatedAt: string
  }
}

export default function PitchDeckViewer({ pitchDeck, metadata }: PitchDeckViewerProps) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  useEffect(() => {
    const storedTemplate = localStorage.getItem("selectedTemplate")
    if (storedTemplate) {
      const templateData = getTemplate(storedTemplate, "pitch-deck")
      setTemplate(templateData || null)
    }
  }, [])

  const slides = Object.entries(pitchDeck).map(([key, slide]: [string, any]) => ({
    id: key,
    title: slide.title,
    content: slide.content,
  }))

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode)
  }

  if (isPresentationMode && template) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="w-full h-full flex flex-col">
          {/* Presentation Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={togglePresentationMode}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Exit Presentation
              </Button>
              <span className="text-sm">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Presentation Slide with Template Styling */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              className="rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[600px] p-12 flex flex-col justify-center"
              style={{
                backgroundColor: template.colors.background,
                color: template.colors.text,
              }}
            >
              <h1
                className={`text-4xl font-bold mb-8 text-center ${template.fonts.heading}`}
                style={{ color: template.colors.primary }}
              >
                {slides[currentSlide].title}
              </h1>
              <div
                className={`text-lg leading-relaxed text-center ${template.fonts.body}`}
                style={{ color: template.colors.text }}
              >
                {slides[currentSlide].content}
              </div>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="bg-gray-900 p-4">
            <div className="flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pitch Deck Controls */}
      <div
        className="flex items-center justify-between p-6 rounded-lg"
        style={{
          background: template
            ? `linear-gradient(135deg, ${template.colors.primary}10, ${template.colors.accent}10)`
            : "linear-gradient(135deg, rgb(59, 130, 246, 0.1), rgb(147, 51, 234, 0.1))",
        }}
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Interactive Pitch Deck</h2>
          <p className="text-muted-foreground">
            Navigate through your presentation slides or enter full-screen presentation mode
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePresentationMode}>
            <Play className="h-4 w-4 mr-2" />
            Present
          </Button>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Current Slide Display with Template Styling */}
      <Card
        className="border-2"
        style={{
          borderColor: template ? template.colors.primary + "40" : "rgb(59, 130, 246, 0.25)",
        }}
      >
        <CardHeader
          style={{
            background: template
              ? `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.accent}08)`
              : "linear-gradient(135deg, rgb(59, 130, 246, 0.05), rgb(147, 51, 234, 0.05))",
          }}
        >
          <div className="flex items-center justify-between">
            <CardTitle
              className={`text-2xl ${template?.fonts.heading || "font-sans"}`}
              style={{ color: template?.colors.primary }}
            >
              {slides[currentSlide].title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">Slide {currentSlide + 1}</div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div
            className={`text-lg leading-relaxed ${template?.fonts.body || "font-sans"}`}
            style={{ color: template?.colors.text }}
          >
            {slides[currentSlide].content}
          </div>
        </CardContent>
      </Card>

      {/* Slide Thumbnails with Template Styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slides.map((slide, index) => (
          <Card
            key={slide.id}
            className={`cursor-pointer transition-all hover:shadow-md ${index === currentSlide ? "ring-2" : ""}`}
            style={{
              ringColor: template?.colors.primary,
            }}
            onClick={() => goToSlide(index)}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm truncate">{slide.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-xs text-muted-foreground line-clamp-3">{slide.content}</div>
              <div className="text-xs mt-2" style={{ color: template?.colors.primary || "rgb(59, 130, 246)" }}>
                Slide {index + 1}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
