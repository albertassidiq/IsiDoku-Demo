import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Waypoints, FileStack, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import changelogData from "./data/changelog.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xl overflow-hidden">
              <Image src="/logo-isidoku.png" alt="IsiDoku Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">IsiDoku</span>
          </div>
          <div className="flex gap-4">
            {/* <Link href="/dokumen-generator">
              <Button className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-sm">
                Masuk App
              </Button>
            </Link> */}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6 border-b-2 border-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block bg-red-500 text-white px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-wider rounded-full mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 border-2 border-black">
              DEMO MODE
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Generator SOP <br />
              <span className="bg-yellow-300 px-2 box-decoration-clone border-2 border-black text-black inline-block transform -rotate-1">Otomatis dengan AI.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Ubah ide bisnis Anda menjadi diagram swimlane profesional dalam hitungan detik. Chat dengan AI, edit kapan saja, dan ekspor ke PDF.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/sop-builder">
                <Button className="h-14 px-8 text-lg font-black border-2 border-black bg-black text-white rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center gap-3">
                  BUAT SOP BARU <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link href="/my-sops">
                <Button variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-black bg-white text-black rounded-sm hover:bg-gray-50 flex items-center gap-3">
                  Lihat Projek Saya
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="border-2 border-black p-8 rounded-sm bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-yellow-300 border-2 border-black flex items-center justify-center mb-6 rounded-sm">
                <Bot className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Generator & Edit</h3>
              <p className="text-gray-600 leading-relaxed">
                Ceritakan prosesnya, AI akan menggambar. Anda bisa mengedit, memindahkan, dan menyimpan revisi SOP kapan saja.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-black p-8 rounded-sm bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-yellow-300 border-2 border-black flex items-center justify-center mb-6 rounded-sm">
                <Waypoints className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Routing</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritma A* memastikan panah tidak bertabrakan. Mendukung berbagai bentuk shape standar flowchart.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-black p-8 rounded-sm bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-14 h-14 bg-yellow-300 border-2 border-black flex items-center justify-center mb-6 rounded-sm">
                <FileStack className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Manajemen Dokumen</h3>
              <p className="text-gray-600 leading-relaxed">
                Simpan progress ke database cloud (Supabase), ekspor PDF, dan lampirkan file PDF referensi ke dalam SOP.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack / Stats */}
        <section className="border-y-2 border-black bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">10x</div>
              <div className="font-mono text-gray-400">Lebih Cepat</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">AI</div>
              <div className="font-mono text-gray-400">Powered Core</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">PDF</div>
              <div className="font-mono text-gray-400">Export Ready</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">24/7</div>
              <div className="font-mono text-gray-400">Siap Pakai</div>
            </div>
          </div>
        </section>

        {/* Changelog Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-center flex items-center justify-center gap-3">
            <Zap className="w-8 h-8" /> Update Terbaru
          </h2>

          <div className="space-y-6">
            {changelogData.map((update: any, idx: number) => (
              <div key={idx} className="border-2 border-black bg-white rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                {/* Header */}
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-black">
                  <span className="font-bold text-lg">{update.title}</span>
                  <span className="font-mono text-sm text-gray-300">{update.date}</span>
                </div>

                {/* Items */}
                <div className="p-6">
                  <ul className="space-y-3">
                    {update.items.map((item: string, itemIdx: number) => (
                      <li key={itemIdx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-yellow-300 border-2 border-black flex items-center justify-center rounded-sm flex-shrink-0 mt-0.5">
                          <span className="text-black font-bold text-sm">✓</span>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Small */}
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">Ingin fitur lain? Sampaikan ide kamu!</p>
            <Link href="https://wa.me/6281370501796" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="font-bold border-2 border-black bg-white text-black rounded-sm hover:bg-gray-50">
                Request Fitur
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Tingkatkan Standar Operasional Anda
            </h2>
            <p className="text-xl text-gray-600">
              Berhenti melakukan copy-paste manual. Biarkan IsiDoku AI menangani pekerjaan membosankan Anda.
            </p>
            <Link href="/sop-builder">
              <Button className="h-16 px-10 text-xl font-black border-2 border-black bg-yellow-300 text-black hover:bg-yellow-400 rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                COBA SEKARANG
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-black py-10 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xl overflow-hidden">
              <Image src="/logo-isidoku.png" alt="IsiDoku Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="font-bold">IsiDoku</span>
          </div>
          <div className="text-sm text-gray-500 font-mono flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>© {new Date().getFullYear()} IsiDoku. All rights reserved.</span>
            <span>Made with ❤️ by <a href="https://albertas.my.id" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors">Albert Assidiq</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
