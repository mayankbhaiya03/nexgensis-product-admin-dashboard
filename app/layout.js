import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Product admin dashboard for Nexgensis Technologies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
