function renderView() {
  return patch.project.getRootPath().then(function(rootPath) {
    return patch.exec('find "' + rootPath + '" -type f 2>/dev/null | head -5000').then(function(files) {
      var fileList = files.trim().split('\n').filter(Boolean);
      var totalFiles = fileList.length;
      return patch.exec('wc -l $(find "' + rootPath + '" -type f 2>/dev/null | head -5000) 2>/dev/null | tail -1').then(function(lineOutput) {
        var totalLines = lineOutput.trim().split(/\s+/)[0] || '--';
        var bars = '';
        var exts = {};
        fileList.forEach(function(f) {
          var parts = f.split('.');
          var ext = parts.length > 1 ? parts[parts.length - 1] : '(no ext)';
          exts[ext] = (exts[ext] || 0) + 1;
        });
        var sorted = Object.entries(exts).sort(function(a, b) { return b[1] - a[1]; });
        var maxCount = sorted.length > 0 ? sorted[0][1] : 1;
        sorted.slice(0, 10).forEach(function(entry) {
          var w = (entry[1] / maxCount * 100).toFixed(0);
          bars += '<div style="display:flex;align-items:center;gap:6px;margin:2px 0">' +
            '<span style="width:60px;font-size:11px;color:#8b949e;text-align:right;flex-shrink:0">.' + entry[0] + '</span>' +
            '<div style="flex:1;height:6px;background:#21262d;border-radius:3px;overflow:hidden">' +
            '<div style="width:' + w + '%;height:100%;background:#58a6ff;border-radius:3px"></div>' +
            '</div>' +
            '<span style="width:30px;font-size:11px;color:#e6edf3;text-align:right;flex-shrink:0">' + entry[1] + '</span>' +
            '</div>';
        });
        return '<div style="padding:8px 12px">' +
          '<div style="display:flex;gap:16px;margin-bottom:12px">' +
          '<div style="flex:1;text-align:center;padding:8px;background:#161b22;border-radius:6px">' +
          '<div style="font-size:20px;font-weight:700;color:#e6edf3">' + totalFiles + '</div>' +
          '<div style="font-size:11px;color:#8b949e">Files</div></div>' +
          '<div style="flex:1;text-align:center;padding:8px;background:#161b22;border-radius:6px">' +
          '<div style="font-size:20px;font-weight:700;color:#e6edf3">' + totalLines + '</div>' +
          '<div style="font-size:11px;color:#8b949e">Lines</div></div>' +
          '</div>' +
          (bars ? '<div style="font-size:11px;color:#8b949e;margin-bottom:6px">Extensions</div>' + bars : '') +
          '</div>';
      });
    });
  });
}

var icon = '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">' +
  '<path d="M2 1.5A1.5 1.5 0 013.5 0h5.672a1.5 1.5 0 011.06.44l3.328 3.328A1.5 1.5 0 0114 4.828V14.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 14.5v-13zM3.5 1a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V5h-3a1 1 0 01-1-1V1H3.5z"/>' +
  '</svg>';

patch.ui.registerSidebarView('file-counter', 'File Counter', icon, function() {
  return renderView();
});
