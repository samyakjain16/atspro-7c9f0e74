import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Filter, Upload, UserPlus, FileText } from "lucide-react";

const Candidates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Candidates
              </h1>
              <p className="text-muted-foreground">
                Manage your talent pool with AI-powered candidate insights
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                <Upload className="w-4 h-4 mr-2" />
                Parse Resume
              </Button>
              <Button className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search candidates by name, skills, or position..."
                className="pl-10 bg-muted/20 border-border"
              />
            </div>
            <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gradient-neon rounded-full flex items-center justify-center mb-6 shadow-neon-md">
              <Users className="w-12 h-12 text-background" />
            </div>
            <CardTitle className="text-2xl mb-2 text-center">
              Your talent pool is empty
            </CardTitle>
            <CardDescription className="text-center mb-8 max-w-md">
              Start building your candidate database by adding profiles manually or using our AI-powered resume parser to extract information automatically.
            </CardDescription>
            <div className="flex gap-4">
              <Button className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add First Candidate
              </Button>
              <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                <Upload className="w-4 h-4 mr-2" />
                Parse Resume
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Candidate Management Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-blue/20 rounded-lg flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-neon-blue" />
                </div>
                <CardTitle className="text-lg">AI Resume Parsing</CardTitle>
                <CardDescription>
                  Automatically extract candidate information from resumes using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Extract contact details</li>
                  <li>• Identify skills and experience</li>
                  <li>• Support for PDF, DOCX, TXT</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center mb-2">
                  <UserPlus className="w-6 h-6 text-neon-purple" />
                </div>
                <CardTitle className="text-lg">Smart Profiles</CardTitle>
                <CardDescription>
                  Comprehensive candidate profiles with ratings and tags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 5-star rating system</li>
                  <li>• Skill tags and categories</li>
                  <li>• Activity tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-neon-cyan/20 rounded-lg flex items-center justify-center mb-2">
                  <Search className="w-6 h-6 text-neon-cyan" />
                </div>
                <CardTitle className="text-lg">Advanced Search</CardTitle>
                <CardDescription>
                  Find the perfect candidates with powerful filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Filter by skills and experience</li>
                  <li>• Sort by ratings and dates</li>
                  <li>• Status-based organization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sample Candidates Preview */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Sample Candidate Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Senior React Developer",
                rating: 5,
                status: "Interview",
                skills: ["React", "TypeScript", "Node.js"],
                location: "San Francisco, CA",
                color: "border-neon-blue/30"
              },
              {
                name: "Michael Chen",
                role: "Product Designer",
                rating: 4,
                status: "Connected", 
                skills: ["Figma", "Prototyping", "UX Research"],
                location: "Remote",
                color: "border-neon-purple/30"
              }
            ].map((candidate, index) => (
              <Card key={index} className={`bg-gradient-card border ${candidate.color} shadow-card`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <CardDescription>{candidate.role}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < candidate.rating ? "text-neon-blue" : "text-muted"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs px-2 py-1 bg-neon-green/20 text-neon-green rounded">
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-muted/40 text-xs rounded-md text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Candidates;