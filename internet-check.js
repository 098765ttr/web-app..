// Internet Connection Checker
// This script monitors internet connectivity and shows a no-internet screen when connection is lost

(function() {
    // Create no-internet screen HTML
    const noInternetHTML = `
        <div id="noInternetScreen" class="no-internet-screen">
            <div class="no-internet-content">
                <div class="no-internet-icon">📡</div>
                <h2 class="no-internet-title">No Internet Connection</h2>
                <p class="no-internet-subtitle">Your internet connection has been turned off</p>
                <p class="no-internet-message">Please check your internet connection and try again</p>
                <div class="no-internet-loader">
                    <div class="loader-dot"></div>
                    <div class="loader-dot"></div>
                    <div class="loader-dot"></div>
                </div>
                <p class="no-internet-status">Waiting for connection...</p>
            </div>
        </div>
    `;

    // Create no-internet screen CSS
    const noInternetCSS = `
        <style>
            .no-internet-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .no-internet-screen.show {
                display: flex;
                opacity: 1;
            }

            .no-internet-content {
                text-align: center;
                padding: 40px;
                max-width: 400px;
            }

            .no-internet-icon {
                font-size: 80px;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.7;
                }
            }

            .no-internet-title {
                color: white;
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 10px;
                font-family: 'Poppins', sans-serif;
            }

            .no-internet-subtitle {
                color: #a0a0a0;
                font-size: 16px;
                margin-bottom: 10px;
                font-family: 'Poppins', sans-serif;
            }

            .no-internet-message {
                color: #6c757d;
                font-size: 14px;
                margin-bottom: 30px;
                font-family: 'Poppins', sans-serif;
            }

            .no-internet-loader {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }

            .loader-dot {
                width: 12px;
                height: 12px;
                background: #667eea;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out both;
            }

            .loader-dot:nth-child(1) {
                animation-delay: -0.32s;
            }

            .loader-dot:nth-child(2) {
                animation-delay: -0.16s;
            }

            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }

            .no-internet-status {
                color: #667eea;
                font-size: 14px;
                font-weight: 500;
                font-family: 'Poppins', sans-serif;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .no-internet-content {
                    padding: 20px !important;
                }

                .no-internet-icon {
                    font-size: 60px !important;
                }

                .no-internet-title {
                    font-size: 24px !important;
                }
            }
            
            @media (max-width: 480px) {
                .no-internet-content {
                    padding: 15px !important;
                }
                
                .no-internet-icon {
                    font-size: 50px !important;
                }
                
                .no-internet-title {
                    font-size: 20px !important;
                }
                
                .no-internet-message {
                    font-size: 14px !important;
                }
                
                .no-internet-status {
                    font-size: 12px !important;
                }
            }
            
            @media (max-width: 375px) {
                .no-internet-content {
                    padding: 12px !important;
                }
                
                .no-internet-icon {
                    font-size: 40px !important;
                }
                
                .no-internet-title {
                    font-size: 18px !important;
                }
                
                .no-internet-message {
                    font-size: 12px !important;
                }
                
                .no-internet-status {
                    font-size: 11px !important;
                }
            }
        </style>
    `;

    // Inject CSS into head
    document.head.insertAdjacentHTML('beforeend', noInternetCSS);

    // Inject HTML into body
    document.body.insertAdjacentHTML('beforeend', noInternetHTML);

    // Get elements
    const noInternetScreen = document.getElementById('noInternetScreen');
    const noInternetStatus = document.querySelector('.no-internet-status');

    // Track connection status
    let isOnline = navigator.onLine;
    let wasOffline = false;

    // Show no-internet screen
    function showNoInternetScreen() {
        if (noInternetScreen) {
            noInternetScreen.classList.add('show');
            noInternetStatus.textContent = 'Waiting for connection...';
        }
    }

    // Hide no-internet screen
    function hideNoInternetScreen() {
        if (noInternetScreen) {
            noInternetScreen.classList.remove('show');
        }
    }

    // Check internet connection
    function checkConnection() {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000);

            fetch('https://www.google.com/favicon.ico', { 
                mode: 'no-cors',
                cache: 'no-cache'
            })
            .then(() => {
                clearTimeout(timeout);
                resolve(true);
            })
            .catch(() => {
                clearTimeout(timeout);
                resolve(false);
            });
        });
    }

    // Handle online event
    function handleOnline() {
        isOnline = true;
        if (wasOffline) {
            noInternetStatus.textContent = 'Connection restored!';
            setTimeout(() => {
                hideNoInternetScreen();
                wasOffline = false;
            }, 1000);
        }
    }

    // Handle offline event
    function handleOffline() {
        isOnline = false;
        wasOffline = true;
        showNoInternetScreen();
    }

    // Monitor connection periodically
    async function monitorConnection() {
        const connected = await checkConnection();
        
        if (!connected && isOnline) {
            handleOffline();
        } else if (connected && !isOnline) {
            handleOnline();
        }
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection on page load
    if (!navigator.onLine) {
        handleOffline();
    }

    // Monitor connection every 3 seconds
    setInterval(monitorConnection, 3000);

    // Also check when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            monitorConnection();
        }
    });

    // Expose functions globally
    window.NoInternetChecker = {
        show: showNoInternetScreen,
        hide: hideNoInternetScreen,
        check: monitorConnection
    };
})();
