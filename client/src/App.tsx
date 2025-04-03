import { Switch, Route } from "wouter";
import Profiles from "@/pages/Profiles";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Profiles} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
