import "../src/index.css";

export const metadata = {
  title: "My Sadhana",
  description: "Premium yoga study app for Sanskrit memorization, breath cues, and focused practice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
