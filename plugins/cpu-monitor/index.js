var cpuData = { usage: '--', cores: [], error: '' };

function parseCpuUsage(text) {
  var lines = String(text).trim().split('\n');
  var result = { usage: '--', cores: [], error: '' };
  for (var i = 0; i < lines.length; i++) {
    var parts = lines[i].trim().split(/\s+/);
    if (!parts[0] || parts[0].indexOf('cpu') !== 0) continue;

    var idle = parseInt(parts[4], 10);
    var total = 0;
    for (var j = 1; j < parts.length; j++) total += parseInt(parts[j], 10) || 0;

    var percent = total > 0 ? ((1 - idle / total) * 100).toFixed(1) : '--';
    if (parts[0] === 'cpu') result.usage = percent;
    else result.cores.push(percent);
  }
  return result;
}

function repaint() {
  if (patch.ui && typeof patch.ui.refresh === 'function') patch.ui.refresh();
}

function refresh() {
  return patch.fs.readFile('/proc/stat').then(function(text) {
    cpuData = parseCpuUsage(text);
    repaint();
  }).catch(function() {
    cpuData = { usage: '--', cores: [], error: 'CPU stats are only available on Linux.' };
    repaint();
  });
}

function renderView() {
  if (cpuData.error) {
    return '<div style="padding:12px;color:#8b949e;font-size:12px">' + cpuData.error + '</div>';
  }

  var bars = cpuData.cores.map(function(pct, i) {
    var w = Math.min(parseFloat(pct) || 0, 100);
    return '<div style="display:flex;align-items:center;gap:6px;margin:3px 0">' +
      '<span style="width:32px;font-size:11px;color:#8b949e;flex-shrink:0">CPU' + i + '</span>' +
      '<div style="flex:1;height:8px;background:#21262d;border-radius:4px;overflow:hidden">' +
      '<div style="width:' + w + '%;height:100%;background:' + (w > 80 ? '#f85149' : w > 50 ? '#d29922' : '#3fb950') + ';border-radius:4px;transition:width 0.5s"></div>' +
      '</div>' +
      '<span style="width:40px;font-size:11px;color:#e6edf3;text-align:right;flex-shrink:0">' + pct + '%</span>' +
      '</div>';
  }).join('');

  return '<div style="padding:8px 12px">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
    '<span style="font-size:13px;font-weight:600;color:#e6edf3">CPU Usage</span>' +
    '<span style="font-size:18px;font-weight:700;color:' + (parseFloat(cpuData.usage) > 80 ? '#f85149' : parseFloat(cpuData.usage) > 50 ? '#d29922' : '#3fb950') + '">' + cpuData.usage + '%</span>' +
    '</div>' +
    bars +
    '</div>';
}

var cpuIcon = '<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">' +
  '<path d="M4 2a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H4zm0 1h8v10H4V3zm1.5 2a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-5zM6 6h4v4H6V6z"/>' +
  '<path d="M6.5 1a.5.5 0 01.5.5V2h2v-.5a.5.5 0 011 0V2h1.25a.75.75 0 01.75.75V4h.75a.5.5 0 010 1H14v2h.5a.5.5 0 010 1H14v2h.5a.5.5 0 010 1H14v1.25a.75.75 0 01-.75.75H12v.5a.5.5 0 01-1 0V14H9v.5a.5.5 0 01-1 0V14H6v.5a.5.5 0 01-1 0V14H3.75a.75.75 0 01-.75-.75V12h-.5a.5.5 0 010-1H3V9h-.5a.5.5 0 010-1H3V6h-.5a.5.5 0 010-1H3V3.75A.75.75 0 013.75 3H5v-.5a.5.5 0 01.5-.5H6v-.5a.5.5 0 01.5-.5z"/>' +
  '</svg>';

patch.commands.register('cpu-monitor.refresh', 'CPU Monitor: Refresh', function() {
  refresh();
});

patch.ui.registerSidebarView('cpu-monitor', 'CPU Monitor', cpuIcon, function() {
  return renderView();
});

if (window.__patchCpuMonitorTimer) clearInterval(window.__patchCpuMonitorTimer);
window.__patchCpuMonitorTimer = setInterval(refresh, 2000);
refresh();
