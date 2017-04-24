//========================================================================
//Begin all initial scripts
//========================================================================
(($, window, document) => {
	'use strict';

  $('#mainForm').submit(function( event ) {

    event.preventDefault();

    let textAreaHtml = document.getElementById('cssStylesArea');
    alert(textAreaHtml.value);

    //document.getElementsByTagName('body')[0].removeChild(styles);

    let styles = document.createElement('style');
    styles.type = 'text/stylesheet';
    styles.id = 'blinkSTyles';
    styles.innerHTML = '';
    styles.innerHTML = textAreaHtml.value;
    document.getElementsByTagName('body')[0].appendChild(styles);
  });

})(jQuery, window, document);
//========================================================================
//end all initial scripts
//========================================================================