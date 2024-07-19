document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('input-area');
    const generateBtn = document.getElementById('generate-btn');
    const compressBtn = document.getElementById('compress-btn');
    const mindmapContainer = document.getElementById('mindmap-container');
    const compressionSection = document.getElementById('compression-section');
    const compressedData = document.getElementById('compressed-data');
    const embedBtn = document.getElementById('embed-btn');
    const gistUrlInput = document.getElementById('gist-url-input');
    const embedCode = document.getElementById('embed-code');

    const colorScheme = ['#FFA500', '#90EE90', '#ADD8E6', '#FFFFE0'];
    let lastClickedNode = null;

    generateBtn.addEventListener('click', generateMindmap);
    compressBtn.addEventListener('click', compressOPML);
    embedBtn.addEventListener('click', generateEmbedCode);

    function generateMindmap() {
        const input = inputArea.value.trim();
        if (input.startsWith('<?xml') || input.startsWith('<opml')) {
            const data = parseOPML(input);
            renderMindmap(data);
        } else {
            alert('Please provide valid OPML input.');
        }
    }

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
                if (lastClickedNode) {
                    lastClickedNode.classList.remove('clicked');
                }
                this.classList.add('clicked');
                lastClickedNode = this;

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

    function compressOPML() {
        console.log("compressOPML function called");
        const opmlString = inputArea.value.trim();
        console.log("OPML string:", opmlString);
        const compressedOPML = btoa(encodeURIComponent(opmlString));
        console.log("Compressed OPML:", compressedOPML);
        compressedData.value = compressedOPML;
        compressionSection.style.display = 'block';
        console.log("Compression section should now be visible");
    }

   function generateEmbedCode() {
    const gistUrl = gistUrlInput.value.trim();
    if (!gistUrl) {
        alert('Please enter the Gist URL');
        return;
    }
    
    console.log('Gist URL:', gistUrl); // New log
    const encodedUrl = encodeURIComponent(gistUrl);
    const embedUrl = `https://ddrrnt.github.io/smp-colab/embed.html?gist=${encodedUrl}`;
    console.log('Embed URL:', embedUrl); // New log
    embedCode.value = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0"></iframe>`;
    embedCode.style.display = 'block';
}
});
