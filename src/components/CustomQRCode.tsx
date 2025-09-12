import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import bpwFist from "../images/bpw-fist-only.png";

interface CustomQRCodeProps {
  url: string;
  size?: number;
  alt?: string;
  className?: string;
}

export function CustomQRCode({
  url,
  size = 80,
  alt = "",
  className = "",
}: CustomQRCodeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url || !ref.current) return;

    try {
      const qrCode = new QRCodeStyling({
        width: 400,
        height: 400,
        type: "canvas",
        data: url,
        image: bpwFist,
        dotsOptions: {
          color: "#000000",
          type: "square",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 16,
          imageSize: 0.6,
        },
        cornersSquareOptions: {
          color: "#000000",
          type: "square",
        },
        cornersDotOptions: {
          color: "#000000",
          type: "square",
        },
        qrOptions: {
          errorCorrectionLevel: "H",
          typeNumber: 6,
        },
      });

      if (ref.current) {
        ref.current.innerHTML = "";

        try {
          qrCode.append(ref.current);

          // Scale down the canvas to display at the requested size while maintaining quality
          setTimeout(() => {
            if (ref.current) {
              const canvas = ref.current.querySelector("canvas");
              if (canvas) {
                canvas.style.width = `${size}px`;
                canvas.style.height = `${size}px`;
              }
            }
          }, 0);
        } catch (appendError) {
          console.warn("QR Code append failed:", appendError);
        }
      }
    } catch (error) {
      console.warn("QR Code initialization failed:", error);
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [url, size]);

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label={alt}
      style={{ width: size, height: size }}
    />
  );
}
