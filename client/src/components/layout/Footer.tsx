import { MapPinIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold text-lg text-primary">ProfileMapper</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-neutral-600 text-sm">&copy; {new Date().getFullYear()} ProfileMapper. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
