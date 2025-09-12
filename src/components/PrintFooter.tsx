import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function PrintFooter() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "nl";

  // QR code URLs using a QR code service
  const joinBpwUrl = t("organiseBlock.joinLink");

  const playOnlineUrl = `https://bpw-bingo.netlify.app/${currentLang}`;

  // Using QR Server API for QR code generation
  const joinBpwQR = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
    joinBpwUrl
  )}`;
  const playOnlineQR = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
    playOnlineUrl
  )}`;

  return (
    <div className="mt-8 print:mt-6">
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Join BPW - Left aligned group */}
        <div className="flex items-start gap-3">
          <img
            src={joinBpwQR}
            alt={t("printFooter.joinBpwQR")}
            className="w-20 h-20 flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-black leading-tight mb-1">
              {t("printFooter.joinBpw")}
            </p>
          </div>
        </div>

        {/* Play Online - Center aligned group */}
        <div className="flex items-start justify-center gap-3">
          <img
            src={playOnlineQR}
            alt={t("printFooter.playOnlineQR")}
            className="w-20 h-20 flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-black leading-tight mb-1">
              {t("printFooter.playOnline")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
