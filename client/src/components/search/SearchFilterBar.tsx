import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, RefreshCw } from "lucide-react";

interface SearchFilterBarProps {
  onSearch: (query: string) => void;
  onFilterByLocation: (location: string) => void;
  onReset: () => void;
  locations: string[];
}

const SearchFilterBar = ({ onSearch, onFilterByLocation, onReset, locations }: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);
  
  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    onFilterByLocation(value === "all" ? "" : value);
  };
  
  const handleReset = () => {
    setSearchQuery("");
    setLocationFilter("all");
    onReset();
  };

  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search profiles by name, location, etc."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Select value={locationFilter} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="default"
              className="inline-flex items-center"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilterBar;
