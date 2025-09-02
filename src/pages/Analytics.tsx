import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BriefcaseBusiness,
  Target,
  Clock,
  Calendar,
  Download
} from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Applications This Month",
      value: "247",
      change: "+12.3%",
      icon: Users,
      color: "text-neon-blue"
    },
    {
      title: "Active Jobs",
      value: "12",
      change: "+2 new",
      icon: BriefcaseBusiness,
      color: "text-neon-purple"
    },
    {
      title: "Hire Rate",
      value: "18.5%",
      change: "+3.2%",
      icon: Target,
      color: "text-neon-green"
    },
    {
      title: "Avg. Time to Hire",
      value: "14 days",
      change: "-2 days",
      icon: Clock,
      color: "text-neon-cyan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Analytics
              </h1>
              <p className="text-muted-foreground">
                Track your recruitment performance and optimize your hiring process
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-neon-green" />
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-neon-blue" />
                <span>Application Trends</span>
              </CardTitle>
              <CardDescription>
                Monthly application volume over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-8 h-8 text-neon-blue" />
                </div>
                <p className="text-muted-foreground">Chart will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-1">Connect data source to see analytics</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-neon-purple" />
                <span>Conversion Funnel</span>
              </CardTitle>
              <CardDescription>
                Candidate progression through hiring stages
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-8 h-8 text-neon-purple" />
                </div>
                <p className="text-muted-foreground">Funnel chart will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-1">Track conversion rates by stage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-cyan" />
              <span>Performance Insights</span>
            </CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your hiring process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-neon-green rounded-full mt-2 shadow-neon-sm" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Strong Application Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    Your job postings are receiving 23% more applications than industry average. 
                    Consider leveraging this momentum to post additional roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 shadow-neon-sm" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Optimize Interview Process</h4>
                  <p className="text-sm text-muted-foreground">
                    Time-to-hire has increased by 3 days. Consider streamlining your interview 
                    process or adding more interviewers to reduce bottlenecks.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/20">
                <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 shadow-neon-sm" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Top Performing Job Boards</h4>
                  <p className="text-sm text-muted-foreground">
                    LinkedIn and Indeed are driving 67% of quality applications. 
                    Consider increasing budget allocation to these channels.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Available Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Hiring Velocity Report",
                description: "Track time-to-hire metrics and identify bottlenecks",
                icon: Clock,
                color: "border-neon-blue/30"
              },
              {
                title: "Source Quality Analysis", 
                description: "Compare candidate quality across different job boards",
                icon: Target,
                color: "border-neon-purple/30"
              },
              {
                title: "Recruiter Performance",
                description: "Individual recruiter metrics and team comparisons",
                icon: Users,
                color: "border-neon-cyan/30"
              }
            ].map((report, index) => {
              const Icon = report.icon;
              return (
                <Card key={index} className={`bg-gradient-card border ${report.color} shadow-card hover:shadow-neon-sm transition-all duration-300`}>
                  <CardHeader>
                    <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mb-2">
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full hover:shadow-neon-sm transition-shadow">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;