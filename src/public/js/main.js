var $gallery;

$(window).on('load', function() {
  $gallery = $('.gallery').imagesLoaded(function() {
    $gallery.isotope({
      itemSelector: '.gallery__item',
      filter: '*',
      percentPosition: true,
      transitionDuration: 0,
      masonry: {
        columnWidth: '.grid_sizer',
      }
    });
  });

  $(window).resize(function() {
    var columns = getColumns();
    var width = $gallery.width();
    var newColumnWidth = (width / columns).toFixed(3);

    $('.grid_sizer, .gallery__item').css({
      'width': newColumnWidth + 'px'
    });

    $gallery.isotope({
      masonry: {
        columnWidth: '.grid_sizer',
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
    } else if (windowWidth > 365) {
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
        return '';
      }
    });
  }

  function updateFancyBox() {
    $.fancybox.destroy();
    var visibleImages = $(".gallery__item:visible a");
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
        return '';
      }
    });
  }

  document.addEventListener('lazyloaded', function(event) {
    var img = event.target;
    img.src = img.dataset.src;
  });

  $(document).ready(function() {
    initFancyBox();
    var resetButton = document.getElementById('filter__reset');
    var filterCount = 16;
    var filterMoreButton = document.getElementById('filter__more');
    var filterButtons = document.querySelectorAll('.filter__button');

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

    document.querySelectorAll('.filter__button').forEach(function(button) {
      button.addEventListener('click', function() {
        var filterType = this.getAttribute('data-filter-type');
        var filterValue = this.getAttribute('data-filter-value');
        button.classList.toggle('active');
        var activeFilters = {};
        document.querySelectorAll('.filter__button.active').forEach(function(activeButton) {
          var activeFilterType = activeButton.getAttribute('data-filter-type');
          var activeFilterValue = activeButton.getAttribute('data-filter-value');
          if (!activeFilters[activeFilterType]) {
            activeFilters[activeFilterType] = [];
          }
          activeFilters[activeFilterType].push(activeFilterValue);
        });

        var filteredImages = document.querySelectorAll('.gallery__item');
        var noResults = true;

        filteredImages.forEach(function(imageDiv) {
          var matchesAnyFilter = false;
          for (var filterType in activeFilters) {
            if (activeFilters.hasOwnProperty(filterType)) {
              if (filterType === 'category') {
                var imageCategories = imageDiv.getAttribute('data-category').split(', ').map(s => s.trim());
                if (activeFilters[filterType].some(value => imageCategories.includes(value))) {
                  matchesAnyFilter = true;
                  break;
                }
              } else if (filterType === 'country') {
                if (activeFilters[filterType].includes(imageDiv.getAttribute('data-country'))) {
                  matchesAnyFilter = true;
                  break;
                }
              } else if (filterType === 'year') {
                if (activeFilters[filterType].includes(imageDiv.getAttribute('data-year'))) {
                  matchesAnyFilter = true;
                  break;
                }
              }
            }
          }
          if (matchesAnyFilter) {
            $(imageDiv).show(); // Show the image if it matches any filter
          } else {
            $(imageDiv).hide(); // Hide the image if it doesn't match any filter
          }
        });

        var hasActiveFilters = Object.keys(activeFilters).length > 0
        if (!hasActiveFilters) {
          // Если активных фильтров нет, симулируем клик на кнопку "Сбросить"
          resetButton.click();
        } else {
          resetButton.style.display = 'block';
          updateFancyBox(); // Update FancyBox after filter changes
          updateIsotope(); // Update Isotope after filter changes
        }
      });
    });

    resetButton.addEventListener('click', function() {
      document.querySelectorAll('.filter__button').forEach(function(button) {
        button.classList.remove('active');
      });
      $('.gallery__item').show(); // Show all images
      resetButton.style.display = 'none';
      updateFancyBox(); // Update FancyBox after reset
      updateIsotope(); // Update Isotope after reset
    });

    var filteredImages = document.querySelectorAll('.gallery__item');
    updateFancyBox(); // Update FancyBox after reset
    updateIsotope(); // Update Isotope after reset
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.querySelector('.gallery');
  const items = Array.from(gallery.querySelectorAll('.gallery__item'));
  items.forEach(item => gallery.removeChild(item));

  // Функция для перемешивания массива
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Перемешиваем и вставляем элементы обратно в галерею
  shuffleArray(items);
  items.forEach(item => gallery.appendChild(item));
});
