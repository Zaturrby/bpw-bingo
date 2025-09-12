import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CustomQRCode } from "./CustomQRCode";

export function PrintFooter() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "nl";

  // URLs for QR codes
  const joinBpwUrl = t("organiseBlock.joinLink");
  const playOnlineUrl = `https://bpw-bingo.netlify.app/${currentLang}`;

  return (
    <div className="mt-8 print:mt-6">
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Join BPW - Left aligned group */}
        <div className="flex items-start gap-3">
          <CustomQRCode
            url={joinBpwUrl}
            size={100}
            alt={t("printFooter.joinBpwQR")}
            className="flex-shrink-0"
          />
          <div className="text-left">
            <p className="text-xs font-bold text-black leading-tight mb-1">
              {t("printFooter.joinBpw")}
            </p>
          </div>
        </div>

        {/* Play Online - Center aligned group */}
        <div className="flex items-start justify-center gap-3">
          <CustomQRCode
            url={playOnlineUrl}
            size={100}
            alt={t("printFooter.playOnlineQR")}
            className="flex-shrink-0"
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
