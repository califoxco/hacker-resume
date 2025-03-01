import React from 'react';
import styled from 'styled-components';
import ResumeEditor from './components/ResumeEditor';


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  opacity: 0.8;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <Title>Hacker Resume Creator</Title>
        <Subtitle>Create your resume in a hacker-style editor and export to PDF</Subtitle>
      </Header>
      <ResumeEditor />
    </AppContainer>
  );
};

export default App; 