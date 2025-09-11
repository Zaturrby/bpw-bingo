import { ContactForm } from "./ContactForm";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ColorSwitcher } from "./ColorSwitcher";
import { PrintFooter } from "./PrintFooter";

interface ContactFormPrintProps {
  colorless?: boolean;
}

export function ContactFormPrint({ colorless = false }: ContactFormPrintProps) {
  // Use empty state for print version
  const emptyCheckedSquares = new Set<number>();
  
  return (
    <div className="min-h-screen bg-white p-4 relative print:m-0 print:p-4 print:min-h-0">
      <div className="w-full max-w-lg md:max-w-2xl mx-auto">
        <div className={`print-contact-form ${colorless ? 'colorless-print' : ''}`}>
          <ContactForm 
            checkedSquares={emptyCheckedSquares}
            isMobile={false}
            printMode={true}
            colorless={colorless}
          />
          
          <PrintFooter />
        </div>
      </div>
      <LanguageSwitcher />
      <ColorSwitcher />
    </div>
  );
}