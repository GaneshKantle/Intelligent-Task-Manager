import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPinIcon, Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MapPinIcon className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-xl text-primary">ProfileMapper</span>
            </div>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <span className={`font-medium py-2 rounded-md text-sm ${location === "/" ? "text-primary" : "text-neutral-600 hover:text-primary"} cursor-pointer`}>
                  Profiles
                </span>
              </Link>
              <Link href="/admin">
                <span className={`font-medium py-2 rounded-md text-sm ${location === "/admin" ? "text-primary" : "text-neutral-600 hover:text-primary"} cursor-pointer`}>
                  Admin
                </span>
              </Link>
            </nav>
          </div>
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <Link href="/">
              <span 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/" 
                    ? "bg-primary text-white" 
                    : "text-neutral-600 hover:bg-neutral-200"
                } cursor-pointer`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profiles
              </span>
            </Link>
            <Link href="/admin">
              <span 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/admin" 
                    ? "bg-primary text-white" 
                    : "text-neutral-600 hover:bg-neutral-200"
                } cursor-pointer`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
