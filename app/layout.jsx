import "../src/index.css";

export const metadata = {
  title: "Yoga Flashcards",
  description: "Yoga pose study app for English/Sanskrit memorization and breath cues.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
