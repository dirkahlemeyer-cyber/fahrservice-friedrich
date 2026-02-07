/**
 * FAHRSERVICE FRIEDRICH - COOKIE BANNER
 * DSGVO-konforme Cookie-Einwilligung
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Cookie-Banner HTML erstellen
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h4>🍪 Datenschutzeinstellungen</h4>
                    <p>Wir verwenden Cookies, um Ihnen die bestmögliche Nutzung unserer Website zu ermöglichen. 
                    Einige Cookies sind technisch notwendig, während andere uns helfen, unsere Website zu verbessern.</p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn cookie-btn-accept" onclick="acceptAllCookies()">
                        Alle akzeptieren
                    </button>
                    <button class="cookie-btn cookie-btn-essential" onclick="acceptEssentialCookies()">
                        Nur Essenzielle
                    </button>
                    <button class="cookie-btn cookie-btn-essential" onclick="showCookieSettings()">
                        Einstellungen
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
    }

    // Cookie-Einstellungen Modal erstellen
    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'cookieSettingsModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            justify-content: center;
            align-items: center;
        `;
        modal.innerHTML = `
            <div style="background: white; max-width: 500px; width: 90%; border-radius: 8px; padding: 2rem; max-height: 80vh; overflow-y: auto;">
                <h3>Cookie-Einstellungen</h3>
                
                <div style="margin: 1.5rem 0;">
                    <label style="display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; opacity: 0.7;">
                        <input type="checkbox" checked disabled style="margin-top: 0.3rem;">
                        <div>
                            <strong>Technisch notwendig</strong>
                            <p style="font-size: 0.9rem; color: #666; margin: 0.3rem 0 0 0;">
                                Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                            </p>
                        </div>
                    </label>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <label style="display: flex; align-items: flex-start; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="analyticsCookies" style="margin-top: 0.3rem;">
                        <div>
                            <strong>Analyse & Statistik</strong>
                            <p style="font-size: 0.9rem; color: #666; margin: 0.3rem 0 0 0;">
                                Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                            </p>
                        </div>
                    </label>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <label style="display: flex; align-items: flex-start; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="marketingCookies" style="margin-top: 0.3rem;">
                        <div>
                            <strong>Marketing</strong>
                            <p style="font-size: 0.9rem; color: #666; margin: 0.3rem 0 0 0;">
                                Werden verwendet, um Besuchern relevante Werbung anzuzeigen.
                            </p>
                        </div>
                    </label>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button onclick="saveCookieSettings()" class="cookie-btn cookie-btn-accept" style="flex: 1;">
                        Einstellungen speichern
                    </button>
                    <button onclick="closeCookieSettings()" class="cookie-btn cookie-btn-essential" style="flex: 1;">
                        Abbrechen
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Cookie setzen
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
    }

    // Cookie lesen
    function getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }

    // Alle Cookies akzeptieren (global)
    window.acceptAllCookies = function() {
        const consent = {
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        hideCookieBanner();
        loadOptionalScripts();
    };

    // Nur essentielle Cookies (global)
    window.acceptEssentialCookies = function() {
        const consent = {
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        hideCookieBanner();
    };

    // Einstellungen anzeigen (global)
    window.showCookieSettings = function() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.style.display = 'flex';
            // Aktuelle Werte laden
            const consent = getCookie('cookie_consent');
            if (consent) {
                const data = JSON.parse(consent);
                document.getElementById('analyticsCookies').checked = data.analytics || false;
                document.getElementById('marketingCookies').checked = data.marketing || false;
            }
        }
    };

    // Einstellungen speichern (global)
    window.saveCookieSettings = function() {
        const analytics = document.getElementById('analyticsCookies').checked;
        const marketing = document.getElementById('marketingCookies').checked;
        
        const consent = {
            essential: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        };
        
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        closeCookieSettings();
        hideCookieBanner();
        
        if (analytics || marketing) {
            loadOptionalScripts();
        }
    };

    // Einstellungen schließen (global)
    window.closeCookieSettings = function() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Banner ausblenden
    function hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    // Optionale Scripts laden (Analytics etc.)
    function loadOptionalScripts() {
        const consent = getCookie('cookie_consent');
        if (!consent) return;
        
        const data = JSON.parse(consent);
        
        // Hier können Analytics-Scripts geladen werden
        if (data.analytics) {
            // z.B. Google Analytics laden
            console.log('Analytics aktiviert');
        }
        
        if (data.marketing) {
            // z.B. Marketing-Pixel laden
            console.log('Marketing aktiviert');
        }
    }

    // Prüfen ob Consent bereits vorhanden
    function checkConsent() {
        const consent = getCookie('cookie_consent');
        if (!consent) {
            // Banner anzeigen
            setTimeout(() => {
                const banner = document.getElementById('cookieBanner');
                if (banner) {
                    banner.style.display = 'block';
                    // Kleine Verzögerung für Animation
                    setTimeout(() => {
                        banner.classList.add('show');
                    }, 100);
                }
            }, 1000);
        } else {
            // Bereits zugestimmt, optionale Scripts laden
            loadOptionalScripts();
        }
    }

    // Initialisierung
    createCookieBanner();
    createSettingsModal();
    checkConsent();
});