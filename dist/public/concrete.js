(function() {
  $(document).ready(function() {
    var addClick, closeAll, jobTemplate, outcomeTemplate, updateJob;
    addClick = function(job) {
      return $(job).click(function(event) {
        var alreadyOpened;
        alreadyOpened = $(event.currentTarget).find('div.job_container').hasClass('open');
        closeAll();
        if (!alreadyOpened) {
          $(event.currentTarget).find('div.job_container').slideDown('fast');
          $(event.currentTarget).find('div.job_container').addClass('open');
        }
        return false;
      });
    };
    updateJob = function(job) {
      var id;
      id = $(job).find('.job_id').first().html();
      return $.get("/job/" + id, function(data) {
        $(job).find('.job_container').first().html(data.log);
        if (data.finished) {
          $(job).find('a img.loader').remove();
          $(job).find('a').first().append(CoffeeKup.render(outcomeTemplate, {
            job: data
          }));
          $('button.build').show();
          return false;
        }
        return setTimeout(function() {
          return updateJob(job);
        }, 1000);
      }, 'json');
    };
    outcomeTemplate = function() {
      var outcomeClass;
      outcomeClass = this.job.failed ? '.failure' : '.success';
      return div(".outcome" + outcomeClass, function() {
        if (this.job.failed) {
          return '&#10008;&nbsp;failure';
        } else {
          return '&#10003;&nbsp;success';
        }
      });
    };
    jobTemplate = function() {
      return li('.job', function() {
        a({
          href: "/job/" + (this.job._id.toString())
        }, function() {
          var d;
          d = new Date(this.job.addedTime);
          div('.time', function() {
            return "" + (d.toDateString()) + " " + (d.toTimeString());
          });
          div('.job_id', function() {
            return "" + (this.job._id.toString());
          });
          return img('.loader', {
            src: 'images/spinner.gif'
          });
        });
        return div('.job_container', function() {
          return this.job.log;
        });
      });
    };
    closeAll = function() {
      var container, opened, _i, _len, _results;
      opened = $('li.job').find('div.job_container.open');
      _results = [];
      for (_i = 0, _len = opened.length; _i < _len; _i++) {
        container = opened[_i];
        $(container).slideUp('fast');
        _results.push($(container).removeClass('open'));
      }
      return _results;
    };
    $('button.build').click(function(event) {
      closeAll();
      $('button.build').hide();
      $('li.nojob').hide();
      $.post('/', function(data) {
        var job;
        if ($('ul.jobs').find('li.nojob').length > 0) {
          $('ul.jobs').find('li.nojob').first().remove();
        }
        job = $('ul.jobs').prepend(CoffeeKup.render(jobTemplate, {
          job: data
        }));
        job = $(job).find('li').first();
        addClick(job);
        updateJob(job);
        return $(job).find('.job_container').click();
      }, 'json');
      return false;
    });
    return $('li.job').each(function(iterator, job) {
      return addClick(job);
    });
  });

}).call(this);
