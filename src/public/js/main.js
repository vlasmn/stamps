var $gallery;

$(window).on('load', function() {
  $gallery = $('.gallery').imagesLoaded(function() {
    $gallery.isotope({
      itemSelector: '.gallery-item',
      filter: '*',
      percentPosition: true,
      transitionDuration: 0,
      masonry: {
        columnWidth: '.grid-sizer',
      }
    });
  });

  $(window).resize(function() {
    var columns = getColumns();
    var width = $gallery.width();
    var newColumnWidth = (width / columns).toFixed(3);

    $('.grid-sizer, .gallery-item').css({
      'width': newColumnWidth + 'px'
    });

    $gallery.isotope({
      masonry: {
        columnWidth: '.grid-sizer',
      }
    });

    updateIsotope();
  }).resize();

  function getColumns() {
    var windowWidth = $(window).width();
    var columnNumber;

    if (windowWidth > 1440) {
      columnNumber = 6;
    } else if (windowWidth > 1280) {
      columnNumber = 5;
    } else if (windowWidth > 1024) {
      columnNumber = 4;
    } else if (windowWidth > 768) {
      columnNumber = 3;
    } else if (windowWidth > 480) {
      columnNumber = 2;
    } else {
      columnNumber = 1;
    }

    return columnNumber;
  }

  function updateIsotope() {
    $gallery.isotope('layout');
  }

  function initFancyBox() {
    $("[data-fancybox='gallery']").fancybox({
      touch: true,
      arrows: true,
      infobar: false,
      buttons: [
        'download',
        'close'
      ],
      baseClass: 'my-fancybox',
      loop: true,
      clickOutside: true,
      afterLoad: function(instance, current) {
        instance.$refs.bg.css('background', 'rgba(0, 0, 0, 1)');
        instance.$refs.bg.css('opacity', '1');
      },
      beforeClose: function(instance, current) {
        instance.$refs.bg.css('background', 'rgba(0, 0, 0, 0)');
        instance.$refs.bg.css('opacity', '0');
      },
      caption: function(instance, item) {
        return '<a href="' + item.src + '" target="_blank" class="original-link">Оригинал</a>';
      }
    });
  }

  function updateFancyBox() {
    $.fancybox.destroy();
    var visibleImages = $(".emerge:visible a");
    visibleImages.attr("data-fancybox", "visible-gallery");
    visibleImages.fancybox({
      touch: true,
      arrows: true,
      infobar: false,
      buttons: [
        'download',
        'close'
      ],
      baseClass: 'my-fancybox',
      loop: true,
      clickOutside: true,
      afterLoad: function(instance, current) {
        instance.$refs.bg.css('background', 'rgba(0, 0, 0, 1)');
        instance.$refs.bg.css('opacity', '1');
      },
      beforeClose: function(instance, current) {
        instance.$refs.bg.css('background', 'rgba(0, 0, 0, 0)');
        instance.$refs.bg.css('opacity', '0');
      },
      caption: function(instance, item) {
        return '<a href="' + item.src + '" target="_blank" class="original-link">Оригинал</a>';
      }
    });
  }

  document.addEventListener('lazyloaded', function(event) {
    var img = event.target;
    img.src = img.dataset.src;
  });

  $(document).ready(function() {
    initFancyBox();
    var resetButton = document.getElementById('reset-button');
    var noResultsMessage = document.getElementById('no-results-message');
    var filterCount = 16;
    var filterMoreButton = document.getElementById('filter-more-button');
    var filterButtons = document.querySelectorAll('.filter-button');

    if (filterButtons.length > filterCount) {
      for (var i = filterCount; i < filterButtons.length; i++) {
        filterButtons[i].style.display = 'none';
      }
      filterMoreButton.style.display = 'inline-block';
    }

    filterMoreButton.addEventListener('click', function() {
      for (var i = filterCount; i < filterButtons.length; i++) {
        filterButtons[i].style.display = 'inline-block';
      }
      filterMoreButton.style.display = 'none';
    });

    document.querySelectorAll('.filter-button').forEach(function(button) {
      button.addEventListener('click', function() {
        var filterType = this.getAttribute('data-filter-type');
        var filterValue = this.getAttribute('data-filter-value');
        button.classList.toggle('active');
        var activeFilters = {};
        document.querySelectorAll('.filter-button.active').forEach(function(activeButton) {
          var activeFilterType = activeButton.getAttribute('data-filter-type');
          var activeFilterValue = activeButton.getAttribute('data-filter-value');
          if (!activeFilters[activeFilterType]) {
            activeFilters[activeFilterType] = [];
          }
          activeFilters[activeFilterType].push(activeFilterValue);
        });

        var filteredImages = document.querySelectorAll('.emerge');
        var noResults = true;

        filteredImages.forEach(function(imageDiv) {
          var matchesAllFilters = true;
          for (var filterType in activeFilters) {
            if (activeFilters.hasOwnProperty(filterType)) {
              if (filterType === 'category') {
                var imageCategories = imageDiv.getAttribute('data-category').split(', ').map(s => s.trim());
                if (!activeFilters[filterType].some(value => imageCategories.includes(value))) {
                  matchesAllFilters = false;
                  break;
                }
              } else if (filterType === 'country') {
                if (!activeFilters[filterType].includes(imageDiv.getAttribute('data-country'))) {
                  matchesAllFilters = false;
                  break;
                }
              } else if (filterType === 'year') {
                if (!activeFilters[filterType].includes(imageDiv.getAttribute('data-year'))) {
                  matchesAllFilters = false;
                  break;
                }
              }
            }
          }
          if (matchesAllFilters) {
            noResults = false;
            $(imageDiv).show(); // Show the image if it matches all filters
          } else {
            $(imageDiv).hide(); // Hide the image if it doesn't match all filters
          }
        });

        var hasActiveFilters = Object.keys(activeFilters).length > 0;
        resetButton.style.display = hasActiveFilters ? 'block' : 'none';
        noResultsMessage.style.display = noResults ? 'block' : 'none';
        updateFancyBox(); // Update FancyBox after filter changes
        updateIsotope(); // Update Isotope after filter changes
      });
    });

    resetButton.addEventListener('click', function() {
      document.querySelectorAll('.filter-button').forEach(function(button) {
        button.classList.remove('active');
      });
      $('.emerge').show(); // Show all images
      resetButton.style.display = 'none';
      noResultsMessage.style.display = 'none';
      updateFancyBox(); // Update FancyBox after reset
      updateIsotope(); // Update Isotope after reset
    });

    var filteredImages = document.querySelectorAll('.gallery-item');
    var noResults = filteredImages.length === 0;
    noResultsMessage.style.display = noResults ? 'block' : 'none';
    updateFancyBox(); // Update FancyBox after reset
    updateIsotope(); // Update Isotope after reset
  });
});
