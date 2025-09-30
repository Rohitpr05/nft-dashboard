import './globals.css'

export const metadata = {
  title: 'Mood NFT Dashboard',
  description: 'Dynamic NFT Dashboard with mood-based tokens',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}