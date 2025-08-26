import "./globals.css";

export const metadata = {
  title: "موقع القرآن الكريم",
  description: "موقع متكامل للقرآن الكريم، تلاوات، تفسير، وترجمات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
