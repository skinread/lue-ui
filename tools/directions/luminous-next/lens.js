// The lens: SVG displacement through backdrop-filter renders only in Chromium, and an engine that parses url() there
// but can't render it would drop the whole filter, so data-lens is set only where it is known to work. Nothing else
// on the page needs script.
if ('userAgentData' in navigator && navigator.userAgentData.brands.some((b) => b.brand === 'Chromium')) {
  document.documentElement.dataset.lens = '';
}
