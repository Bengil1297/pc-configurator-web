import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    // Systeminformationen abrufen
    useEffect(() => {
        axios.get('http://localhost:4000/systeminfo')
            .then(response => {
                setSystemInfo(response.data);
            })
            .catch(error => console.error("Fehler beim Laden der Systeminformationen:", error));
    }, []);

    // Feedback senden
    const handleFeedbackSubmit = () => {
        if (feedback.trim() === "") return;

        // Easter Egg prüfen
        if (feedback === "42" || feedback.toLowerCase() === "showsecret") {
            setShowSecret(true);
            setFeedback("");
            return;
        }

        axios.post('http://localhost:4000/feedback', { feedback })
            .then(() => {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setFeedback("");
                }, 3000);
            })
            .catch(error => console.error("Fehler beim Senden des Feedbacks:", error));
    };

    return (
        <div className="container">
            <h1>PC Konfigurator</h1>
            
            {/* Systeminformationen anzeigen */}
            <div className="card">
                <h2>Dein aktuelles System:</h2>
                {systemInfo ? (
                    <div>
                        <p><strong>CPU:</strong> {systemInfo.cpu}</p>
                        <p><strong>RAM:</strong> {systemInfo.ram}</p>
                        <p><strong>Plattform:</strong> {systemInfo.platform}</p>
                        <p><strong>Hostname:</strong> {systemInfo.hostname}</p>
                    </div>
                ) : (
                    <p>Lade Systeminformationen...</p>
                )}
            </div>
            
            {/* Feedback Formular */}
            <div className="card">
                <h2>Feedback senden</h2>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Dein Feedback hier eingeben..."
                />
                <button onClick={handleFeedbackSubmit}>Absenden</button>
                {submitted && <p className="success">Feedback erfolgreich gesendet!</p>}
            </div>

            {/* Easter Egg */}
            {showSecret && (
                <div className="secret-card">
                    🎉🎩 Willkommen im geheimen Bereich! Du hast das Easter Egg gefunden! 🔥
                </div>
            )}
        </div>
    );
};

export default App;
