/**
 * FAHRSERVICE FRIEDRICH - BUCHUNGSLOGIK
 * Preisberechnung und Formularverarbeitung
 */

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const priceDisplay = document.getElementById('priceDisplay');
    const priceAmount = document.getElementById('priceAmount');
    
    // Preise aus localStorage laden oder Standardwerte verwenden
    function getPrices() {
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
        
        const stored = localStorage.getItem('fahrservice_preise');
        return stored ? JSON.parse(stored) : defaultPrices;
    }

    // Entfernungen in km (ca. von Wehrheim)
    const distances = {
        'Frankfurt Flughafen': 35,
        'Frankfurt Hauptbahnhof': 40,
        'Frankfurt City': 42,
        'Wiesbaden': 55,
        'Mainz': 60,
        'Darmstadt': 65,
        'Hahn Flughafen': 140,
        'sonstiges': 0
    };

    // Preis berechnen
    function calculatePrice() {
        const prices = getPrices();
        const zielort = document.getElementById('zielort').value;
        const fahrgaeste = parseInt(document.getElementById('fahrgaeste').value) || 1;
        const gepaeck = document.getElementById('gepaeck').value;
        const fahrtrichtung = document.getElementById('fahrtrichtung').value;
        const abholzeit = document.getElementById('abholzeit').value;
        
        if (!zielort) {
            priceDisplay.style.display = 'none';
            return;
        }

        let basePrice = 0;
        let isPauschal = false;

        // Pauschalpreis oder Kilometerpreis
        if (zielort === 'Frankfurt Flughafen' && prices.pauschal_fra_flughafen) {
            basePrice = prices.pauschal_fra_flughafen;
            isPauschal = true;
        } else if (zielort === 'Frankfurt Hauptbahnhof' && prices.pauschal_fra_hbf) {
            basePrice = prices.pauschal_fra_hbf;
            isPauschal = true;
        } else if (zielort === 'Frankfurt City' && prices.pauschal_fra_city) {
            basePrice = prices.pauschal_fra_city;
            isPauschal = true;
        } else if (zielort === 'Wiesbaden' && prices.pauschal_wiesbaden) {
            basePrice = prices.pauschal_wiesbaden;
            isPauschal = true;
        } else if (zielort === 'Mainz' && prices.pauschal_mainz) {
            basePrice = prices.pauschal_mainz;
            isPauschal = true;
        } else if (zielort === 'Darmstadt' && prices.pauschal_darmstadt) {
            basePrice = prices.pauschal_darmstadt;
            isPauschal = true;
        } else if (zielort === 'Hahn Flughafen' && prices.pauschal_hahn) {
            basePrice = prices.pauschal_hahn;
            isPauschal = true;
        } else {
            // Kilometerpreis berechnen
            const km = distances[zielort] || 50;
            const hour = abholzeit ? parseInt(abholzeit.split(':')[0]) : 12;
            const isNacht = hour >= 22 || hour < 6;
            const kmPrice = isNacht ? prices.km_preis_nacht : prices.km_preis_tag;
            basePrice = prices.grundpreis + (km * kmPrice);
        }

        let totalPrice = basePrice;

        // Nachtzuschlag (nur bei Kilometerpreis, nicht Pauschal)
        if (!isPauschal) {
            const hour = abholzeit ? parseInt(abholzeit.split(':')[0]) : 12;
            if (hour >= 22 || hour < 6) {
                totalPrice += prices.zuschlag_nacht;
            }
        }

        // Gepäckzuschlag
        if (gepaeck === 'viel') {
            totalPrice += prices.zuschlag_gepaeck * (fahrgaeste - 1);
        } else if (gepaeck === 'sperr') {
            totalPrice += prices.zuschlag_sperr;
        }

        // Personenrabatt
        let rabatt = 0;
        if (fahrgaeste >= 6 && prices.rabatt_6pers) {
            rabatt = prices.rabatt_6pers;
        } else if (fahrgaeste >= 4 && prices.rabatt_4pers) {
            rabatt = prices.rabatt_4pers;
        }
        
        if (rabatt > 0) {
            totalPrice = totalPrice * (1 - rabatt / 100);
        }

        // Rückfahrtrabatt (Hin- und Rückfahrt)
        if (fahrtrichtung === 'hinrueck') {
            totalPrice = totalPrice * 2;
            if (prices.rabatt_rueckfahrt) {
                totalPrice = totalPrice * (1 - prices.rabatt_rueckfahrt / 100);
            }
        }

        // Preis anzeigen
        priceAmount.textContent = totalPrice.toFixed(2) + ' €';
        priceDisplay.style.display = 'block';
    }

    // Event Listener für Preisberechnung
    if (bookingForm) {
        const inputs = bookingForm.querySelectorAll('select, input[type="time"]');
        inputs.forEach(input => {
            input.addEventListener('change', calculatePrice);
        });

        // Formular absenden
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hier später die tatsächliche Formularverarbeitung (z.B. Email-Versand)
            alert('Vielen Dank für Ihre Anfrage! Wir werden uns umgehend bei Ihnen melden.\n\nBitte prüfen Sie auch Ihren Spam-Ordner.');
            bookingForm.reset();
            priceDisplay.style.display = 'none';
        });
    }
});