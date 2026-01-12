import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
            {/* Navigation */}
            <nav className="border-b-2 border-black bg-white py-4 px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-black bg-yellow-300">
                        IS
                    </div>
                    <span className="font-bold text-xl tracking-tight">IsiDoku</span>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="w-full max-w-lg text-center space-y-8">

                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-red-500 border-4 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <ShieldAlert className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight uppercase">
                            Akses Ditolak
                        </h1>
                        <div className="bg-black text-white p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rounded-sm">
                            <p className="font-mono text-lg font-bold">
                                "Anda belum diapprove sebagai Pegawai 2172"
                            </p>
                        </div>
                        <p className="text-gray-600 font-medium">
                            Silakan hubungi administrator sistem untuk meminta akses ke aplikasi ini.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link href="/">
                            <Button className="h-12 px-8 font-bold border-2 border-black bg-white text-black rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-50 flex items-center gap-2 mx-auto">
                                <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-black py-6 text-center font-mono text-xs text-gray-500 bg-white">
                © {new Date().getFullYear()} IsiDoku. Made with ❤️ by <a href="https://albertas.my.id" target="_blank" rel="noopener noreferrer" className="hover:underline text-black">Albert Assidiq</a>
            </footer>
        </div>
    );
}
