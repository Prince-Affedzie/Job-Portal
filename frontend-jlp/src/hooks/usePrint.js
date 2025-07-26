import { useRef, useEffect } from 'react';

const usePrint = () => {
  const printableRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printableContent = printableRef.current?.innerHTML || document.body.innerHTML;
    
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            @page { size: auto; margin: 10mm; }
            @media print {
              .no-print { display: none !important; }
              a { text-decoration: none; color: inherit; }
              img { max-width: 100% !important; height: auto !important; }
              .break-after { page-break-after: always; }
              .break-before { page-break-before: always; }
              .avoid-break { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printableContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Add event listener for Ctrl+P / Cmd+P
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { handlePrint, printableRef };
};

export default usePrint;