const menuButton = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

function toggleMenu() {
    navLinks.classList.toggle('hide');
}

menuButton.addEventListener('click', toggleMenu);


function handleResize() {
    if (window.innerWidth > 1000) {
        navLinks.classList.remove('hide');
    } else {
        navLinks.classList.add('hide');
    }
}

window.addEventListener('resize', handleResize);
handleResize();

function viewerTemplate(imagePath, altText) {
    return `
        <div class="viewer">
            <button class="close-viewer">X</button>
            <img src="${imagePath}" alt="${altText}">
        </div>`;
}

function viewHandler(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'IMG') {
        const imgSrc = clickedElement.src.split('-sm')[0] + '-full.jpeg'; // Assuming you have '-full' versions for the images
        const altText = clickedElement.alt;


        const existingViewer = document.querySelector('.viewer');
        if (existingViewer) {
            existingViewer.remove();
        }


        document.body.insertAdjacentHTML('afterbegin', viewerTemplate(imgSrc, altText));
    }
}

function closeViewer() {
    const viewer = document.querySelector('.viewer');
    if (viewer) {
        viewer.remove();
    }
}

const gallery = document.querySelector('.gallery');
gallery.addEventListener('click', viewHandler);

document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('close-viewer')) {
        closeViewer();
    }
});
