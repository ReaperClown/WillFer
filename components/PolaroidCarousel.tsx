"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./PolaroidCarousel.module.css";
import Image from "next/image";

interface PolaroidCarouselProps {
  images: string[];
  intervalMs?: number; // tempo entre troca, padrão 3000ms
}

const ROTATIONS = [-10, -5, 3, 8, -8, 5, -3]; // rotações estilosas

export function PolaroidCarousel({
  images,
  intervalMs = 3000,
}: PolaroidCarouselProps) {
  const [topIndex, setTopIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Troca o índice da imagem do topo
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setTopIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [topIndex, images.length, intervalMs]);

  // Calcula o índice da imagem na pilha com base na posição visual
  // A imagem no topo é a que tem index topIndex
  // As outras aparecem atrás em ordem decrescente (pilha)
  const getStackIndex = (imgIndex: number) => {
    // Diferença circular: quantos passos atrás do topo ela está
    let diff = imgIndex - topIndex;
    if (diff < 0) diff += images.length;
    return diff;
  };

  return (
    <div className={styles.carouselContainer}>
      {images.map((src, i) => {
        const stackPos = getStackIndex(i);
        const rotation = ROTATIONS[stackPos % ROTATIONS.length];
        return (
          <Image
            key={i}
            src={src}
            alt={`Polaroid ${i + 1}`}
            width={300} // largura da imagem
            height={400} // altura da imagem
            className={styles.polaroidImage}
            style={{
              zIndex: images.length - stackPos,
              transform: `translateX(-50%) translateY(${
                stackPos * 5
              }px) rotate(${rotation}deg)`,
              opacity: stackPos === 0 ? 1 : 1,
              animation:
                stackPos === 0
                  ? `${styles.moveToBack} 1s ease forwards`
                  : "none",

              animationDelay:
                stackPos === 0 ? `${intervalMs - 1000}ms` : undefined,
            }}
            draggable={false}
          />
        );
      })}
    </div>
  );
}
