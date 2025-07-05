import React, { useEffect, useState } from "react";

interface TypewriterMessageProps {
  message: string;
  typingSpeed?: number; // ms por letra
  paragraphDelay?: number; // ms entre parágrafos
}

export default function TypewriterMessage({
  message,
  typingSpeed = 50,
  paragraphDelay = 800,
}: TypewriterMessageProps) {
  const paragraphs = message.split(/\n\s*\n/).map((p) => p.trim());
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [paraIndex, setParaIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finishedPara, setFinishedPara] = useState(false);

  useEffect(() => {
    if (paraIndex >= paragraphs.length) return;

    if (charIndex < paragraphs[paraIndex].length) {
      // Digitação continua
      const timeout = setTimeout(() => {
        setCharIndex((i) => i + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (!finishedPara) {
      // Parágrafo terminou, adiciona 1 vez
      setDisplayedParagraphs((prev) => [...prev, paragraphs[paraIndex]]);
      setFinishedPara(true);
    } else {
      // Aguarda delay para próximo parágrafo
      const timeout = setTimeout(() => {
        setParaIndex((i) => i + 1);
        setCharIndex(0);
        setFinishedPara(false);
      }, paragraphDelay);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, paraIndex, finishedPara, paragraphs, typingSpeed, paragraphDelay]);

  return (
  <div className="text-center text-lg md:text-xl italic space-y-4 max-w-4xl mx-auto">
    {displayedParagraphs.map((p, i) => (
      <p key={i}>{p}</p>
    ))}
    {paraIndex < paragraphs.length && !finishedPara && (
      <p>{paragraphs[paraIndex].slice(0, charIndex)}&nbsp;</p>
    )}
  </div>
);
}
