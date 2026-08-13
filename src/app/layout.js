import './globals.css'

export const metadata = {
  title: '3D Print Cost Calculator',
  description: 'Aplikasi kalkulator biaya cetak 3D Anycubic Kobra X',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-900 text-gray-100 min-h-screen">{children}</body>
    </html>
  )
}
