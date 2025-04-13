import React, { KeyboardEvent, useRef, useEffect } from 'react';

interface Step {
  stepId: number;
  stepNumber: number;
  stepText: string;
}

interface InstructionsBoxProps {
  instructions: Step[];
  setInstructions: (ins: Step[]) => void;
}

const InstructionsBox: React.FC<InstructionsBoxProps> = ({ instructions, setInstructions }) => {
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Sort instructions by step number
  const sortedInstructions = [...instructions].sort((a, b) => a.stepNumber - b.stepNumber);

  const handleInputChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    const stepToUpdate = newInstructions.find(step => step.stepId === sortedInstructions[index].stepId);
    if (stepToUpdate) {
      stepToUpdate.stepText = value;
    }
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
      if (sortedInstructions[index].stepText.trim() !== '') {
        // Insert new empty step after the current one
        const newInstructions = [...instructions];
        const maxStepId = Math.max(...instructions.map(step => step.stepId), 0);
        const currentStepNumber = sortedInstructions[index].stepNumber;
        
        // Increment step numbers for all steps after the current one
        newInstructions.forEach(step => {
          if (step.stepNumber > currentStepNumber) {
            step.stepNumber += 1;
          }
        });

        // Insert new step with the next number
        newInstructions.push({
          stepId: maxStepId + 1,
          stepNumber: currentStepNumber + 1,
          stepText: ''
        });

        setInstructions(newInstructions);
        // Focus the new input after state update
        setTimeout(() => {
          const inputs = document.querySelectorAll('.instruction-input');
          const nextIndex = [...sortedInstructions].findIndex(step => step.stepNumber === currentStepNumber) + 1;
          if (inputs.length > nextIndex) {
            (inputs[nextIndex] as HTMLTextAreaElement).focus();
          }
        }, 0);
      }
    } else if (e.key === 'Backspace' && sortedInstructions[index].stepText.trim() === '' && index > 0) {
      e.preventDefault();
      const stepToDelete = sortedInstructions[index];
      const newInstructions = instructions.filter(step => step.stepId !== stepToDelete.stepId);
      
      // Update step numbers for all steps after the deleted one
      newInstructions.forEach(step => {
        if (step.stepNumber > stepToDelete.stepNumber) {
          step.stepNumber -= 1;
        }
      });

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
      {sortedInstructions.map((step, index) => (
        <div key={step.stepId} className="flex items-start mb-2">
          <span className="mr-2 font-semibold mt-2">{step.stepNumber}.)</span>
          <textarea
            ref={el => {
              if (el) {
                textareaRefs.current[index] = el;
              }
            }}
            placeholder="add step..."
            value={step.stepText}
            onChange={(e) => {
              handleInputChange(index, e.target.value);
              adjustTextareaHeight(e.target);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="flex-1 p-2 rounded focus:outline-none bg-transparent instruction-input resize-none overflow-hidden"
            style={{ minHeight: '2.5rem', marginTop: '0', marginBottom: '0' }}
          />
        </div>
      ))}
    </div>
  );
};

export default InstructionsBox; 