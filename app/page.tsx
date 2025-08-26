import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Presentation as PresentationChart, Sparkles, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-heading font-bold text-foreground">ProposalAI</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            AI-Powered Business Documents
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Generate Professional <span className="text-primary">Proposals</span> &{" "}
            <span className="text-accent">Pitch Decks</span> in Minutes
          </h1>
          <p className="text-xl mb-8 leading-relaxed text-black">
            Transform your business ideas into compelling proposals and investor-ready pitch decks using advanced AI.
            Perfect for freelancers, startups, and small businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="#demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
              Everything You Need to Win Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform handles the heavy lifting so you can focus on what matters most - growing your
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-heading">Smart Proposals</CardTitle>
                <CardDescription className="text-gray-700">
                  Generate comprehensive business proposals with executive summaries, problem statements, and detailed
                  solutions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <PresentationChart className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-heading">Investor Pitch Decks</CardTitle>
                <CardDescription className="text-gray-700">
                  Create professional slide decks with compelling narratives, market analysis, and financial
                  projections.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="font-heading">Target Market Analysis</CardTitle>
                <CardDescription className="text-gray-700">
                  AI-powered market research and competitive analysis to strengthen your business case.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Transform Your Business Documents?
          </h2>
          <p className="text-xl mb-8 text-black">
            Join thousands of entrepreneurs who trust ProposalAI to create winning proposals and pitch decks.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/register">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold">ProposalAI</span>
          </div>
          <p className="text-sidebar-foreground">© 2025 ProposalAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
