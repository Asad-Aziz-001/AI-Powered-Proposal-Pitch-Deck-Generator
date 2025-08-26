export interface Template {
  id: string
  name: string
  description: string
  category: "business" | "creative" | "technical" | "minimal"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  preview: string
}

export const proposalTemplates: Template[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean, corporate design perfect for business proposals",
    category: "business",
    colors: {
      primary: "rgb(30, 41, 59)", // slate-800
      secondary: "rgb(71, 85, 105)", // slate-600
      accent: "rgb(59, 130, 246)", // blue-500
      background: "rgb(248, 250, 252)", // slate-50
      text: "rgb(15, 23, 42)", // slate-900
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
    },
    preview: "Modern corporate styling with blue accents",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and modern design for creative agencies",
    category: "creative",
    colors: {
      primary: "rgb(147, 51, 234)", // purple-600
      secondary: "rgb(168, 85, 247)", // purple-500
      accent: "rgb(236, 72, 153)", // pink-500
      background: "rgb(250, 250, 250)", // neutral-50
      text: "rgb(23, 23, 23)", // neutral-900
    },
    fonts: {
      heading: "font-sans",
      body: "font-sans",
    },
    preview: "Vibrant purple and pink gradient design",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Clean, data-focused design for tech companies",
    category: "technical",
    colors: {
      primary: "rgb(15, 118, 110)", // teal-700
      secondary: "rgb(20, 184, 166)", // teal-500
      accent: "rgb(34, 197, 94)", // green-500
      background: "rgb(249, 250, 251)", // gray-50
      text: "rgb(17, 24, 39)", // gray-900
    },
    fonts: {
      heading: "font-mono",
      body: "font-sans",
    },
    preview: "Tech-focused with teal and green accents",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple, elegant design that focuses on content",
    category: "minimal",
    colors: {
      primary: "rgb(17, 24, 39)", // gray-900
      secondary: "rgb(75, 85, 99)", // gray-600
      accent: "rgb(107, 114, 128)", // gray-500
      background: "rgb(255, 255, 255)", // white
      text: "rgb(17, 24, 39)", // gray-900
    },
    fonts: {
      heading: "font-serif",
      body: "font-serif",
    },
    preview: "Minimalist black and white design",
  },
]

export const pitchDeckTemplates: Template[] = [
  {
    id: "startup",
    name: "Startup",
    description: "Dynamic design perfect for startup pitch decks",
    category: "business",
    colors: {
      primary: "rgb(239, 68, 68)", // red-500
      secondary: "rgb(249, 115, 22)", // orange-500
      accent: "rgb(245, 158, 11)", // amber-500
      background: "rgb(255, 251, 235)", // amber-50
      text: "rgb(120, 53, 15)", // amber-900
    },
    fonts: {
      heading: "font-sans",
      body: "font-sans",
    },
    preview: "Energetic red-orange gradient for startups",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional design for established businesses",
    category: "business",
    colors: {
      primary: "rgb(30, 58, 138)", // blue-900
      secondary: "rgb(59, 130, 246)", // blue-500
      accent: "rgb(147, 197, 253)", // blue-300
      background: "rgb(239, 246, 255)", // blue-50
      text: "rgb(30, 58, 138)", // blue-900
    },
    fonts: {
      heading: "font-serif",
      body: "font-sans",
    },
    preview: "Classic blue corporate styling",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with bold typography",
    category: "creative",
    colors: {
      primary: "rgb(16, 185, 129)", // emerald-500
      secondary: "rgb(52, 211, 153)", // emerald-400
      accent: "rgb(110, 231, 183)", // emerald-300
      background: "rgb(236, 253, 245)", // emerald-50
      text: "rgb(6, 78, 59)", // emerald-900
    },
    fonts: {
      heading: "font-sans",
      body: "font-sans",
    },
    preview: "Fresh emerald green modern design",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design for premium presentations",
    category: "minimal",
    colors: {
      primary: "rgb(55, 48, 163)", // indigo-700
      secondary: "rgb(99, 102, 241)", // indigo-500
      accent: "rgb(196, 181, 253)", // violet-300
      background: "rgb(250, 250, 255)", // indigo-50
      text: "rgb(55, 48, 163)", // indigo-700
    },
    fonts: {
      heading: "font-serif",
      body: "font-serif",
    },
    preview: "Elegant indigo and violet styling",
  },
]

export function getTemplate(templateId: string, documentType: "proposal" | "pitch-deck"): Template | undefined {
  const templates = documentType === "proposal" ? proposalTemplates : pitchDeckTemplates
  return templates.find((t) => t.id === templateId)
}
