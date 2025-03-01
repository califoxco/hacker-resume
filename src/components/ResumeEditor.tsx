import React, { useState, useRef } from "react";
import styled from "styled-components";
import html2pdf from "html2pdf.js";

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
  font-family: "Fira Code", monospace;
  font-size: ${(props) => props.fontSize}px;
  color: #00ff00;
  white-space: pre-wrap;
  line-height: ${(props) => props.lineHeight};

  &:focus {
    border: none;
    outline: none;
  }

  /* Styling for bold text */
  b,
  strong {
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
  font-family: "Fira Code", monospace;
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
  font-family: "Fira Code", monospace;
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
  font-family: "Fira Code", monospace;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

const ControlValue = styled.span`
  color: #00ff00;
  font-family: "Fira Code", monospace;
  min-width: 30px;
  text-align: center;
`;

const ResumeEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [lineHeight, setLineHeight] = useState(1.4);

  const handleBold = () => {
    document.execCommand("bold", false);
  };

  const handleUnderline = () => {
    document.execCommand("underline", false);
  };

  const handleExportPDF = () => {
    if (editorRef.current) {
      const element = editorRef.current;
      const opt = {
        margin: 10,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Create a clone of the element to modify for PDF export
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.color = "black";
      clone.style.backgroundColor = "white";

      // Find all bold elements and change their color
      const boldElements = clone.querySelectorAll("b, strong");
      boldElements.forEach((el) => {
        (el as HTMLElement).style.color = "black";
      });

      // Find all underlined elements and change their color
      const underlinedElements = clone.querySelectorAll("u");
      underlinedElements.forEach((el) => {
        (el as HTMLElement).style.color = "black";
      });

      // Create a temporary div to hold the clone
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(clone);
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Generate PDF
      html2pdf()
        .from(clone)
        .set(opt)
        .save()
        .then(() => {
          // Clean up
          document.body.removeChild(tempDiv);
        });
    }
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    if (editorRef.current && editorRef.current.innerText.trim() === "") {
      setShowPlaceholder(true);
    }
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 10));
  };

  const increaseLineHeight = () => {
    setLineHeight((prev) => Math.min(prev + 0.1, 3.0));
  };

  const decreaseLineHeight = () => {
    setLineHeight((prev) => Math.max(prev - 0.1, 1.0));
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
              ? `# JIAMING ALEX YANG
## Full Stack Software Engineer

**Contact Information:**
---------------------------------------------------------------------------------------------------
Email: alex760723501@gmail.com
Phone: 415-937-3083
Location: San Francisco, California 94132

**Summary:**
---------------------------------------------------------------------------------------------------
Senior Full Stack Engineer with 3+ years of experience architecting AI-driven solutions and scalable applications. Specialized in building enterprise-grade systems leveraging React, microservices, micro-frontend, and cloud technologies. Proven track record of delivering technical solutions that drive measurable business outcomes at Walmart Global Tech.

**Skills:**
---------------------------------------------------------------------------------------------------
- **Frontend:** JavaScript, TypeScript, React.js, Redux, CSS
- **Backend:** Node.js, Express.js, Java, Spring, Django, Python
- **Data & Infrastructure:** Kafka, MongoDB, Airflow
- **Cloud & DevOps:** AWS, GCP, Azure, Docker, Kubernetes, CI/CD (Jenkins)

**Experience:**
---------------------------------------------------------------------------------------------------
### Software Engineer III | Walmart Global Tech | Jun 2022 - Present

- Led the architecture and development of the Media Planning Engine, an AI-assisted advertising automation platform that optimizes campaign creation and execution, reducing manual effort by 40% and projecting 11,000+ annual hours saved
- Partnered with data science teams to integrate machine learning-driven budget allocation models, leveraging historical ad performance data to optimize multi-channel ad spending for enterprise clients
- Designed and built a scalable micro-frontend React application with Excel-like filtering and pivoting capabilities, improving campaign data visualization and analysis efficiency by 60%
- Developed Falcon Component Library, a reusable suite of React components, streamlining frontend development and ensuring UI consistency across advertising tools used by 200+ internal users
- Engineered an intelligent cross-system synchronization solution for ad order records, utilizing Kafka and Airflow DAGs to ensure seamless data consistency across ad platforms like Google Ads, TikTok Ads, Walmart Artemis, and The Trade Desk
- Architected a scalable, cloud-native backend infrastructure using microservices and containerization on Walmart's WCMP (akin to AWS), handling 10,000+ concurrent users with 99.99% uptime and response times under 200ms
- Led staff-level engineers a

### Software Engineer - Platform | OFFER1 | Jan 2021 - May 2022

- Led MVP development for Offer1's property listing platform using React.js, Spring Boot, Hibernate, Camunda, MongoDB and AWS, resulting in 5 successful property sales and 10.83% average price increase post-beta launch
- Designed and implemented a robust NoSQL database schema in MongoDB, improving query performance by 50% and enabling efficient scaling of property listings to over 80,000 entries
- Engineered email notification system using Camunda adapters, saving 800 hours annually in manual processes

**Education:**
---------------------------------------------------------------------------------------------------
### Bachelor of Science in Computer Science and Mathematics | University of California, San Diego | Jun 2021
*Relevant Coursework: Data Structures & Algorithms, Machine Learning, Database Systems*`
              : "",
          }}
        />
      </EditorArea>
    </EditorContainer>
  );
};

export default ResumeEditor;
