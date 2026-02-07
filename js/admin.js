/**
 * FAHRSERVICE FRIEDRICH - ADMIN PANEL
 * Preisverwaltung mit localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Standard-Preise
    const defaultPrices = {
        grundpreis: 5.00,
        km_preis_tag: 2.50,
        km_preis_nacht: 3.00,
        zuschlag_nacht: 5.00,
        zuschlag_feiertag: 5.00,
        zuschlag_gepaeck: 5.00,
        zuschlag_sperr: 10.00,
        pauschal_fra_flughafen: 85.00,
        pauschal_fra_hbf: 75.00,
        pauschal_fra_city: 80.00,
        pauschal_wiesbaden: 90.00,
        pauschal_mainz: 85.00,
        pauschal_darmstadt: 95.00,
        pauschal_hahn: 180.00,
        rabatt_4pers: 5,
        rabatt_6pers: 10,
        rabatt_rueckfahrt: 10
    };

    // Preise aus localStorage laden
    function loadPrices() {
        const stored = localStorage.getItem('fahrservice_preise');
        return stored ? JSON.parse(stored) : defaultPrices;
    }

    // Preise in localStorage speichern
    function savePricesToStorage(prices) {
        localStorage.setItem('fahrservice_preise', JSON.stringify(prices));
    }

    // Preise in Formularfelder laden
    function populateForm() {
        const prices = loadPrices();
        
        Object.keys(prices).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = prices[key];
            }
        });
        
        updateConfigPreview();
    }

    // Preise aus Formular lesen
    function getPricesFromForm() {
        const prices = {};
        const fields = [
            'grundpreis', 'km_preis_tag', 'km_preis_nacht',
            'zuschlag_nacht', 'zuschlag_feiertag', 'zuschlag_gepaeck', 'zuschlag_sperr',
            'pauschal_fra_flughafen', 'pauschal_fra_hbf', 'pauschal_fra_city',
            'pauschal_wiesbaden', 'pauschal_mainz', 'pauschal_darmstadt', 'pauschal_hahn',
            'rabatt_4pers', 'rabatt_6pers', 'rabatt_rueckfahrt'
        ];
        
        fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                prices[field] = parseFloat(input.value) || 0;
            }
        });
        
        return prices;
    }

    // Konfigurationsvorschau aktualisieren
    function updateConfigPreview() {
        const preview = document.getElementById('configPreview');
        if (preview) {
            const prices = loadPrices();
            preview.textContent = JSON.stringify(prices, null, 2);
        }
    }

    // Preise speichern (global verfügbar)
    window.savePrices = function() {
        const prices = getPricesFromForm();
        savePricesToStorage(prices);
        updateConfigPreview();
        alert('Preise wurden erfolgreich gespeichert!');
    };

    // Preise zurücksetzen (global verfügbar)
    window.resetPrices = function() {
        if (confirm('Möchten Sie wirklich alle Preise auf die Standardwerte zurücksetzen?')) {
            savePricesToStorage(defaultPrices);
            populateForm();
            alert('Preise wurden auf Standardwerte zurückgesetzt.');
        }
    };

    // Preise exportieren (Backup)
    window.exportData = function() {
        const prices = loadPrices();
        const dataStr = JSON.stringify(prices, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'fahrservice_preise_backup_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
    };

    // Preise importieren (Restore)
    window.importData = function(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const prices = JSON.parse(e.target.result);
                
                // Validierung
                const requiredFields = Object.keys(defaultPrices);
                const hasAllFields = requiredFields.every(field => prices.hasOwnProperty(field));
                
                if (!hasAllFields) {
                    alert('Die Datei enthält nicht alle erforderlichen Preisfelder.');
                    return;
                }
                
                if (confirm('Möchten Sie die Preise aus der Datei importieren? Dies überschreibt alle aktuellen Einstellungen.')) {
                    savePricesToStorage(prices);
                    populateForm();
                    alert('Preise wurden erfolgreich importiert.');
                }
            } catch (error) {
                alert('Fehler beim Importieren: Ungültige Datei.');
            }
        };
        reader.readAsText(file);
        
        // Input zurücksetzen
        input.value = '';
    };

    // Initialisierung
    populateForm();
});