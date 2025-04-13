import React, { KeyboardEvent, useRef, useEffect } from 'react';

interface InstructionsBoxProps {
  instructions: string[];
  setInstructions: (ins: string[]) => void;
}

const InstructionsBox: React.FC<InstructionsBoxProps> = ({ instructions, setInstructions }) => {
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    textareaRefs.current.forEach(textarea => {
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    });
  }, [instructions]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (instructions[index].trim() !== '') {
        setInstructions([...instructions, '']);
        // Focus the new input after state update
        setTimeout(() => {
          const inputs = document.querySelectorAll('.instruction-input');
          if (inputs.length > 0) {
            (inputs[inputs.length - 1] as HTMLTextAreaElement).focus();
          }
        }, 0);
      }
    } else if (e.key === 'Backspace' && instructions[index].trim() === '' && index > 0) {
      e.preventDefault();
      const newInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(newInstructions);
      // Focus the previous input after state update
      setTimeout(() => {
        const inputs = document.querySelectorAll('.instruction-input');
        if (inputs.length > 0) {
          (inputs[index - 1] as HTMLTextAreaElement).focus();
        }
      }, 0);
    }
  };

  return (
    <div className="relative p-4 mt-6 w-1/2">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      {instructions.map((step, index) => (
        <div key={index} className="flex items-start mb-2">
          <span className="mr-2 font-semibold mt-2">{index + 1}.)</span>
          <textarea
            ref={el => {
              if (el) {
                textareaRefs.current[index] = el;
              }
            }}
            placeholder="add step..."
            value={step}
            onChange={(e) => {
              handleInputChange(index, e.target.value);
              adjustTextareaHeight(e.target);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="flex-1 p-2 rounded focus:outline-none bg-transparent instruction-input resize-none overflow-hidden"
            style={{ minHeight: '2.5rem' }}
          />
        </div>
      ))}
    </div>
  );
};

export default InstructionsBox; 