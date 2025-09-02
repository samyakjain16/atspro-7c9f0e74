import Header from "@/components/layout/Header";
import OnboardingCard from "@/components/dashboard/OnboardingCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BriefcaseBusiness, 
  TrendingUp, 
  Building2,
  Plus,
  ArrowUpRight
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Jobs",
      value: "12",
      change: "+2 this week",
      icon: BriefcaseBusiness,
      color: "text-neon-blue"
    },
    {
      title: "Active Candidates",
      value: "248",
      change: "+18 this week",
      icon: Users,
      color: "text-neon-purple"
    },
    {
      title: "Applications",
      value: "1,429",
      change: "+12% this month",
      icon: TrendingUp,
      color: "text-neon-cyan"
    },
    {
      title: "Clients",
      value: "8",
      change: "+1 this month",
      icon: Building2,
      color: "text-neon-green"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your recruitment process.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-neon-green" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-neon-blue" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>
                Common tasks to get you started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline" className="w-full justify-start hover:shadow-neon-sm transition-shadow">
                <Users className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
              <Button variant="outline" className="w-full justify-start hover:shadow-neon-sm transition-shadow">
                <Building2 className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-neon-cyan" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest updates in your recruitment pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-2 h-2 bg-neon-green rounded-full shadow-neon-sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New application received</p>
                    <p className="text-xs text-muted-foreground">Sarah Johnson applied for Senior Developer position</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-2 h-2 bg-neon-blue rounded-full shadow-neon-sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Interview scheduled</p>
                    <p className="text-xs text-muted-foreground">Technical interview with Michael Chen tomorrow at 2 PM</p>
                  </div>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                  <div className="w-2 h-2 bg-neon-purple rounded-full shadow-neon-sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Job published</p>
                    <p className="text-xs text-muted-foreground">Frontend Developer position is now live on job boards</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Section */}
        <OnboardingCard />
      </main>
    </div>
  );
};

export default Dashboard;