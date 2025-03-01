import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';

const EditorContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
`;

const EditorArea = styled.div`
  width: 100%;
  min-height: 800px;
  background-color: #1e1e1e;
  border: 1px solid #444;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  overflow: auto;
`;

interface ContentEditableProps {
  fontSize: number;
  lineHeight: number;
}

const ContentEditable = styled.div<ContentEditableProps>`
  width: 100%;
  min-height: 100%;
  outline: none;
  font-family: 'Fira Code', monospace;
  font-size: ${props => props.fontSize}px;
  color: #00ff00;
  white-space: pre-wrap;
  line-height: ${props => props.lineHeight};
  
  &:focus {
    border: none;
    outline: none;
  }
  
  /* Styling for bold text */
  b, strong {
    font-weight: bold;
    color: #00ff99;
  }
  
  /* Styling for underlined text */
  u {
    text-decoration: underline;
    color: #00ffff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #333;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 8px 16px;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ControlLabel = styled.span`
  color: #00ff00;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
`;

const ControlButton = styled.button`
  background-color: #333;
  color: #00ff00;
  border: 1px solid #00ff00;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

const ControlValue = styled.span`
  color: #00ff00;
  font-family: 'Fira Code', monospace;
  min-width: 30px;
  text-align: center;
`;

const ResumeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.5);
  
  const handleBold = () => {
    document.execCommand('bold', false);
  };
  
  const handleUnderline = () => {
    document.execCommand('underline', false);
  };
  
  const handleExportPDF = () => {
    if (editorRef.current) {
      const element = editorRef.current;
      const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Create a clone of the element to modify for PDF export
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.color = 'black';
      clone.style.backgroundColor = 'white';
      
      // Find all bold elements and change their color
      const boldElements = clone.querySelectorAll('b, strong');
      boldElements.forEach(el => {
        (el as HTMLElement).style.color = 'black';
      });
      
      // Find all underlined elements and change their color
      const underlinedElements = clone.querySelectorAll('u');
      underlinedElements.forEach(el => {
        (el as HTMLElement).style.color = 'black';
      });
      
      // Create a temporary div to hold the clone
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(clone);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Generate PDF
      html2pdf().from(clone).set(opt).save().then(() => {
        // Clean up
        document.body.removeChild(tempDiv);
      });
    }
  };
  
  const handleFocus = () => {
    setShowPlaceholder(false);
  };
  
  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerText.trim() === '') {
      setShowPlaceholder(true);
    }
  };
  
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, 24));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 10));
  };
  
  const increaseLineHeight = () => {
    setLineHeight(prev => Math.min(prev + 0.1, 3.0));
  };
  
  const decreaseLineHeight = () => {
    setLineHeight(prev => Math.max(prev - 0.1, 1.0));
  };
  
  return (
    <EditorContainer>
      <ButtonContainer>
        <Button onClick={handleBold}>Bold</Button>
        <Button onClick={handleUnderline}>Underline</Button>
        <Button onClick={handleExportPDF}>Export PDF</Button>
      </ButtonContainer>
      <ControlsContainer>
        <ControlGroup>
          <ControlLabel>Font Size:</ControlLabel>
          <ControlButton onClick={decreaseFontSize}>-</ControlButton>
          <ControlValue>{fontSize}px</ControlValue>
          <ControlButton onClick={increaseFontSize}>+</ControlButton>
        </ControlGroup>
        <ControlGroup>
          <ControlLabel>Line Spacing:</ControlLabel>
          <ControlButton onClick={decreaseLineHeight}>-</ControlButton>
          <ControlValue>{lineHeight.toFixed(1)}</ControlValue>
          <ControlButton onClick={increaseLineHeight}>+</ControlButton>
        </ControlGroup>
      </ControlsContainer>
      <EditorArea>
        <ContentEditable
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={handleFocus}
          onBlur={handleBlur}
          fontSize={fontSize}
          lineHeight={lineHeight}
          dangerouslySetInnerHTML={{
            __html: showPlaceholder
              ? `# JOHN DOE
## Software Engineer

**Contact Information:**
Email: john.doe@example.com
Phone: (123) 456-7890
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe

**Summary:**
Experienced software engineer with a passion for developing innovative solutions. Skilled in full-stack development, cloud architecture, and agile methodologies.

**Skills:**
- Programming Languages: JavaScript, TypeScript, Python, Java
- Frameworks: React, Node.js, Express, Django
- Cloud Services: AWS, Azure, Google Cloud
- Tools: Git, Docker, Kubernetes, CI/CD

**Experience:**
<u>Senior Software Engineer</u> | ABC Tech | Jan 2020 - Present
- Led development of microservices architecture
- Implemented CI/CD pipelines reducing deployment time by 40%
- Mentored junior developers and conducted code reviews

<u>Software Developer</u> | XYZ Solutions | Jun 2017 - Dec 2019
- Developed and maintained web applications using React and Node.js
- Collaborated with UX designers to implement responsive designs
- Optimized database queries improving performance by 30%

**Education:**
<u>Master of Science in Computer Science</u> | University of Technology | 2017
<u>Bachelor of Science in Software Engineering</u> | State University | 2015

**Projects:**
<u>E-commerce Platform</u> - Built a scalable e-commerce solution using MERN stack
<u>Data Visualization Tool</u> - Created interactive dashboards using D3.js and React`
              : ''
          }}
        />
      </EditorArea>
    </EditorContainer>
  );
};

export default ResumeEditor; 