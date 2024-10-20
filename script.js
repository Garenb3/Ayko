document.addEventListener('DOMContentLoaded', () => {
    const audioFiles = [
        'taylor/daylight.mp3', 'taylor/king of my heart.mp3', 'taylor/mirrorball.mp3', 'taylor/renegade.mp3', 'taylor/this is me trying.mp3' // Add your audio file names here
    ];
    let audioIndex = 0;
    let audioInitialized = false;
    let audio = new Audio(); // Create the Audio object

    // Preload all audio files
    const audioElements = audioFiles.map(src => {
        const audioEl = new Audio(src);
        audioEl.preload = 'auto'; // Preload for faster playback
        return audioEl;
    });

    // Shuffle function for the audio playlist
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledAudioFiles = shuffle(audioElements);

    // Function to play the next audio in the playlist
    function playNextAudio() {
        audio = shuffledAudioFiles[audioIndex]; // Get the next audio element
        audio.play().catch(error => console.error("Audio playback failed:", error));
        audioIndex = (audioIndex + 1) % shuffledAudioFiles.length;

        // Play the next audio automatically when the current one ends
        audio.onended = playNextAudio;
    }

    // Initialize audio playback on first user interaction
    function initializeAudio() {
        if (!audioInitialized) {
            playNextAudio(); // Start playback
            audioInitialized = true;
        }
    }

    // Listen for user interaction to start audio
    document.body.addEventListener('click', initializeAudio);

    const videos = document.querySelectorAll('video');

    // Pause audio when any video plays, and resume when all videos stop
    videos.forEach(video => {
        video.addEventListener('play', () => audio.pause());
        video.addEventListener('pause', checkAndResumeAudio);
        video.addEventListener('ended', checkAndResumeAudio);
    });

    // Check if all videos are paused before resuming audio
    function checkAndResumeAudio() {
        if (![...videos].some(v => !v.paused)) {
            audio.play().catch(error => console.error("Audio resume failed:", error));
        }
    }
    // Content handler for messages and videos
    function initializeContentHandler(iconId, contentId) {
        const icon = document.getElementById(iconId);
        const content = document.getElementById(contentId);
        const elements = Array.from(content.children);
        const gallery = document.getElementById('gallery'); // Reference to gallery
        let currentIndex = 0;

        // Hide all elements initially
        elements.forEach(el => (el.style.display = 'none'));
        gallery.style.display = 'none'; // Hide gallery initially

        icon.addEventListener('click', () => {
            if (currentIndex < elements.length) {
                const element = elements[currentIndex];
                element.style.display = 'block';
                scrollToCenter(element); // Center the element in the viewport
                currentIndex++;

                // Show the gallery when any content is revealed
                gallery.style.display = 'block';

                // Hide the icon when all content is shown
                if (currentIndex === elements.length) {
                    icon.style.display = 'none';
                }
            }
        });
    }

    // Function to scroll an element to the center of the viewport
    function scrollToCenter(element) {
        const elementRect = element.getBoundingClientRect();
        const offsetTop = elementRect.top + window.scrollY;
        const centerPosition = offsetTop - (window.innerHeight / 2) + (elementRect.height / 2);
        
        window.scrollTo({
            top: centerPosition,
            behavior: 'smooth'
        });
    }

    initializeContentHandler('messages-icon', 'messages-content');
    initializeContentHandler('videos-icon', 'videos-content');

    // Function to animate images in the gallery
    function animateGallery() {
        const gallery = document.getElementById('gallery');
        const images = Array.from(gallery.querySelectorAll('.image'));
        let currentIndex = 0;

        function showNextImage() {
            // Hide all images
            images.forEach(img => (img.style.display = 'none'));

            // Show the current image
            images[currentIndex].style.display = 'block';

            // Move to the next image after 3 seconds
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                showNextImage(); // Recursive call to show the next image
            }, 3000); // 3-second interval
        }
        showNextImage(); // Start the animation
    }
    animateGallery(); // Initialize the gallery animation

    const images = Array.from(document.querySelectorAll('#gallery .image'));
    let currentIndex = 0;

    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledImages = shuffle(images); // Randomize image order

    function showImage(index) {
        // Hide all images
        shuffledImages.forEach(img => (img.style.display = 'none'));
        shuffledImages[index].style.display = 'block';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % shuffledImages.length;
            showImage(currentIndex); // Show the next image
        }, 3000); // Change the image every 3 seconds
    }

    // Start displaying images with the first one
    showImage(currentIndex);
});
