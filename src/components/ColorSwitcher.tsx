import { useNavigate, useParams, useLocation } from "react-router-dom";

export function ColorSwitcher() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  const toggleColorMode = () => {
    const currentPath = location.pathname;

    if (currentPath.includes("/colorless")) {
      // Remove /colorless from the path
      const newPath = currentPath.replace("/colorless", "");
      navigate(newPath, { replace: true });
    } else {
      // Add /colorless to the path
      const newPath = currentPath + "/colorless";
      navigate(newPath, { replace: true });
    }
  };

  const isColorless = location.pathname.includes("/colorless");

  return (
    <button
      onClick={toggleColorMode}
      className="fixed top-16 right-4 z-10 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200 text-sm print-hidden"
      aria-label="Toggle color mode"
    >
      {isColorless ? "🎨 Color" : "⚫ B&W"}
    </button>
  );
}
