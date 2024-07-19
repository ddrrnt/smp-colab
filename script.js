document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('input-area');
    const generateBtn = document.getElementById('generate-btn');
    const mindmapContainer = document.getElementById('mindmap-container');
    
    const colorScheme = ['#FFA500', '#90EE90', '#ADD8E6', '#FFFFE0'];

    generateBtn.addEventListener('click', generateMindmap);

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
        nodeElement.style.backgroundColor = colorScheme[depth % colorScheme.length];
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

    function generateMindmap() {
        const input = inputArea.value.trim();
        if (input.startsWith('<?xml') || input.startsWith('<opml')) {
            const data = parseOPML(input);
            renderMindmap(data);
        } else {
            alert('Please provide valid OPML input.');
        }
    }
});
