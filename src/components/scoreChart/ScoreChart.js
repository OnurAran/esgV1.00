import React, { useEffect, useState } from "react";
import "./ScoreChart.css"; // CSS dosyası

const ScoreChart = ({ companyId }) => {
    const [score, setScore] = useState(null);
    const [previousScore, setPreviousScore] = useState(2.9); // Önceki skor (manuel)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/scores/calculate/${companyId}`);
                const data = await response.json();

                if (data.scores) {
                    const scoresArray = Object.values(data.scores);
                    const avgScore = scoresArray.reduce((acc, val) => acc + val, 0) / scoresArray.length;
                    setScore(avgScore.toFixed(1));
                }
            } catch (error) {
                console.error("API'den skor alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
    }, [companyId]);

    return (
        <div className="score-container">
            <div className="header">
                <h2 className="score-title">SMI Score</h2>
                <div className="menu-icon">☰</div>
            </div>


            {/* Line eklemek için yeni bir div */}
            <div className="score-line"></div>


            <div className="score-wrapper">
                {/* Skor Etiketleri */}
                <div className="score-labels">
                    <div className="label">
                        <span className="label-text">5.0</span>
                        <div className="line"></div>
                    </div>
                    <div className="label">
                        <span className="label-text">4.0</span>
                        <div className="line"></div>
                    </div>
                    <div className="label">
                        <span className="label-text">3.0</span>
                        <div className="line"></div>
                    </div>
                    <div className="label">
                        <span className="label-text">2.0</span>
                        <div className="line"></div>
                    </div>
                    <div className="label">
                        <span className="label-text">1.0</span>
                        <div className="line"></div>
                    </div>
                    <span className="label-description">SMI Skor ortalamanız</span>
                </div>

                <div className="score-chart">
                    {/* Arka plan çubuğu */}
                    <div className="score-background"></div>

                    {/* Mavi doluluk çubuğu */}
                    <div
                        className="score-fill"
                        style={{ height: `${Math.min((score / 5) * 100, 100)}%` }}
                    ></div>

                    {/* Skor Balonu */}
                    {score && (
                        <div
                            className="score-bubble"
                            style={{ bottom: `${Math.min((score / 5) * 100, 100)}%` }}
                        >
                            {score}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScoreChart;
