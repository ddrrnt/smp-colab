document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('input-area');
    const generateBtn = document.getElementById('generate-btn');
    const mindmapContainer = document.getElementById('mindmap-container');
    const colorOptions = document.querySelectorAll('.color-options button');
    const embedBtn = document.getElementById('embed-btn');
    const embedCode = document.getElementById('embed-code');
    let currentColorScheme = 'multi';

    const colorSchemes = {
        black: ['#000000', '#FFFFFF', '#808080', '#D3D3D3', '#F5F5F5'],
        yellow: ['#FFDD00', '#FFCC00', '#FFBB00', '#FFAA00', '#FF9900'],
        blue: ['#00008B', '#1E90FF', '#87CEFA', '#ADD8E6', '#B0E0E6'],
        red: ['#8B0000', '#FF4500', '#FF6347', '#FFA07A', '#FFB6C1'],
        green: ['#006400', '#008000', '#32CD32', '#7CFC00', '#ADFF2F'],
        multi: ['#FF6347', '#FFA07A', '#FFD700', '#ADFF2F', '#1E90FF']
    };

    colorOptions.forEach(button => {
        button.addEventListener('click', () => {
            currentColorScheme = button.dataset.color;
            applyColors();
        });
    });

    embedBtn.addEventListener('click', () => {
        const input = inputArea.value.trim();
        const embedUrl = `embed.html?data=${encodeURIComponent(input)}&color=${encodeURIComponent(currentColorScheme)}`;
        const iframeCode = `<iframe src="${embedUrl}" width="600" height="400" style="border:none;"></iframe>`;
        embedCode.value = iframeCode;
        embedCode.style.display = 'block';
    });

    function parseOPML(opmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(opmlString, "text/xml");
        function parseOutline(outlineElement) {
            const result = {
                title: outlineElement.getAttribute('text'),
                children: []
            };
            const childOutlines = outlineElement.children;
            for (let i = 0; i < childOutlines.length; i++) {
                if (childOutlines[i].tagName === 'outline') {
                    result.children.push(parseOutline(childOutlines[i]));
                }
            }
            return result;
        }
        const rootOutline = xmlDoc.getElementsByTagName('outline')[0];
        return parseOutline(rootOutline);
    }

    function renderMindmap(data) {
        mindmapContainer.innerHTML = '';
        const firstColumn = createColumn();
        renderNodes(data, firstColumn, 0);
        mindmapContainer.appendChild(firstColumn);
        applyColors();
    }

    function createColumn() {
        const column = document.createElement('div');
        column.className = 'mindmap-column';
        return column;
    }

    function renderNodes(node, column, depth) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'mindmap-node';
        nodeElement.innerHTML = `<h3>${node.title}</h3>`;
        nodeElement.style.color = depth < 2 && currentColorScheme === 'black' ? '#FFFFFF' : '#000000';
        column.appendChild(nodeElement);
        if (node.children && node.children.length > 0) {
            nodeElement.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                let nextColumn = column.nextElementSibling;
                if (!nextColumn || nextColumn.dataset.depth != depth + 1) {
                    nextColumn = createColumn();
                    nextColumn.dataset.depth = depth + 1;
                    mindmapContainer.insertBefore(nextColumn, column.nextElementSibling);
                }
                nextColumn.innerHTML = '';
                if (this.classList.contains('active')) {
                    node.children.forEach(child => renderNodes(child, nextColumn, depth + 1));
                }
                let columnToRemove = nextColumn.nextElementSibling;
                while (columnToRemove) {
                    const nextColumnToRemove = columnToRemove.nextElementSibling;
                    mindmapContainer.removeChild(columnToRemove);
                    columnToRemove = nextColumnToRemove;
                }
            });
        }
    }

    function applyColors() {
        const nodes = document.querySelectorAll('.mindmap-node');
        nodes.forEach((node) => {
            const depth = node.closest('.mindmap-column').dataset.depth || 0;
            const bgColor = colorSchemes[currentColorScheme][depth % colorSchemes[currentColorScheme].length];
            node.style.backgroundColor = bgColor;

            if (currentColorScheme === 'black') {
                if (depth === 0) {
                    node.style.color = '#FFFFFF';
                } else if (depth === 1) {
                    node.style.color = '#FFFFFF';
                } else if (depth === 2) {
                    node.style.backgroundColor = '#808080';
                } else if (depth === 3) {
                    node.style.backgroundColor = '#D3D3D3';
                }
            }
        });
    }

    function generateMindmap() {
        const input = inputArea.value.trim();
        if (input.startsWith('<?xml') || input.startsWith('<opml')) {
            const data = parseOPML(input);
            renderMindmap(data);
        } else {
            alert('Please provide valid OPML input.');
        }
    }

    generateBtn.addEventListener('click', generateMindmap);

    // Initial render with default colors
    applyColors();
});
