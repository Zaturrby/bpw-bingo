import { ContactForm } from "./ContactForm";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ColorSwitcher } from "./ColorSwitcher";

interface ContactFormPrintProps {
  colorless?: boolean;
}

export function ContactFormPrint({ colorless = false }: ContactFormPrintProps) {
  // Use empty state for print version
  const emptyCheckedSquares = new Set<number>();
  
  return (
    <div className="print:m-0 print:p-4 max-w-4xl mx-auto bg-white min-h-screen print:min-h-0 mb-8">
      <div className={`print-contact-form ${colorless ? 'colorless-print' : ''}`}>
        <ContactForm 
          checkedSquares={emptyCheckedSquares}
          isMobile={false}
          printMode={true}
          colorless={colorless}
        />
      </div>
      <LanguageSwitcher />
      <ColorSwitcher />
    </div>
  );
}