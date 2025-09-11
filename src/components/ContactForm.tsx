import { useState } from "react";
import { useTranslation } from "react-i18next";
import { bingoSquares } from "../data/bingoData";

interface ContactFormProps {
  checkedSquares: Set<number>;
  isMobile: boolean;
  printMode?: boolean;
  colorless?: boolean;
}

export function ContactForm({ checkedSquares, isMobile, printMode = false, colorless = false }: ContactFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const totalScore = isMobile
    ? checkedSquares.size
    : checkedSquares.has(25)
    ? checkedSquares.size - 1
    : checkedSquares.size;

  const getCategoryScore = (category: string) => {
    const categorySquares = bingoSquares.filter(
      (square) => square.category === category
    );
    const checkedCategorySquares = categorySquares.filter((square) =>
      checkedSquares.has(square.id)
    );
    return checkedCategorySquares.length;
  };

  const getHighestCategory = () => {
    const categories = [
      "zekerheid",
      "betaalbaarheid",
      "tijdelijkheid",
      "beschikbaarheid",
    ];
    let maxScore = 0;
    let highestCategory = "";

    categories.forEach((category) => {
      const score = getCategoryScore(category);
      if (score > maxScore) {
        maxScore = score;
        highestCategory = category;
      }
    });

    return { category: highestCategory, score: maxScore };
  };

  const highestCategoryData = getHighestCategory();

  const handleSubmit = () => {
    const subject = encodeURIComponent(
      `${t("contact.emailSubject")} - Score: ${totalScore}/24`
    );
    
    // Get all category scores
    const categoryScores = [
      { key: 'zekerheid', score: getCategoryScore('zekerheid') },
      { key: 'betaalbaarheid', score: getCategoryScore('betaalbaarheid') },
      { key: 'tijdelijkheid', score: getCategoryScore('tijdelijkheid') },
      { key: 'beschikbaarheid', score: getCategoryScore('beschikbaarheid') }
    ];
    
    const categoryScoreText = categoryScores
      .map(cat => `- ${t(`categories.${cat.key}`)}: ${cat.score}/6`)
      .join('\n');
    
    const body = encodeURIComponent(
      `${t("contact.emailGreeting")}\n\n` +
        `${t("contact.emailIntro")}\n\n` +
        `${t("contact.nameLabel")}: ${name || t("contact.notProvided")}\n` +
        `${t("contact.emailLabel")}: ${email}\n\n` +
        `${t("contact.bingoResults")}:\n` +
        `${t("contact.totalScore")}: ${totalScore}/24\n\n` +
        `${t("contact.categoryBreakdown")}:\n${categoryScoreText}\n\n` +
        (highestCategoryData.score > 0 ? 
          `${t("contact.highestConcern")}: ${t(`categories.${highestCategoryData.category}`)} (${highestCategoryData.score}/6)\n\n` : 
          '') +
        (situation.trim() ? 
          `${t("contact.personalStory")}:\n${situation}\n\n` : 
          `${t("contact.noStoryProvided")}\n\n`) +
        `${t("contact.requestInfo")}\n\n` +
        `${t("contact.emailSignature")}${name ? `,\n${name}` : ''}`
    );

    const mailtoLink = `mailto:amsterdam@bondprecairewoonvormen.nl?subject=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className={`mt-8 ${printMode ? 'mb-8' : 'mb-20'} ${colorless ? 'bg-white' : 'bg-purple-50'} border-4 border-black p-4 md:p-6`}>
      <div className={`${printMode ? 'max-w-2xl' : 'max-w-lg md:max-w-2xl'} mx-auto`}>
        <h2 className={`text-lg md:text-xl font-black ${colorless ? 'text-black' : 'text-purple-900'} mb-4 text-left`}>
          {t("contact.title")}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-bold ${colorless ? 'text-black' : 'text-purple-900'} mb-2`}
            >
              {t("contact.nameLabel")}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-black bg-white text-black font-medium"
              placeholder={printMode ? "" : t("contact.namePlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-bold ${colorless ? 'text-black' : 'text-purple-900'} mb-2`}
            >
              {t("contact.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-black bg-white text-black font-medium"
              placeholder={printMode ? "" : t("contact.emailPlaceholder")}
            />
          </div>

          {(checkedSquares.size > 0 || printMode) && (
            <div>
              <label className={`block text-sm font-bold ${colorless ? 'text-black' : 'text-purple-900'} mb-3`}>
                {t("contact.myConcerns")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['zekerheid', 'betaalbaarheid', 'tijdelijkheid', 'beschikbaarheid'].map(category => {
                  const score = getCategoryScore(category);
                  const isHighest = highestCategoryData.category === category && highestCategoryData.score > 0;
                  
                  return (
                    <div key={category} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
                        {!printMode && (
                          <span className={`text-sm font-bold ${score > 0 ? 'text-black' : 'text-white'}`}>
                            {score}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${colorless ? 'text-black' : 'text-purple-800'} ${isHighest ? 'font-bold' : 'font-medium'}`}>
                        {t(`categories.${category}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
              {(checkedSquares.size > 0 || printMode) && (
                <div className={`mt-4 text-sm ${colorless ? 'text-black' : 'text-purple-800'}`}>
                  <strong>
                    {t("contact.totalScore")}: 
                    {printMode ? (
                      <>
                        <span className="inline-block w-8 ml-2 mr-1"></span>
                        /24
                      </>
                    ) : (
                      ` ${totalScore}/24`
                    )}
                  </strong>
                </div>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="situation"
              className={`block text-sm font-bold ${colorless ? 'text-black' : 'text-purple-900'} mb-2`}
            >
              {t("contact.situationLabel")}
            </label>
            <textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={4}
              className="w-full p-3 border-2 border-black bg-white text-black font-medium resize-none"
              placeholder={printMode ? "" : t("contact.situationPlaceholder")}
            />
          </div>

          {!printMode && (
            <button
              onClick={handleSubmit}
              disabled={!isValidEmail(email)}
              className="w-full bg-purple-400 hover:bg-purple-500 disabled:bg-gray-300 disabled:cursor-not-allowed border-4 border-black p-3 font-black text-black uppercase tracking-wide transition-colors"
            >
              {t("contact.submitButton")}
            </button>
          )}
        </div>

        {!printMode && (
          <p className={`text-xs ${colorless ? 'text-black' : 'text-purple-700'} mt-4 text-center`}>
            {t("contact.disclaimer")}
          </p>
        )}
      </div>
    </div>
  );
}
