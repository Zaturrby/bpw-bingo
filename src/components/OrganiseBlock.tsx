import { useTranslation } from "react-i18next";
import wordLidImage from "../images/583593e2-659c-713e-3712-9947442f1601.png";

export function OrganiseBlock() {
  const { t } = useTranslation();

  return (
    <div className="mt-20 mb-20 bg-purple-50 border-4 border-black p-4 md:p-6">
      <div className="max-w-lg md:max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-black text-purple-900 mb-4">
          {t("organiseBlock.title")}
        </h2>

        <p className="text-gray-700 text-sm md:text-base mb-4 font-medium">
          {t("organiseBlock.intro")}
        </p>
        <div className="space-y-3 text-sm md:text-base text-gray-800">
          <p className="leading-relaxed">{t("organiseBlock.paragraph1")}</p>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 space-y-3">
            <p className="leading-relaxed">{t("organiseBlock.paragraph2")}</p>
            <p className="text-sm md:text-base text-purple-900 font-bold">
              <a
                href={t("organiseBlock.learnMoreLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-700 transition-colors underline"
              >
                {t("organiseBlock.learnMoreText")}
              </a>
            </p>

            <p className="text-purple-900 font-bold text-sm md:text-base">
              <a
                href={t("organiseBlock.joinLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-700 transition-colors underline"
              >
                {t("organiseBlock.joinText")}
              </a>
            </p>
          </div>

          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-1/2 md:w-44 md:h-44">
              <a
                href={t("organiseBlock.joinLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full hover:opacity-80 transition-opacity"
              >
                <img
                  src={wordLidImage}
                  alt={t("app.joinImageAlt")}
                  className="w-full h-full object-contain cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
