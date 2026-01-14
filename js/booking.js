document.addEventListener('DOMContentLoaded', () => {
    // State management
    let currentStep = 1;
    const totalSteps = 5;

    // DOM Elements
    const form = document.getElementById('booking-form');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');

    // Pin System Elements
    const imageContainer = document.getElementById('body-image-container');
    const pinnedPointsInput = document.getElementById('pinnedPoints');
    const clearPinsBtn = document.getElementById('clear-pins-btn');
    let pins = []; // Array of {x, y} percentages

    // --- Steps Navigation ---

    function updateUI() {
        // Show/Hide steps
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        document.getElementById(`step-${currentStep}`).classList.add('active');

        // Update progress bar
        const progressPercentage = ((currentStep) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update step indicators
        document.querySelectorAll('.progress-step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            el.classList.remove('active', 'completed');
            if (stepNum === currentStep) el.classList.add('active');
            if (stepNum < currentStep) el.classList.add('completed');
        });

        // Buttons visibility
        prevBtn.classList.toggle('hidden', currentStep === 1);

        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            populateReview();
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(step) {
        const stepSection = document.getElementById(`step-${step}`);
        const inputs = stepSection.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (input.type === 'radio' || input.type === 'checkbox') {
                const name = input.name;
                const checked = stepSection.querySelector(`input[name="${name}"]:checked`);
                const container = input.closest('div').parentElement; // simplistic logic to highlight parent
                if (!checked) {
                    isValid = false;
                    // Highlight logic? For now, standard alert is handled by button click
                }
            } else {
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                }
            }
        });

        return isValid;
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateUI();
            }
        } else {
            alert('Please fill in all required fields.');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });


    // --- Pin Placement System ---

    imageContainer.addEventListener('click', (e) => {
        if (e.target.tagName !== 'IMG' && e.target !== imageContainer) return;

        const rect = imageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        addPin(xPercent, yPercent);
    });

    function getBodyLocation(x, y) {
        // Standard view assumption: Left side is Front, Right side is Back
        // This logic approximates body regions based on percentage coordinates.
        // x and y are percentages (0-100)

        const side = x < 50 ? "Front" : "Back";
        // Normalize x for symmetry if needed, but simple regions work for now.

        let part = "Body";

        if (y < 10) {
            part = "Head";
        } else if (y < 18) {
            part = "Neck";
        } else if (y < 25) {
            part = "Shoulders/Collarbone";
        } else if (y < 45) {
            part = side === "Front" ? "Chest/Ribs" : "Upper Back";
        } else if (y < 60) {
            // Check for arms (outer edges) vs Torso (center)
            // Front: Center roughly 15-35%, Back: Center roughly 65-85%
            const isArm = (x < 15 || (x > 35 && x < 50)) || (x > 85 || (x > 50 && x < 65));

            // Simplified arm detection:
            if (side === "Front") {
                if (x < 15 || x > 35) part = "Arm";
                else part = "Stomach";
            } else {
                if (x < 65 || x > 85) part = "Arm";
                else part = "Lower Back";
            }
        } else if (y < 80) {
            part = "Thigh/Upper Leg";
        } else {
            part = "Calf/Lower Leg/Foot";
        }

        return `${part} (${side})`;
    }

    function addPin(xPercent, yPercent) {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.style.left = `${xPercent}%`;
        pin.style.top = `${yPercent}%`;

        imageContainer.appendChild(pin);

        const locationName = getBodyLocation(xPercent, yPercent);
        pins.push({ x: Math.round(xPercent), y: Math.round(yPercent), location: locationName });
        updatePinInput();
    }

    clearPinsBtn.addEventListener('click', () => {
        document.querySelectorAll('.pin').forEach(el => el.remove());
        pins = [];
        updatePinInput();
    });

    function updatePinInput() {
        if (pins.length > 0) {
            // Format: "Location (x%, y%)"
            pinnedPointsInput.value = pins.map(p => `${p.location} [${p.x}%, ${p.y}%]`).join('; ');
        } else {
            pinnedPointsInput.value = "";
        }
    }

    // --- Review & Submit ---

    function populateReview() {
        const reviewContainer = document.getElementById('review-content');
        const data = new FormData(form);
        const getVal = (name) => data.get(name) || '-';
        const getAll = (name) => {
            const vals = data.getAll(name);
            return vals.length > 0 ? vals.join(', ') : '-';
        };

        let html = `
            <div class="space-y-4">
                <div class="border-b border-gray-700 pb-2">
                    <h3 class="text-sand font-bold uppercase text-sm">Contact</h3>
                    <p class="text-sm"><strong>${getVal('firstName')} ${getVal('lastName')}</strong></p>
                    <p class="text-sm text-gray-400">${getVal('email')} | ${getVal('phone')}</p>
                    <p class="text-sm text-gray-400">Instagram: ${getVal('instagram')}</p>
                    <p class="text-sm text-gray-400">DOB: ${getVal('birthdate')}</p>
                </div>
                
                <div class="border-b border-gray-700 pb-2">
                    <h3 class="text-sand font-bold uppercase text-sm">Idea</h3>
                    <p class="text-sm">Artist: <strong>${getVal('artist')}</strong></p> 
                    <p class="text-sm">Styles: ${getAll('style')}</p>
                    <p class="text-sm">Color: ${getVal('color')}</p>
                    <p class="text-sm text-gray-400">Exp: ${getVal('experience') === 'Yes' ? 'Has Tattoos' : 'First Tattoo'} | Body: ${getVal('bodyShape')} | Skin: ${getVal('skinTone')}</p>
                </div>

                <div class="border-b border-gray-700 pb-2">
                     <h3 class="text-sand font-bold uppercase text-sm">Placement</h3>
                     <p class="text-sm">Body Image Markers: ${pins.length > 0 ? pins.map(p => p.location).join(', ') : 'None marked'}</p>
                     <p class="text-sm">Size: ${getVal('size')}</p>
                </div>

                <div>
                    <h3 class="text-sand font-bold uppercase text-sm">Logistics</h3>
                    <p class="text-sm italic">"${getVal('description')}"</p>
                    <div class="mt-2 text-xs text-gray-400">
                        <p>Availability: ${getVal('availability')}</p>
                        <p>Budget: ${getVal('budget')}</p>
                        <p>Refs: ${getVal('references')}</p>
                    </div>
                </div>
            </div>
        `;

        reviewContainer.innerHTML = html;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const subject = `Booking Request: ${data.get('firstName')} ${data.get('lastName')} (${data.get('style')})`;

        const styleList = data.getAll('style').join(', ');

        const body = `
BOOKING REQUEST - XATTA TATTOO

--- PERSONAL ---
Name: ${data.get('firstName')} ${data.get('lastName')}
Email: ${data.get('email')}
Phone: ${data.get('phone')}
Instagram: ${data.get('instagram')}
Date of Birth: ${data.get('birthdate')}

--- IDEA ---
Preferred Artist: ${data.get('artist')}
Styles: ${styleList}
Color: ${data.get('color')}
Already Tattooed: ${data.get('experience')}
Body Shape: ${data.get('bodyShape')}
Skin Tone: ${data.get('skinTone')}

--- PLACEMENT ---
Size: ${data.get('size')}
Placement Markers (See image in mind or description): ${data.get('pinnedPoints') || 'None marked'}

--- DETAILS ---
Description:
${data.get('description')}

Availability: ${data.get('availability')}
Budget: ${data.get('budget')}
References Link: ${data.get('references')}

[Note to User: Please attach any reference images to this email before sending!]
        `;

        const mailtoLink = `mailto:info@xattatattoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;

        // alert('Your default email client has been opened. Please attach your specific reference images and BodyParts.png if you marked it (screenshot it if needed)!');
        // Actually, screenshotting is hard for user. Let's just trust the text description + logic.
    });

    // Init with logic
    updateUI();
});
