'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Calculator, Zap, Layer, DollarSign, Sparkles } from 'lucide-react';

const TARIF_LISTRIK = {
  '900 VA (RTM)': 1352,
  '1.300 VA': 1444.7,
  '2.200 VA': 1444.7,
  '3.500 VA - 5.500 VA': 1699.53
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
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (!loginStatus) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const hitungBiaya = (e) => {
    e.preventDefault();
    const tarifKwh = TARIF_LISTRIK[dayaRumah];
    
    const costFilamen = (parseFloat(beratFilamen) * (parseFloat(hargaFilamen) / 1000));
    const costListrik = ((parseFloat(waktuCetak) * parseFloat(dayaPrinter)) / 1000) * tarifKwh;
    const costGagal = (costFilamen + costListrik) * 0.1;
    
    const totalCogs = costFilamen + costListrik + parseFloat(biayaDesain) + parseFloat(biayaFinishing) + costGagal;
    const hargaJual = totalCogs * (1 + (parseFloat(marginProfit) / 100));

    setHasil({
      filamen: costFilamen,
      listrik: costListrik,
      gagal: costGagal,
      cogs: totalCogs,
      jual: hargaJual
    });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <Calculator size={24} /> 3D Print Cost Dashboard
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-400 px-4 py-2 rounded-lg transition text-sm">
          <LogOut size={16} /> Keluar
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2"><Zap size={18} className="text-yellow-400"/> Konfigurasi Tarif & Alat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Harga Filamen (/kg)</label>
                <input type="number" value={hargaFilamen} onChange={(e) => setHargaFilamen(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Daya Rumah (Tarif Dropdown)</label>
                <select value={dayaRumah} onChange={(e) => setDayaRumah(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500">
                  {Object.keys(TARIF_LISTRIK).map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Estimasi Daya Printer (Watt)</label>
                <input type="number" value={dayaPrinter} onChange={(e) => setDayaPrinter(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          </div>

          <form onSubmit={hitungBiaya} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2"><Layer size={18} className="text-blue-400" /> Input Data Projek Cetak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nama Project</label>
                <input type="text" placeholder="Contoh: Articulated Dragon" value={namaProject} onChange={(e) => setNamaProject(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Berat Slicer (Gram)</label>
                <input type="number" step="0.01" placeholder="Contoh: 153" value={beratFilamen} onChange={(e) => setBeratFilamen(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Waktu Cetak Slicer (Jam Desimal)</label>
                <input type="number" step="0.01" placeholder="Contoh: 10.47" value={waktuCetak} onChange={(e) => setWaktuCetak(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Margin Keuntungan (%)</label>
                <input type="number" value={marginProfit} onChange={(e) => setMarginProfit(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Biaya Jasa Desain (Rp)</label>
                <input type="number" value={biayaDesain} onChange={(e) => setBiayaDesain(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Biaya Finishing & Cat (Rp)</label>
                <input type="number" value={biayaFinishing} onChange={(e) => setBiayaFinishing(e.target.value)} className="w-full bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition shadow-lg">
              Kalkulasikan Biaya Sekarang
            </button>
          </form>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-fit">
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-300 flex items-center gap-2"><DollarSign size={18} className="text-green-400" /> Ringkasan Biaya Klien</h3>
            {!hasil ? (
              <div className="text-center text-gray-500 py-12">Masukan data projek di sebelah kiri untuk melihat rincian kalkulasi harga jual.</div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-400 block mb-0.5">Project</span>
                  <span className="font-semibold text-white">{namaProject || 'Tanpa Nama'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Biaya Bahan Filamen</span>
                  <span className="text-white font-medium">{formatRupiah(hasil.filamen)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Biaya Konsumsi Setrum</span>
                  <span className="text-white font-medium">{formatRupiah(hasil.listrik)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Jasa Desain / Modeling</span>
                  <span className="text-white font-medium">{formatRupiah(biayaDesain)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Bahan Finishing</span>
                  <span className="text-white font-medium">{formatRupiah(biayaFinishing)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-400">Proteksi Gagal Cetak (10%)</span>
                  <span className="text-white font-medium">{formatRupiah(hasil.gagal)}</span>
                </div>
                <div className="flex justify-between pt-2 text-yellow-400 font-medium">
                  <span>Total Harga Pokok (COGS)</span>
                  <span>{formatRupiah(hasil.cogs)}</span>
                </div>
              </div>
            )}
          </div>
          
{hasil && ( Rekomendasi Harga Jual ({marginProfit}%){formatRupiah(hasil.jual)}


)}

);

}