import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const Card = ({ children }) => {
  return (
    <div className="custom-card shadow-lg p-4 rounded bg-white d-flex flex-column justify-content-between align-items-stretch" style={{ minHeight: "300px" }}>
      {children}
    </div>
  );
};

const CustomRadio = ({ name, value, checked, onChange, label }) => {
  return (
    <div className="custom-radio d-flex align-items-center w-100" onClick={() => onChange(value)}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="me-2"
      />
      <label className="w-100">{label}</label>
    </div>
  );
};

const CardComponent = ({ question, index, handleOptionSelect, answers }) => {
  return (
    <div className="col-md-6 d-flex">
      <Card>
        <h5 className="card-title fw-bold shadow-sm p-2 rounded bg-light text-center">Question {index + 1}: {question.text}</h5>
        <div className="options-container d-flex flex-column gap-2 flex-grow-1">
          {Object.entries(question.options).map(([optionText, score]) => (
            <CustomRadio
              key={optionText}
              name={`question-${question.id}`}
              value={optionText.charAt(0)}
              checked={answers[question.id]?.optionText === optionText.charAt(0)}
              onChange={() => handleOptionSelect(question.id, optionText.charAt(0), score)}
              label={optionText}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const companyId = 1;

  useEffect(() => {
    axios.get("http://localhost:8080/api/questions")
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => console.error("Error fetching questions:", error));
  }, []);

  const handleOptionSelect = (questionId, optionText, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { optionText, score }
    }));
  };

  const handleSubmit = () => {
    const answerData = Object.keys(answers).map(questionId => {
      const question = questions.find(q => q.id === parseInt(questionId));
      return {
        companyId,
        question: {
          id: question.id,
          category: question.category,
          text: question.text,
          options: question.options
        },
        optionText: answers[questionId].optionText,
        score: answers[questionId].score
      };
    });

    axios.post("http://localhost:8080/api/answers/submit", answerData)
      .then(response => {
        alert("Cevaplar başarıyla gönderildi!");
        window.location.reload();
      })
      .catch(error => console.error("Error submitting answers:", error));
  };

  return (
    <div className="container">
      <h2 className="title text-center mb-4">Sorular</h2>
      <div className="row g-4">
        {questions.map((question, index) => (
          <CardComponent 
            key={question.id} 
            question={question} 
            index={index} 
            handleOptionSelect={handleOptionSelect} 
            answers={answers} 
          />
        ))}
      </div>
      <button className="submit-btn mt-4" onClick={handleSubmit}>
        Cevapları Gönder
      </button>
    </div>
  );
}