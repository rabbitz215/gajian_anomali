import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <footer className="py-4 text-center">
          <p className="text-sm text-gray-600">
            Made by <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">RabbitZ</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
