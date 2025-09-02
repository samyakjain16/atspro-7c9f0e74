import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-neon-lg mb-8 mx-auto">
          <span className="text-3xl font-bold text-background">A</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-neon bg-clip-text text-transparent">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist in our neon-powered system.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center space-x-2 bg-gradient-neon hover:shadow-neon-md transition-all duration-300 text-background font-medium px-6 py-3 rounded-lg"
        >
          <span>Return to Dashboard</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
