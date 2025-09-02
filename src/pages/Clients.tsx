import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Filter, MapPin, Mail, Phone, Briefcase } from "lucide-react";

const Clients = () => {
  const mockClients = [
    {
      id: 1,
      name: "TechCorp Solutions",
      industry: "Software Development",
      status: "active",
      contactPerson: "Sarah Johnson",
      email: "sarah@techcorp.com",
      location: "San Francisco, CA",
      jobsCount: 5,
      createdDate: "2024-01-15"
    },
    {
      id: 2,
      name: "HealthTech Innovations",
      industry: "Healthcare Technology",
      status: "pending",
      contactPerson: "Michael Chen", 
      email: "michael@healthtech.com",
      location: "Boston, MA",
      jobsCount: 2,
      createdDate: "2024-02-20"
    },
    {
      id: 3,
      name: "FinanceForward LLC",
      industry: "Financial Services",
      status: "active",
      contactPerson: "Emily Rodriguez",
      email: "emily@financeforward.com",
      location: "New York, NY",
      jobsCount: 8,
      createdDate: "2024-01-08"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-neon-green/20 text-neon-green';
      case 'pending':
        return 'bg-neon-blue/20 text-neon-blue';
      case 'inactive':
        return 'bg-muted/40 text-muted-foreground';
      default:
        return 'bg-muted/40 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Clients
              </h1>
              <p className="text-muted-foreground">
                Manage your client relationships and track their hiring needs
              </p>
            </div>
            <Button className="bg-gradient-neon hover:shadow-neon-md transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search clients by name, industry, or contact..."
                className="pl-10 bg-muted/20 border-border"
              />
            </div>
            <Button variant="outline" className="hover:shadow-neon-sm transition-shadow">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Client Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Clients", value: "3", color: "text-neon-blue" },
            { label: "Active Clients", value: "2", color: "text-neon-green" },
            { label: "Pending Clients", value: "1", color: "text-neon-blue" },
            { label: "Total Jobs", value: "15", color: "text-neon-purple" }
          ].map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Building2 className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClients.map((client) => (
            <Card key={client.id} className="bg-gradient-card border-border shadow-card hover:shadow-neon-sm transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.industry}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {client.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.contactPerson}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {client.jobsCount} active jobs
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Client since {new Date(client.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 hover:shadow-neon-sm transition-shadow">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="hover:shadow-neon-sm transition-shadow">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="hover:shadow-neon-sm transition-shadow">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Distribution */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Clients by Industry</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { industry: "Technology", count: 1, color: "border-neon-blue/30" },
              { industry: "Healthcare", count: 1, color: "border-neon-purple/30" },
              { industry: "Finance", count: 1, color: "border-neon-cyan/30" },
              { industry: "Other", count: 0, color: "border-muted/30" }
            ].map((item, index) => (
              <Card key={index} className={`bg-gradient-card border ${item.color} shadow-card`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground mb-1">{item.count}</p>
                    <p className="text-sm text-muted-foreground">{item.industry}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;