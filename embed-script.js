const colors = {
    black: ['#000000', '#FFFFFF', '#FFFFFF', '#808080', '#D3D3D3'],
    yellow: ['#FFDD00', '#FFCC00', '#FFBB00', '#FFAA00', '#FF9900'],
    blue: ['#00008B', '#1E90FF', '#87CEFA', '#ADD8E6', '#B0E0E6'],
    red: ['#8B0000', '#FF4500', '#FF6347', '#FFA07A', '#FFB6C1'],
    green: ['#006400', '#008000', '#32CD32', '#7CFC00', '#ADFF2F'],
    multi: ['#FF6347', '#FFA07A', '#FFD700', '#ADFF2F', '#1E90FF']
};

function parseOPML(opmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(opmlString, "text/xml");

    function parseOutline(outlineElement, depth = 0) {
        const result = {
            text: outlineElement.getAttribute('text'),
            children: [],
            depth: depth
        };

        const childOutlines = outlineElement.children;
        for (let i = 0; i < childOutlines.length; i++) {
            if (childOutlines[i].tagName === 'outline') {
                result.children.push(parseOutline(childOutlines[i], depth + 1));
            }
        }

        return result;
    }

    const rootOutline = xmlDoc.getElementsByTagName('outline')[0];
    return parseOutline(rootOutline);
}

function renderMindmap(container, data) {
    container.innerHTML = '';
    container.appendChild(createNodeElement(data));
}

function createNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'mindmap-node';
    nodeElement.style.backgroundColor = colors[colorScheme][Math.min(node.depth, colors[colorScheme].length - 1)];

    const nodeContent = document.createElement('div');
    nodeContent.className = 'mindmap-node-content';

    if (node.children.length > 0) {
        const toggle = document.createElement('span');
        toggle.className = 'mindmap-toggle';
        toggle.textContent = '▶';
        nodeContent.appendChild(toggle);
    }

    const text = document.createElement('span');
    text.textContent = node.text;
    nodeContent.appendChild(text);

    nodeElement.appendChild(nodeContent);

    if (node.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'mindmap-children';
        node.children.forEach(child => {
            childrenContainer.appendChild(createNodeElement(child));
        });
        nodeElement.appendChild(childrenContainer);

        nodeElement.addEventListener('click', (e) => {
            e.stopPropagation();
            childrenContainer.classList.toggle('expanded');
            nodeContent.querySelector('.mindmap-toggle').classList.toggle('expanded');
        });
    }

    return nodeElement;
}

(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('key');
    const colorScheme = decodeURIComponent(urlParams.get('color'));

    fetch(`/fetch/${key}`)
        .then(response => response.json())
        .then(result => {
            const data = parseOPML(result.data);
            renderMindmap(document.getElementById('mindmap-container'), data);
        });
})();
