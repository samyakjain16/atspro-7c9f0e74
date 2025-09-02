import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BriefcaseBusiness, Plus, Search, Filter, Building2, MapPin, DollarSign } from "lucide-react";

const Jobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Jobs
              </h1>
              <p className="text-muted-foreground">
                Manage job postings and track applications
              </p>
            </div>
            <Button className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs by title, company, or location..."
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
              <BriefcaseBusiness className="w-12 h-12 text-background" />
            </div>
            <CardTitle className="text-2xl mb-2 text-center">
              No jobs posted yet
            </CardTitle>
            <CardDescription className="text-center mb-8 max-w-md">
              Start building your talent pipeline by posting your first job. You can create detailed job descriptions, set requirements, and manage applications all in one place.
            </CardDescription>
            <div className="flex gap-4">
              <Button className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
              <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                Import Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Templates Preview */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Popular Job Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Software Engineer",
                company: "Tech Startup",
                location: "Remote",
                salary: "$80k - $120k",
                tags: ["React", "TypeScript", "Node.js"],
                color: "border-neon-blue/30"
              },
              {
                title: "Product Manager",
                company: "SaaS Company",
                location: "San Francisco, CA",
                salary: "$100k - $150k",
                tags: ["Strategy", "Analytics", "Leadership"],
                color: "border-neon-purple/30"
              },
              {
                title: "UX Designer",
                company: "Design Agency",
                location: "New York, NY",
                salary: "$70k - $100k",
                tags: ["Figma", "Prototyping", "User Research"],
                color: "border-neon-cyan/30"
              }
            ].map((job, index) => (
              <Card key={index} className={`bg-gradient-card border ${job.color} shadow-card hover:shadow-neon-sm transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4 mr-1" />
                    {job.company}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted/40 text-xs rounded-md text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full hover:shadow-neon-sm transition-shadow">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;