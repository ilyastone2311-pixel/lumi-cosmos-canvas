import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import { ArrowLeft, Smartphone, Tablet, Monitor, Apple, Play, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Downloads = () => {
  const navigate = useNavigate();

  const platforms = [
    {
      icon: Apple,
      name: "iOS App",
      description: "Download for iPhone and iPad",
      badge: "App Store",
      available: true,
      link: "#",
    },
    {
      icon: Play,
      name: "Android App",
      description: "Download for Android devices",
      badge: "Google Play",
      available: true,
      link: "#",
    },
    {
      icon: Monitor,
      name: "Desktop App",
      description: "For Windows and macOS",
      badge: "Coming Soon",
      available: false,
      link: "#",
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Offline Reading",
      description: "Download articles and read anywhere, even without internet connection.",
    },
    {
      icon: Tablet,
      title: "Sync Across Devices",
      description: "Your progress and favorites sync seamlessly across all your devices.",
    },
    {
      icon: Globe,
      title: "Web Access",
      description: "Access Lumi from any browser at lumi.app—no download required.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group btn-hover"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Header */}
          <header className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get Lumi Everywhere
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Read and listen on your phone, tablet, or computer
            </p>
          </header>

          {/* Download Platforms */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <button
                  key={platform.name}
                  className={`glass gradient-border rounded-2xl p-8 text-left animate-fade-in transition-all duration-300 group ${
                    platform.available 
                      ? "hover:scale-[1.02] cursor-pointer" 
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  disabled={!platform.available}
                >
                  <platform.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {platform.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {platform.description}
                  </p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    platform.available 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {platform.badge}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              Why Download?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* QR Code Section */}
          <section className="animate-fade-in" style={{ animationDelay: '700ms' }}>
            <div className="glass gradient-border rounded-2xl p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Scan to Download
              </h2>
              <p className="text-muted-foreground mb-6">
                Point your phone camera at the QR code to get the app
              </p>
              <div className="w-32 h-32 mx-auto bg-foreground rounded-xl flex items-center justify-center">
                <div className="w-28 h-28 bg-background rounded-lg grid grid-cols-4 gap-1 p-2">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Available on iOS and Android
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Downloads;