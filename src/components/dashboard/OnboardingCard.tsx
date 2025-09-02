import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ExternalLink, Video, Phone, Mail } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: "general" | "recruitment" | "career" | "integration";
}

const onboardingSteps: OnboardingStep[] = [
  // General Settings
  { id: "profile", title: "Complete your profile", description: "Add your photo, bio, and contact information", completed: true, category: "general" },
  { id: "calendar", title: "Connect your calendar", description: "Sync with Google Calendar or Outlook", completed: false, category: "general" },
  { id: "features", title: "Explore key features", description: "Take a tour of the main functionality", completed: false, category: "general" },
  
  // Recruitment Foundations
  { id: "forms", title: "Set up application forms", description: "Create custom forms for candidates", completed: false, category: "recruitment" },
  { id: "templates", title: "Design email templates", description: "Create templates for candidate communication", completed: false, category: "recruitment" },
  { id: "triggers", title: "Configure automation", description: "Set up automated workflows and triggers", completed: false, category: "recruitment" },
  
  // Career Page
  { id: "design", title: "Design your career page", description: "Customize your public job board", completed: false, category: "career" },
  { id: "domain", title: "Set up custom domain", description: "Connect your own domain name", completed: false, category: "career" },
  
  // Integrations
  { id: "jobboards", title: "Connect job boards", description: "Integrate with Indeed, LinkedIn, and more", completed: false, category: "integration" },
];

const categoryLabels = {
  general: "General Settings",
  recruitment: "Recruitment Foundations",
  career: "Career Page Setup",
  integration: "Integration Setup"
};

const categoryColors = {
  general: "bg-neon-blue",
  recruitment: "bg-neon-purple", 
  career: "bg-neon-cyan",
  integration: "bg-neon-green"
};

const OnboardingCard = () => {
  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const groupedSteps = onboardingSteps.reduce((acc, step) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push(step);
    return acc;
  }, {} as Record<string, OnboardingStep[]>);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-neon bg-clip-text text-transparent">
                Welcome to ATS Pro! 🎉
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Let's get you set up with everything you need to start recruiting successfully.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              {completedSteps}/{totalSteps} Complete
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Setup Progress</span>
              <span className="text-primary font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-neon h-2 rounded-full transition-all duration-500 shadow-neon-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Onboarding Steps by Category */}
      {Object.entries(groupedSteps).map(([category, steps]) => (
        <Card key={category} className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]} shadow-neon-sm`} />
              <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <h4 className="font-medium text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {!step.completed && (
                    <Button variant="outline" size="sm" className="hover:shadow-neon-sm transition-shadow">
                      Start
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Video className="w-5 h-5 text-neon-blue" />
              <span>Training Webinars</span>
            </CardTitle>
            <CardDescription>
              Join our weekly training sessions to master ATS Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Phone className="w-5 h-5 text-neon-purple" />
              <span>Get Support</span>
            </CardTitle>
            <CardDescription>
              Need help? Our team is here to assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Mail className="w-5 h-5 text-neon-cyan" />
              <span>Resources</span>
            </CardTitle>
            <CardDescription>
              Access guides, templates, and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Resources
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingCard;