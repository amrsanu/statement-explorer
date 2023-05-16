function toggle(source) {
    var checkboxes = document.getElementsByName('statement_file');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
}
