document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const colors = extractColors(imageData, 6);
            displayColors(colors);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function extractColors(imageData, numColors) {
    const colorCount = {};
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const rgb = `${data[i]},${data[i+1]},${data[i+2]}`;
        colorCount[rgb] = (colorCount[rgb] || 0) + 1;
    }

    const sortedColors = Object.entries(colorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors)
        .map(item => rgbToHex(item[0]));

    return sortedColors;
}

function rgbToHex(rgb) {
    const [r, g, b] = rgb.split(',').map(Number);
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16).padStart(2, '0');
        return hex;
    }).join('');
}

function displayColors(colors) {
    const container = document.getElementById('colors');
    container.innerHTML = '';

    colors.forEach(color => {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color;
        box.textContent = color;
        box.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert(`Copied ${color} to clipboard!`);
        });
        container.appendChild(box);
    });
}
