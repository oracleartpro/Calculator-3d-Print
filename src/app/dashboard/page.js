'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Calculator, Zap, Layer, DollarSign, Sparkles } from 'lucide-react';

const TARIF_LISTRIK = {
  '900 VA (RTM)': 1352, '1.300 VA': 1444.7, '2.200 VA': 1444.7, '3.500 VA - 5.500 VA': 1699.53
};

export default function Dashboard() {
  const router = useRouter();
  const [hargaFilamen, setHargaFilamen] = useState(200000);
  const [dayaRumah, setDayaRumah] = useState('2.200 VA');
  const [dayaPrinter, setDayaPrinter] = useState(130);
  const [namaProject, setNamaProject] = useState('');
  const [beratFilamen, setBeratFilamen] = useState('');
  const [waktuCetak, setWaktuCetak] = useState('');
  const [biayaDesain, setBiayaDesain] = useState(0);
  const [biayaFinishing, setBiayaFinishing] = useState(0);
  const [marginProfit, setMarginProfit] = useState(50);
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) router.push('/login');
  }, [router]);

  const hitungBiaya = (e) => {
    e.preventDefault();
    const costFilamen = parseFloat(beratFilamen) * (parseFloat(hargaFilamen) / 1000);
    const costListrik = ((parseFloat(waktuCetak) * parseFloat(dayaPrinter)) / 1000) * TARIF_LISTRIK[dayaRumah];
    const costGagal = (costFilamen + costListrik) * 0.1;
    const totalCogs = costFilamen + costListrik + parseFloat(biayaDesain) + parseFloat(biayaFinishing) + costGagal;
    setHasil({ filamen: costFilamen, listrik: costListrik, gagal: costGagal, cogs: totalCogs, jual: totalCogs * (1 + (parseFloat(marginProfit) / 100)) });
  };

  const formatRupiah = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(a);

  return (
    <div className="min-h-screen bg-gray-950 text-sm">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400 flex items-center gap-2"><Calculator size={24} /> 3D Print Cost</h1>
        <button onClick={() => { localStorage.removeItem('isLoggedIn'); router.push('/login'); }} className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-400 px-4 py-2 rounded-lg transition text-xs">
          <LogOut size={16} /> Keluar
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-base font-semibold mb-4 text-gray-300 flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Konfigurasi Alat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Harga Filamen (/kg)</label>
                <input type="number" value={hargaFilamen} onChange={(e) => setHargaFilamen(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Daya Rumah</label>
                <select value={dayaRumah} onChange={(e) => setDayaRumah(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500">
                  {Object.keys(TARIF_LISTRIK).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Daya Printer (Watt)</label>
                <input type="number" value={dayaPrinter} onChange={(e) => setDayaPrinter(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          </div>

          <form onSubmit={hitungBiaya} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-semibold text-gray-300 flex items-center gap-2"><Layer size={18} className="text-blue-400" /> Data Projek Cetak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nama Project</label>
                <input type="text" placeholder="Contoh: Dragon" value={namaProject} onChange={(e) => setNamaProject(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Berat (Gram)</label>
                <input type="number" step="0.01" value={beratFilamen} onChange={(e) => setBeratFilamen(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Waktu Cetak (Jam Desimal)</label>
                <input type="number" step="0.01" value={waktuCetak} onChange={(e) => setWaktuCetak(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Margin Untung (%)</label>
                <input type="number" value={marginProfit} onChange={(e) => setMarginProfit(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Jasa Desain (Rp)</label>
                <input type="number" value={biayaDesain} onChange={(e) => setBiayaDesain(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Biaya Finishing (Rp)</label>
                <input type="number" value={biayaFinishing} onChange={(e) => setBiayaFinishing(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-lg font-medium transition shadow-lg">Kalkulasikan Biaya</button>
          </form>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-fit min-h-[350px]">
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-300 flex items-center gap-2"><DollarSign size={18} className="text-green-400" /> Rincian Biaya</h3>
            {!hasil ? (
              <div className="text-center text-gray-500 py-12">Masukkan data untuk kalkulasi.</div>
            ) : (
              <div className="space-y-3">
                <div className="p-2 bg-gray-950 rounded-lg border border-gray-800"><span className="text-xs text-gray-400 block">Project</span><span className="font-semibold text-white">{namaProject || '-'}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5"><span className="text-gray-400">Filamen</span><span className="text-white font-medium">{formatRupiah(hasil.filamen)}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5"><span className="text-gray-400">Listrik</span><span className="text-white font-medium">{formatRupiah(hasil.listrik)}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5"><span className="text-gray-400">Jasa Desain</span><span className="text-white font-medium">{formatRupiah(biayaDesain)}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5"><span className="text-gray-400">Finishing</span><span className="text-white font-medium">{formatRupiah(biayaFinishing)}</span></div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5"><span className="text-gray-400">Risiko Gagal (10%)</span><span className="text-white font-medium">{formatRupiah(hasil.gagal)}</span></div>
                <div className="flex justify-between pt-1 text-yellow-400 font-medium"><span>Total COGS</span><span>{formatRupiah(hasil.cogs)}</span></div>
              </div>
            )}
          </div>
          {hasil && (
            <div className="mt-6 p-4 bg-purple-950/40 rounded-xl border border-purple-800/50">
              <span className="text-xs text-purple-300 block mb-1 font-medium flex items-center gap-1"><Sparkles size={12}/> Jual ({marginProfit}%)</span>
              <span className="text-2xl font-bold text-purple-400">{formatRupiah(hasil.jual)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
