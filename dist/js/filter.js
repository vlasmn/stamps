document.addEventListener('DOMContentLoaded', function() {
    var filterButtons = document.querySelectorAll('.filter-button');
    var galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var filterType = this.getAttribute('data-filter-type');
        var filterValue = this.getAttribute('data-filter-value');

        galleryItems.forEach(function(item) {
          if (item.getAttribute('data-' + filterType) === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
