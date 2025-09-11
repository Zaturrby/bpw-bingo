import { useTranslation } from "react-i18next";
import bpwLogo from "../images/400-400-max.jpg";

export function Header() {
  const { t } = useTranslation();

  return (
    <div className="text-center mt-8 mb-16">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2 w-full">
        <a
          href="https://bondprecairewoonvormen.nl/"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity w-36 md:w-full md:min-w-0"
        >
          <img
            src={bpwLogo}
            alt={t("app.logoAlt")}
            className="w-full h-auto object-contain cursor-pointer"
          />
        </a>
        <div className="text-center md:text-left flex flex-col justify-between md:h-56 md:flex-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-wide font-activist mb-3">
              {t("app.title")}
            </h1>
            <p className="text-black font-bold text-base md:text-lg mb-3">
              {t("app.subtitle")}
            </p>
            <p className="text-black text-sm md:text-base mb-3">
              {t("app.explanation")}
            </p>
          </div>
          <p className="text-black font-bold text-base md:text-lg">
            {t("app.instruction")}
          </p>
        </div>
      </div>
    </div>
  );
}
