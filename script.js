class FlashcardApp {
    constructor() {
        this.forms = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        
        this.flashcard = document.getElementById('flashcard');
        this.formName = document.getElementById('form-name');
        this.formNumber = document.getElementById('form-number');
        this.handPosition = document.getElementById('hand-position');
        this.openingMove = document.getElementById('opening-move');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.cardCounter = document.getElementById('card-counter');
        this.progressFill = document.getElementById('progress-fill');
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadForms();
            this.setupEventListeners();
            this.updateCard();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to load forms data. Please check that forms.json exists.');
        }
    }
    
    async loadForms() {
        try {
            const response = await fetch('forms.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.forms = await response.json();
            
            if (!Array.isArray(this.forms) || this.forms.length === 0) {
                throw new Error('Invalid forms data');
            }
        } catch (error) {
            throw new Error(`Failed to load forms: ${error.message}`);
        }
    }
    
    setupEventListeners() {
        this.flashcard.addEventListener('click', () => this.flipCard());
        this.prevBtn.addEventListener('click', () => this.previousCard());
        this.nextBtn.addEventListener('click', () => this.nextCard());
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousCard();
                    break;
                case 'ArrowRight':
                    this.nextCard();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.flipCard();
                    break;
            }
        });
    }
    
    flipCard() {
        if (this.forms.length === 0) return;
        
        this.isFlipped = !this.isFlipped;
        this.flashcard.classList.toggle('flipped', this.isFlipped);
    }
    
    previousCard() {
        if (this.forms.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.forms.length) % this.forms.length;
        this.updateCard();
    }
    
    nextCard() {
        if (this.forms.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.forms.length;
        this.updateCard();
    }
    
    updateCard() {
        if (this.forms.length === 0) return;
        
        const currentForm = this.forms[this.currentIndex];
        
        this.formNumber.textContent = currentForm.number;
        this.formName.textContent = currentForm.name;
        this.handPosition.textContent = currentForm.handPosition;
        this.openingMove.textContent = currentForm.openingMove;
        
        this.cardCounter.textContent = `${this.currentIndex + 1} / ${this.forms.length}`;
        
        const progressPercent = ((this.currentIndex + 1) / this.forms.length) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
        
        this.prevBtn.disabled = this.forms.length <= 1;
        this.nextBtn.disabled = this.forms.length <= 1;
        
        this.isFlipped = false;
        this.flashcard.classList.remove('flipped');
    }
    
    showError(message) {
        this.formName.textContent = 'Error';
        this.handPosition.textContent = message;
        this.openingMove.textContent = 'Please ensure forms.json exists in the same directory.';
        this.cardCounter.textContent = '0 / 0';
        this.progressFill.style.width = '0%';
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});
