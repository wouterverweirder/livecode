(function(){

	var editor = [],
		previewElement,
		consoleElement,
		toolbarElement;

	var editors = [];
	var previewElement, consoleElement;

	function init(){
		console.log('[mainframe] init');
		previewElement = document.querySelector('.preview');
		consoleElement = document.querySelector('.console');
		toolbarElement = document.querySelector('.toolbar');
		window.addEventListener("message", receiveMessage, false);
	}

	function receiveMessage(message) {
		switch(message.data.type) {
			case 'innerHTML':
				document.querySelector('.editors').innerHTML = message.data.innerHTML;
				createEditors();
				document.querySelector('.run').addEventListener('click', run);
				break;
			case 'console.log':
				consoleElement.innerHTML += message.data.arguments.join('<br />') + '<br />';
				consoleElement.scrollTop = consoleElement.scrollHeight;
				break;
		}
	}

	function createEditors() {
		var blocks = document.querySelectorAll('pre code');
		var toolbarTabList = toolbarElement.querySelector('ul');
		[].forEach.call(blocks, function(el){
			var editor = new Editor(el);
			editors.push(editor);

			var tab = document.createElement('li');
			var tabLink = document.createElement('a');
			tabLink.setAttribute('href', '#');
			var tabLinkText = document.createTextNode(editor.title);
			tabLink.appendChild(tabLinkText)
			tab.appendChild(tabLink);
			toolbarTabList.appendChild(tab);

			tabLink.addEventListener('click', function(event){
				event.preventDefault();
				setActiveTab(tabLink.innerHTML);
			});

			editor.tabLink = tabLink;
  	});
  	if(blocks.length > 0) {
  		setActiveTab(editors[0].title);
  	}
	}

	function setActiveTab(tabTitle) {
		editors.forEach(function(editor){
			editor.el.style.display = (editor.title === tabTitle) ? 'block' : 'none';
			editor.tabLink.classList.toggle('selected', (editor.title === tabTitle));
		});
	}

	function getEditorByTitle(title) {
		for(var i = 0; i < editors.length; i++) {
			if(editors[i].title === title) {
				return editors[i];
			}
		}
		return null;
	}

	function Editor(el) {
		var mode;
		this.title = '';
		if(el.classList.contains('html')) {
			mode = 'htmlmixed';
			this.title = 'html';
		}
		if(el.classList.contains('javascript')) {
			mode = 'javascript';
			this.title = 'js';
		}
		if(el.classList.contains('css')) {
			mode = 'css';
			this.title = 'css';
		}
		//replace it with a textarea inside wrapper
		var wrapper = document.createElement('div');
		wrapper.classList.add('editor');
		var textarea = document.createElement('textarea');
		textarea.innerHTML = el.innerHTML;
		wrapper.appendChild(textarea);
		el.parentNode.parentNode.replaceChild(wrapper, el.parentNode);
		//codemirror
		this.codeMirror = CodeMirror.fromTextArea(textarea, {
			lineNumbers: true,
			mode: mode
		});
		this.el = wrapper;
	}

	function run() {
		previewElement.innerHTML = '';

		var previewFrame = document.createElement('iframe');
		previewElement.appendChild(previewFrame);

		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;

    preview.open();

    preview.write('<script>');
    preview.write('console.log = function(){');
    preview.write('parent.postMessage({type: \'console.log\', arguments: Array.prototype.slice.call(arguments)}, \'*\');');
    preview.write('};');
    preview.write('</script>');

    var htmlEditor = getEditorByTitle('html');
    if(htmlEditor) {
    	preview.write(htmlEditor.codeMirror.getValue());
    }
    var cssEditor = getEditorByTitle('css');
    if(cssEditor) {
    	preview.write('<style>' + cssEditor.codeMirror.getValue() + '</style>');
    }
    var jsEditor = getEditorByTitle('js');
    if(jsEditor) {
    	preview.write('<script>' + jsEditor.codeMirror.getValue() + '</script>');
    }

    preview.close();
	}

	init();

})();