document.addEventListener('DOMContentLoaded', function() {
  if (window.location !== window.parent.location) {	  
    // The page is in an iframe	
    return;
  }  
  
  // Inject styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    /* Override all the gallery section style */
    .gallery-placeholder * {
      background: inherit;
    }
    .gallery-placeholder .gallery-section {
      padding-top: 0 !important;
      min-height: inherit !important;
    }
    .gallery-placeholder .gallery-section .gallery-grid,
    .gallery-placeholder .gallery-section .gallery-reel {
      padding: 0 !important;
    }
    .gallery-placeholder .section-background {
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Process gallery placeholders
  var galleries = document.querySelectorAll(".gallery-placeholder");	
  for (var i = 0; i < galleries.length; i++) {
    galleries[i].innerHTML = "";
    var target = galleries[i].getAttribute("data-target");
    if (document.querySelector(target)) {
      galleries[i].appendChild(document.querySelector(target));
    }
  }	
});
