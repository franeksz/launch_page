/* ===================================================================
 *  Khronos 2.0.0 - Main JS
 *
 *
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const body = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        const info = document.querySelector('.s-info');

        if (!(preloader && info)) return;

        html.classList.add('ss-preload');

        window.addEventListener('load', function() {

            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');

            // page scroll position to top
            preloader.addEventListener('transitionstart', function gotoTop(e) {
                if (e.target.matches('#preloader')) {
                    window.scrollTo(0, 0);
                    preloader.removeEventListener(e.type, gotoTop);
                }
            });

            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    body.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });

        });

        window.addEventListener('beforeunload' , function() {
            body.classList.remove('ss-show');
        });
    };


   /* Countdown Timer
    * ------------------------------------------------------ */
    const ssCountdown = function () {

        // Define the start date in Warsaw time (ISO format with time zone offset)
        const startDateString = '2024-10-01T00:00:00+02:00'; // Adjust to your specific start date
        const startDate = new Date(startDateString);

        // Add 100 days to the start date to get the final date
        const daysToAdd = 100;
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const finalDate = new Date(startDate.getTime() + daysToAdd * millisecondsInDay);

        // Select the DOM elements where the countdown numbers will be displayed
        const daysSpan = document.querySelector('.counter .ss-days');
        const hoursSpan = document.querySelector('.counter .ss-hours');
        const minutesSpan = document.querySelector('.counter .ss-minutes');
        const secondsSpan = document.querySelector('.counter .ss-seconds');
        let timeInterval;

        if (!(daysSpan && hoursSpan && minutesSpan && secondsSpan)) return;

        function timer() {

            // Get current time
            const now = new Date();

            // Calculate time difference
            let diff = finalDate.getTime() - now.getTime();

            if (diff <= 0) {
                if (timeInterval) { 
                    clearInterval(timeInterval);
                }
                // Set all values to zero
                daysSpan.textContent = '00';
                hoursSpan.textContent = '00';
                minutesSpan.textContent = '00';
                secondsSpan.textContent = '00';
                return;
            }

            // Calculate days, hours, minutes, and seconds
            let days = Math.floor( diff / (1000 * 60 * 60 * 24) );
            let hours = Math.floor( (diff / (1000 * 60 * 60)) % 24 );
            let minutes = Math.floor( (diff / (1000 * 60)) % 60 );
            let seconds = Math.floor( (diff / 1000) % 60 );

            // Format numbers to have leading zeros if necessary
            days = days < 10 ? '0' + days : days;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // Update the DOM elements with the calculated values
            daysSpan.textContent = days;
            hoursSpan.textContent = hours;
            minutesSpan.textContent = minutes;
            secondsSpan.textContent = seconds;

        }

        // Initialize the timer
        timer();
        // Update the timer every second
        timeInterval = setInterval(timer, 1000);
    };


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            effect: 'fade',
            speed: 2000,
            autoplay: {
                delay: 5000,
            }

        });
    };



   /* Tabs
    * ---------------------------------------------------- */ 
    const sstabs = function(nextTab = false) {

        const tabList = document.querySelector('.tab-nav__list');
        const tabPanels = document.querySelectorAll('.tab-content__item');
        const tabItems = document.querySelectorAll('.tab-nav__list li');
        const tabLinks = [];

        if (!(tabList && tabPanels)) return;

        const tabClickEvent = function(tabLink, tabLinks, tabPanels, linkIndex, e) {
    
            // Reset all the tablinks
            tabLinks.forEach(function(link) {
                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-selected', 'false');
                link.parentNode.removeAttribute('data-tab-active');
                link.removeAttribute('data-tab-active');
            });
    
            // set the active link attributes
            tabLink.setAttribute('tabindex', '0');
            tabLink.setAttribute('aria-selected', 'true');
            tabLink.parentNode.setAttribute('data-tab-active', '');
            tabLink.setAttribute('data-tab-active', '');
    
            // Change tab panel visibility
            tabPanels.forEach(function(panel, index) {
                if (index != linkIndex) {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.removeAttribute('data-tab-active');
                } else {
                    panel.setAttribute('aria-hidden', 'false');
                    panel.setAttribute('data-tab-active', '');
                }
            });

            window.dispatchEvent(new Event("resize"));

        };
    
        const keyboardEvent = function(tabLink, tabLinks, tabPanels, tabItems, index, e) {

            let keyCode = e.keyCode;
            let currentTab = tabLinks[index];
            let previousTab = tabLinks[index - 1];
            let nextTab = tabLinks[index + 1];
            let firstTab = tabLinks[0];
            let lastTab = tabLinks[tabLinks.length - 1];
    
            // ArrowRight and ArrowLeft are the values when event.key is supported
            switch (keyCode) {
                case 'ArrowLeft':
                case 37:
                    e.preventDefault();
    
                    if (!previousTab) {
                        lastTab.focus();
                    } else {
                        previousTab.focus();
                    }
                    break;
    
                case 'ArrowRight':
                case 39:
                    e.preventDefault();
    
                    if (!nextTab) {
                        firstTab.focus();
                    } else {
                        nextTab.focus();
                    }
                    break;
            }
    
        };


        // Add accessibility roles and labels
        tabList.setAttribute('role','tablist');
        tabItems.forEach(function(item, index) {
    
            let link = item.querySelector('a');
    
            // collect tab links
            tabLinks.push(link);
            item.setAttribute('role', 'presentation');
    
            if (index == 0) {
                item.setAttribute('data-tab-active', '');
            }
    
        });
    
        // Set up tab links
        tabLinks.forEach(function(link, i) {
            let anchor = link.getAttribute('href').split('#')[1];
            let attributes = {
                'id': 'tab-link-' + i,
                'role': 'tab',
                'tabIndex': '-1',
                'aria-selected': 'false',
                'aria-controls': anchor
            };
    
            // if it's the first element update the attributes
            if (i == 0) {
                attributes['aria-selected'] = 'true';
                attributes.tabIndex = '0';
                link.setAttribute('data-tab-active', '');
            };
    
            // Add the various accessibility roles and labels to the links
            for (var key in attributes) {
                link.setAttribute(key, attributes[key]);
            }
                  
            // Click Event Listener
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
          
            // Click Event Listener
            link.addEventListener('focus', function(e) {
                tabClickEvent(this, tabLinks, tabPanels, i, e);
            });
    
            // Keyboard event listener
            link.addEventListener('keydown', function(e) {
                keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
            });
        });
    
        // Set up tab panels
        tabPanels.forEach(function(panel, i) {
    
            let attributes = {
                'role': 'tabpanel',
                'aria-hidden': 'true',
                'aria-labelledby': 'tab-link-' + i
            };
          
            if (nextTab) {
                let nextTabLink = document.createElement('a');
                let nextTabLinkIndex = (i < tabPanels.length - 1) ? i + 1 : 0;

                 // set up next tab link
                nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);
                nextTabLink.textContent = 'Next Tab';
                panel.appendChild(nextTabLink);
            }
               
            if (i == 0) {
                attributes['aria-hidden'] = 'false';
                panel.setAttribute('data-tab-active', '');
            }
    
            for (let key in attributes) {
                panel.setAttribute(key, attributes[key]);
            }
        });
    };


   /* Alert Boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box) {
            box.addEventListener('click', function(event) {
                if (event.target.matches('.alert-box__close')) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add('hideit');

                    setTimeout(function(){
                        box.style.display = 'none';
                    }, 500)
                }
            });
        })
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; 

    /* Word-Changing Animation
    * ------------------------------------------------------ */
    const ssWordAnimation = function() {

        const words = ['rewolucję', 'NumiVault'];
        let currentIndex = 0;

        const changingWordElement = document.getElementById('changing-word');

        if (!changingWordElement) return;

        setInterval(() => {
            // Add fade-out class
            changingWordElement.classList.add('fade-out');

            // After fade-out completes
            setTimeout(() => {
                // Update the word
                currentIndex = (currentIndex + 1) % words.length;
                changingWordElement.textContent = words[currentIndex];

                // Remove fade-out class to trigger fade-in
                changingWordElement.classList.remove('fade-out');

            }, 500);

        }, 4000);

    };

    /* Form Submission
    * ---------------------------------------------------- */ 
    const ssFormSubmission = function() {

        const form = document.getElementById('email-form');
        const emailInput = document.getElementById('mce-EMAIL');
        const formStatus = document.getElementById('form-status');
    
        if (!form) return;
    
        const submitButton = form.querySelector('button[type="submit"]');
        let originalButtonContent = submitButton.innerHTML;
    
        form.addEventListener('submit', function(event) {
            event.preventDefault();
    
            const email = emailInput.value.trim();
    
            // Disable the submit button and show loading spinner
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading-spinner"></div>';
    
            // Send data to Google Sheets
            submitEmailToGoogleSheets(email);
        });
    
        // Function to show status messages
        function showStatusMessage(message, type) {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
        }
    
        // Function to submit email to Google Sheets
        function submitEmailToGoogleSheets(email) {
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyboj5oAiHUQgvxmj2GoeZK3zeB6ua9O7brGIzmyWVHzxpIF5Ez-k4rH_M54-49iyha6g/exec';
    
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(() => {
                // Since response is opaque in 'no-cors' mode, we assume success
                showStatusMessage('Twój mail został zapisany!', 'success');
                form.reset();
            })
            .catch(error => {
                showStatusMessage('Wystąpił błąd. Spróbuj ponownie później.', 'error');
                console.error('Error!', error);
            })
            .finally(() => {
                // Re-enable the submit button and restore original content
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
            });
        }
    
    };


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssCountdown();
        ssSwiper();
        sstabs();
        ssAlertBoxes();
        ssMoveTo();
        ssWordAnimation();
        ssFormSubmission();
    })();

})(document.documentElement);