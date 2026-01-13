  "use client";

  import { useState, useEffect, useRef } from "react";
  import { 
    Upload, 
    Headphones, 
    BookOpen, 
    Play, 
    Pause, 
    CheckCircle, 
    Sparkles,
    Volume2,
    Zap,
    Shield,
    CloudUpload,
    Download
  } from "lucide-react";

  export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [conversionComplete, setConversionComplete] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const uploadPdf = async () => {
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/extract-text/`,
          {
            method: "POST",
            body: formData,
          }
        );

        clearInterval(progressInterval);
        setUploadProgress(100);

        const data = await res.json();
        setText(data.pdf_content);
        
        // Simulate audio conversion
        setTimeout(() => {
          setIsUploading(false);
          setConversionComplete(true);
          setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Sample audio
        }, 800);
      } catch (error) {
        console.error("Upload failed:", error);
        setIsUploading(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setConversionComplete(false);
        setAudioUrl(null);
        setText("");
      }
    };

    const handlePlayAudio = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const features = [
      {
        icon: <Zap className="h-8 w-8" />,
        title: "Fast Conversion",
        description: "Convert ebooks to audio in minutes with our optimized processing pipeline."
      },
      {
        icon: <Volume2 className="h-8 w-8" />,
        title: "High-Quality Audio",
        description: "Crystal clear audio output with natural-sounding voices and adjustable speeds."
      },
      {
        icon: <Shield className="h-8 w-8" />,
        title: "Secure & Private",
        description: "Your documents are processed securely and deleted after conversion."
      }
    ];

    const steps = [
      { number: "01", title: "Upload Ebook", description: "Upload your PDF, EPUB, or MOBI file" },
      { number: "02", title: "Convert to Audio", description: "AI processes text into natural speech" },
      { number: "03", title: "Download & Listen", description: "Get your audio file and enjoy anywhere" }
    ];

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="px-4 py-6 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Headphones className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EbookToAudio
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition">Features</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition">How it Works</a>
              <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition">Pricing</a>
            </nav>
            <button className="px-6 py-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-full font-medium hover:opacity-90 transition shadow-lg">
              Get Started
            </button>
          </div>
        </header>

        <main className="px-4 py-12 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16 pt-8">
              <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-blue-100 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600 font-medium">Turn Books into Audio Experiences</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto">
                Transform Your <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ebooks</span> into Audio Books
              </h1>
              
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                Convert any ebook format to high-quality audio. Listen to your favorite books while commuting, working out, or relaxing.
              </p>
            </section>

            {/* Main Conversion Section */}
            <section className="mb-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Upload & Conversion Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CloudUpload className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Convert Your Ebook</h2>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 transition bg-slate-50 hover:bg-blue-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-12 w-12 text-slate-400 mb-4" />
                          <p className="mb-2 text-lg text-slate-700">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-slate-500">PDF, EPUB, MOBI up to 50MB</p>
                          {file && (
                            <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full">
                              <p className="text-blue-700 font-medium flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {file.name}
                              </p>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept=".pdf,.epub,.mobi,application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    {isUploading && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Processing...</span>
                          <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div 
                            className="bg-linear-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={uploadPdf}
                      disabled={!file || isUploading}
                      className="w-full py-4 bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
                    >
                      {isUploading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Converting...
                        </>
                      ) : conversionComplete ? (
                        <>
                          <CheckCircle className="h-6 w-6 mr-3" />
                          Conversion Complete!
                        </>
                      ) : (
                        <>
                          <Headphones className="h-6 w-6 mr-3" />
                          Convert to Audio
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center text-slate-500 text-sm">
                    <p>Your file is securely processed and never stored on our servers</p>
                  </div>
                </div>

                {/* Preview & Audio Player */}
                <div className="space-y-8">
                  {/* Audio Player */}
                  {conversionComplete && audioUrl && (
                    <div className="bg-linear-to-br from-blue-500 to-indigo-500 font-mono rounded-2xl p-8 text-white shadow-xl h-64 w-full overflow-auto scroll-auto">
                      {text}
                    </div>
                  )}

                  {/* Steps */}
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">How It Works</h3>
                    <div className="space-y-6">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="shrink-0">
                            <div className="h-12 w-12 bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                              <span className="text-blue-700 font-bold">{step.number}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{step.title}</h4>
                            <p className="text-slate-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose EbookToAudio</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow">
                    <div className="p-4 bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl w-fit mb-6">
                      <div className="text-blue-600">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-8 md:px-8 lg:px-16 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="p-2 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EbookToAudio
                </span>
              </div>
              <div className="text-slate-600 text-center md:text-right">
                <p>© {new Date().getFullYear()} EbookToAudio. All rights reserved.</p>
                <p className="text-sm mt-1">Turning books into audio experiences</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }