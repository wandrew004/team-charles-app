import React, { KeyboardEvent } from 'react';

interface InstructionsBoxProps {
  instructions: string[];
  setInstructions: (ins: string[]) => void;
}

const InstructionsBox: React.FC<InstructionsBoxProps> = ({ instructions, setInstructions }) => {
  const handleInputChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (instructions[index].trim() !== '') {
        setInstructions([...instructions, '']);
        // Focus the new input after state update
        setTimeout(() => {
          const inputs = document.querySelectorAll('.instruction-input');
          if (inputs.length > 0) {
            (inputs[inputs.length - 1] as HTMLInputElement).focus();
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
          (inputs[index - 1] as HTMLInputElement).focus();
        }
      }, 0);
    }
  };

  return (
    <div className="relative p-4 mt-6 w-1/2">
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      {instructions.map((step, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="mr-2 font-semibold">{index + 1}.)</span>
          <input
            type="text"
            placeholder="add step..."
            value={step}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="flex-1 p-2 rounded focus:outline-none bg-transparent instruction-input"
          />
        </div>
      ))}
    </div>
  );
};

export default InstructionsBox; 