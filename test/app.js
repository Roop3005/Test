
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const homeBtn = document.getElementById('home-btn');
    const breadcrumbContainer = document.getElementById('breadcrumb-container');

    // Configuration directly in the file
    const config = {
        canvasStyle: {
            font: "16px Arial"
        },
        layers: [
            {
                name: "Continents",
                backgroundColor: "#d3d3d3",
                nodes: [
                    { "id": "na", "label": "North America", "color": "#ff9a8b", "x": 150, "y": 200, "width": 200, "height": 150 },
                    { "id": "eu", "label": "Europe", "color": "#86e3ce", "x": 500, "y": 250, "width": 180, "height": 120 }
                ]
            },
            {
                name: "Countries",
                nodes: [
                    { "parentId": "na", "id": "usa", "label": "USA", "color": "#f9c2a0", "x": 100, "y": 150, "width": 120, "height": 80 },
                    { "parentId": "na", "id": "canada", "label": "Canada", "color": "#a0c4f9", "x": 300, "y": 100, "width": 110, "height": 70 },
                    { "parentId": "eu", "id": "germany", "label": "Germany", "color": "#c7b3e5", "x": 450, "y": 200, "width": 100, "height": 60 },
                    { "parentId": "eu", "id": "france", "label": "France", "color": "#f3b3e5", "x": 600, "y": 300, "width": 100, "height": 60 }
                ]
            },
            {
                name: "Cities",
                nodes: [
                    { "parentId": "usa", "id": "nyc", "label": "New York", "color": "#f7d5b8", "x": 120, "y": 180, "width": 80, "height": 40 },
                    { "parentId": "canada", "id": "toronto", "label": "Toronto", "color": "#b8d8f7", "x": 320, "y": 130, "width": 80, "height": 40 },
                    { "parentId": "germany", "id": "berlin", "label": "Berlin", "color": "#d9cceb", "x": 470, "y": 230, "width": 70, "height": 35 },
                    { "parentId": "france", "id": "paris", "label": "Paris", "color": "#f7cceb", "x": 620, "y": 330, "width": 70, "height": 35 }
                ]
            }
        ]
    };

    let currentLayerIndex = 0;
    let navigationHistory = [];
    let panOffset = { x: 0, y: 0 };
    let scale = 1;
    let isAnimating = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function init() {
        if (config && config.layers && config.layers.length > 0) {
            const initialLayer = config.layers[0];
            navigationHistory.push({
                layerIndex: 0,
                backgroundColor: initialLayer.backgroundColor,
                nodes: initialLayer.nodes
            });
            draw();
        } else {
            console.error("Configuration is missing layers or is not properly defined.");
        }
    }

    function drawLayer(layerData, opacity = 1) {
        if (!layerData) return;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = layerData.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.translate(panOffset.x, panOffset.y);
        ctx.scale(scale, scale);

        const nodes = layerData.nodes || [];
        nodes.forEach(node => {
            ctx.fillStyle = node.color;
            ctx.fillRect(node.x, node.y, node.width, node.height);
            ctx.fillStyle = '#000';
            ctx.font = config.canvasStyle.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x + node.width / 2, node.y + node.height / 2);
        });

        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentLayerData = navigationHistory[navigationHistory.length - 1];
        drawLayer(currentLayerData);
        updateBreadcrumbs();
    }

    function animateTransition(oldLayerData, newLayerData, duration = 500) {
        isAnimating = true;
        let startTime = null;

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fade out old layer
            drawLayer(oldLayerData, 1 - progress);

            // Fade in new layer
            drawLayer(newLayerData, progress);

            if (progress < 1) {
                requestAnimationFrame(animationStep);
            } else {
                isAnimating = false;
                panOffset = { x: 0, y: 0 };
                scale = 1;
                draw();
            }
        }

        requestAnimationFrame(animationStep);
    }

    function getClickedNode(x, y) {
        const currentLayerData = navigationHistory[navigationHistory.length - 1];
        if (!currentLayerData || !currentLayerData.nodes) return null;
        
        const transformedX = (x - panOffset.x) / scale;
        const transformedY = (y - panOffset.y) / scale;

        return currentLayerData.nodes.find(node =>
            transformedX >= node.x && transformedX <= node.x + node.width &&
            transformedY >= node.y && transformedY <= node.y + node.height
        );
    }

    function zoomIn(targetNode) {
        if (isAnimating) return;
        const nextLayerIndex = currentLayerIndex + 1;
        if (nextLayerIndex >= config.layers.length) return;

        const nextLayer = config.layers[nextLayerIndex];
        const childNodes = nextLayer.nodes.filter(node => node.parentId === targetNode.id);

        if (childNodes.length > 0) {
            const oldLayerData = navigationHistory[navigationHistory.length - 1];
            currentLayerIndex = nextLayerIndex;
            const newLayerData = {
                layerIndex: currentLayerIndex,
                backgroundColor: targetNode.color,
                nodes: childNodes
            };
            navigationHistory.push(newLayerData);
            animateTransition(oldLayerData, newLayerData);
        }
    }

    function zoomOut() {
        if (isAnimating || navigationHistory.length <= 1) return;

        const oldLayerData = navigationHistory.pop();
        const newLayerData = navigationHistory[navigationHistory.length - 1];
        currentLayerIndex = newLayerData.layerIndex;
        animateTransition(oldLayerData, newLayerData);
    }

    function goHome() {
        if (isAnimating || navigationHistory.length <= 1) return;

        const oldLayerData = navigationHistory[navigationHistory.length - 1];
        navigationHistory = [navigationHistory[0]];
        const newLayerData = navigationHistory[0];
        currentLayerIndex = 0;
        animateTransition(oldLayerData, newLayerData);
    }

    function goToLayer(historyIndex) {
        if (isAnimating || historyIndex >= navigationHistory.length - 1) return;

        const oldLayerData = navigationHistory[navigationHistory.length - 1];
        navigationHistory = navigationHistory.slice(0, historyIndex + 1);
        const newLayerData = navigationHistory[historyIndex];
        currentLayerIndex = newLayerData.layerIndex;
        animateTransition(oldLayerData, newLayerData);
    }

    function updateBreadcrumbs() {
        breadcrumbContainer.innerHTML = '';
        navigationHistory.forEach((layerData, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'breadcrumb-bubble';
            bubble.style.backgroundColor = layerData.backgroundColor;
            bubble.title = config.layers[layerData.layerIndex].name;
            bubble.addEventListener('click', () => goToLayer(index));
            breadcrumbContainer.appendChild(bubble);
        });
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clickedNode = getClickedNode(x, y);
        if (clickedNode) {
            zoomIn(clickedNode);
        }
    });

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        zoomOut();
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isAnimating) return;

        if (e.deltaY < 0) { // Scroll up
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const hoveredNode = getClickedNode(x, y);
            if (hoveredNode) {
                zoomIn(hoveredNode);
            }
        } else { // Scroll down
            zoomOut();
        }
    });

    homeBtn.addEventListener('click', goHome);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (!isAnimating) {
            draw();
        }
    });

    init();
});
