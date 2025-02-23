import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [upgradeOptions, setUpgradeOptions] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3000/systeminfo')
            .then(response => {
                setSystemInfo(response.data);
                fetchUpgradeOptions(response.data);
            })
            .catch(error => {
                console.error("Fehler beim Laden der Systeminformationen:", error);
            });
    }, []);

    const fetchUpgradeOptions = (system) => {
        if (!system || !system.cpu || !system.gpu || !system.ram || !system.mainboard) {
            console.error("Fehlende Systemdaten! API-Request wird nicht gesendet.");
            return;
        }
        axios.get('http://localhost:3000/upgrades', { params: system })
            .then(response => {
                setUpgradeOptions(response.data);
            })
            .catch(error => {
                console.error("Fehler beim Laden der Upgrade-Optionen:", error);
            });
    };

    return (
        <div style={darkMode ? styles.containerDark : styles.container}>
            <h1 style={styles.header}>PC Konfigurator</h1>
            
            {/* Dark Mode Toggle */}
            <label style={styles.switchContainer}>
                ☀️
                <div style={styles.switchWrapper} onClick={() => setDarkMode(!darkMode)}>
                    <div style={darkMode ? styles.toggleActive : styles.toggle}></div>
                </div>
                🌙
            </label>

            {systemInfo ? (
                <div style={darkMode ? styles.cardDark : styles.card}>
                    <h2>Dein aktuelles System:</h2>
                    <p><strong>CPU:</strong> {systemInfo.cpu}</p>
                    <p><strong>GPU:</strong> {systemInfo.gpu}</p>
                    <p><strong>RAM:</strong> {systemInfo.ram}</p>
                    <p><strong>Mainboard:</strong> {systemInfo.mainboard}</p>
                </div>
            ) : (
                <p style={styles.loadingText}>Lade Systeminformationen...</p>
            )}

            {upgradeOptions.length > 0 ? (
                <div style={styles.upgradeSection}>
                    <h2>Upgrade-Empfehlungen:</h2>
                    {upgradeOptions.map((upgrade, index) => (
                        <div key={index} style={darkMode ? styles.cardDark : styles.card}>
                            <p><strong>{upgrade.type}:</strong> {upgrade.name}</p>
                            <p>Preis: {upgrade.price}€</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={styles.loadingText}>Keine Upgrades verfügbar</p>
            )}
        </div>
    );
};

const styles = {
    container: { textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', color: '#000' },
    containerDark: { textAlign: 'center', padding: '20px', backgroundColor: '#222', minHeight: '100vh', color: '#fff' },
    header: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' },
    card: { backgroundColor: 'white', color: '#000', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', margin: '20px' },
    cardDark: { backgroundColor: '#333', color: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(255, 255, 255, 0.1)', margin: '20px' },
    upgradeSection: { marginTop: '20px' },
    loadingText: { fontSize: '1.2rem', color: '#777' },
    switchContainer: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', cursor: 'pointer', marginBottom: '20px' },
    switchWrapper: { width: '50px', height: '25px', background: '#ccc', borderRadius: '25px', position: 'relative', cursor: 'pointer' },
    toggle: { position: 'absolute', width: '20px', height: '20px', background: 'white', borderRadius: '50%', top: '50%', left: '5px', transform: 'translateY(-50%)', transition: '0.3s' },
    toggleActive: { position: 'absolute', width: '20px', height: '20px', background: 'yellow', borderRadius: '50%', top: '50%', left: '25px', transform: 'translateY(-50%)', transition: '0.3s' }
};

export default App;
