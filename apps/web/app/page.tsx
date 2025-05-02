import { NumberTicker } from "@/components/animated/number-ticker";
import { HeroGeometric } from "@/components/animated/shape-landing-hero";
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { TestimonialCard } from "@/components/extended/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { features, stats, testimonials, trendingStyles } from "@/data/landing";
import {
  ArrowRight,
  Camera,
  Heart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Navbar/>
      {/* Hero Section */}

      <HeroGeometric
        badge="AI-Powered Style Discovery"
        titlePre="Your Style Journey"
        titleSuf="Starts Here"
        description="Experience the future of fashion with personalized AI recommendations that understand your unique style."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="gradient_pink" asChild>
            <Link href="/swipe">
              Start Your Style Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
          >
            <Link href="/search">Explore Trends</Link>
          </Button>
        </div>
      </HeroGeometric>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold">
                      <NumberTicker value={stat.value} />
                    </h3>

                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-pink-500" />
              Trending Now
            </h2>
            <Button variant="outline" asChild>
              <Link href="/search">
                See All Trends <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {trendingStyles.map((style, index) => (
              <Card
                key={style.image}
                className="bg-accent overflow-hidden group"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-2 text-card-foreground">{style.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {style.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className="text-xs font-medium bg-background backdrop-blur-sm px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-yellow-500" />
            Why You{"'"}ll Love It
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="backdrop-blur-sm"
                >
                  <CardContent className="pt-6">
                    <div className="rounded-full w-12 h-12 bg-pink-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20  bg-gradient-to-b to-background from-accent">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold">1. Share Your Style</h3>
              <p className="text-muted-foreground">
                Take our quick style quiz or upload your favorite outfits
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold">2. AI Magic</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your preferences and curates perfect matches
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold">3. Discover & Shop</h3>
              <p className="text-muted-foreground">
                Swipe through personalized recommendations and shop your
                favorites
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Hype is Real
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.text} {...testimonial} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Style?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of fashion enthusiasts who found their perfect
              aesthetic with SwipFit.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              asChild
            >
              <Link href="/swipe">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 mix-blend-overlay" />
      </section>
      <Footer/>
    </div>
  );
}
