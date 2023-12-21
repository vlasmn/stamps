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
    $gallery.addClass('is_ready');
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

function setupFancyBox(selector) {
  $(selector).fancybox({
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
    hash: false, 
    afterLoad: function(instance, current) {
      instance.$refs.bg.css('background', 'rgba(0, 0, 0, 1)');
      instance.$refs.bg.css('opacity', '1');
    },
    afterShow: function(instance, current) {
      history.replaceState(null, null, '#' + current.opts.$orig[0].id);
    },
    beforeClose: function(instance, current) {
      instance.$refs.bg.css('background', 'rgba(0, 0, 0, 0)');
      instance.$refs.bg.css('opacity', '0');
      
      history.replaceState(null, null, '/');
    },
    caption: function(instance, item) {
      return '';
    }
  });
}

function initFancyBox() {
  setupFancyBox("[data-fancybox='gallery'], [data-fancybox='visible-gallery']");

  var $images = $(".gallery__item:visible a img");
  var imagesLoaded = 0;

  $images.each(function() {

    var img = new Image();
    img.onload = function() {
      imagesLoaded++;

      if (imagesLoaded === $images.length) {
        var hash = window.location.hash;
        if (hash) {
          var $imageToOpen = $(hash);
          if ($imageToOpen.length) {
              $imageToOpen.click();
          }
        }
      }
    };
    img.src = $(this).attr('src');
  });
}

function updateFancyBox() {
  $.fancybox.close(true);
  var visibleImages = $(".gallery__item:visible a");
  visibleImages.attr("data-fancybox", "gallery");
  visibleImages.attr("data-fancybox-visible", "visible-gallery");
  setupFancyBox("[data-fancybox='gallery'], [data-fancybox='visible-gallery']");
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

  $('#new-only-checkbox').on('change', function() {
    applyFilters();
  });

  function applyFilters() {
    var onlyNewIsActive = $('#new-only-checkbox').is(':checked');
    var activeFilters = getActiveFilters(onlyNewIsActive);
    filterGalleryItems(activeFilters);
    updateFancyBox();
    updateIsotope();
  }

  function getActiveFilters(onlyNewIsActive) {
    var activeFilters = {};
    document.querySelectorAll('.filter__button.active').forEach(function(activeButton) {
      var activeFilterType = activeButton.getAttribute('data-filter-type');
      var activeFilterValue = activeButton.getAttribute('data-filter-value');
      if (!activeFilters[activeFilterType]) {
        activeFilters[activeFilterType] = [];
      }
      activeFilters[activeFilterType].push(activeFilterValue);
    });

    if (onlyNewIsActive) {
      activeFilters['new'] = ['true'];
    }

    return activeFilters;
  }

  function filterGalleryItems(activeFilters) {
    var filteredImages = document.querySelectorAll('.gallery__item');

    filteredImages.forEach(function(imageDiv) {
      var matchesCategory = false, matchesCountry = false, matchesYear = false;
      var isItemNew = imageDiv.getAttribute('data-is-new') === 'true';
      var isNewOnly = activeFilters['new'] && activeFilters['new'].includes('true');

      for (var filterType in activeFilters) {
        if (activeFilters.hasOwnProperty(filterType)) {
          if (filterType === 'category') {
            var imageCategories = imageDiv.getAttribute('data-category').split(', ').map(s => s.trim());
            matchesCategory = activeFilters[filterType].some(value => imageCategories.includes(value)) || matchesCategory;
          } else if (filterType === 'country') {
            matchesCountry = activeFilters[filterType].includes(imageDiv.getAttribute('data-country')) || matchesCountry;
          } else if (filterType === 'year') {
            matchesYear = activeFilters[filterType].includes(imageDiv.getAttribute('data-year')) || matchesYear;
          }
        }
      }

      var matchesAny = matchesCategory || matchesCountry || matchesYear;

if (!isNewOnly && Object.keys(activeFilters).length === 0) {
      $(imageDiv).show();
    } else if (isNewOnly) {
      if (isItemNew && (matchesAny || Object.keys(activeFilters).length === 1)) {
        $(imageDiv).show();
      } else {
        $(imageDiv).hide();
      }
    } else {
      if (matchesAny) {
        $(imageDiv).show();
      } else {
        $(imageDiv).hide();
      }
    }
  });

    var visibleItems = $('.gallery__item:visible').length;
  if (visibleItems === 0) {
    $('#no-new-items').show();
  } else {
    $('#no-new-items').hide();
  }
  }

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

      var onlyNewIsActive = $('#new-only-checkbox').is(':checked');
      var filteredImages = document.querySelectorAll('.gallery__item');
      var noResults = true;

      filterGalleryItems(activeFilters);
      applyFilters();

      var hasActiveFilters = Object.keys(activeFilters).length > 0
      if (!hasActiveFilters) {
        resetButton.click();
      } else {
        resetButton.style.display = 'block';
        updateFancyBox();
        updateIsotope();
      }
    });
  });

  resetButton.addEventListener('click', function() {
    document.querySelectorAll('.filter__button').forEach(function(button) {
      button.classList.remove('active');
    });
    $('.gallery__item').show();
    resetButton.style.display = 'none';
    $('#new-only-checkbox').prop('checked', false);
    $('#no-new-items').hide();
    updateFancyBox();
    updateIsotope();
  });

  var filteredImages = document.querySelectorAll('.gallery__item');
  updateFancyBox();
  updateIsotope();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.querySelector('.gallery');
  const items = Array.from(gallery.querySelectorAll('.gallery__item'));
  items.forEach(item => gallery.removeChild(item));

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(items);
  items.forEach(item => gallery.appendChild(item));
});