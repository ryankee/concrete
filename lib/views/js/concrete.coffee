$(document).ready ->
    addClick = (job)->
        $(job).click (event)->
            alreadyOpened = $(event.currentTarget).find('div.job_container').hasClass 'open'
            closeAll()
            if not alreadyOpened
                $(event.currentTarget).find('div.job_container').slideDown 'fast'
                $(event.currentTarget).find('div.job_container').addClass 'open'
            return false

    updateJob = (job)->
        id = $(job).find('.job_id').first().html()
        $.get "/job/#{id}", (data)->
            $(job).find('.job_container').first().html(data.log)
            if data.finished
                $(job).find('a img.loader').remove()
                $(job).find('a').first().append CoffeeKup.render outcomeTemplate, job: data
                $('button.build').show()
                return false
            setTimeout ->
                updateJob job
            , 1000
        , 'json'

    outcomeTemplate = ->
        outcomeClass = if @job.failed then '.failure' else '.success'
        div ".outcome#{outcomeClass}", ->
            if @job.failed then '&#10008;&nbsp;failure' else '&#10003;&nbsp;success'

    jobTemplate = ->
        li '.job', ->
            a href: "/job/#{@job._id.toString()}", ->
                d = new Date(@job.addedTime)
                div '.time', -> "#{d.toDateString()} #{d.toTimeString()}"
                div '.job_id', -> "#{@job._id.toString()}"
                img '.loader', src:'images/spinner.gif'
            div '.job_container', ->
                @job.log

    closeAll = ->
        opened = $('li.job').find 'div.job_container.open'
        for container in opened
            $(container).slideUp 'fast'
            $(container).removeClass 'open'

    $('button.build').click (event) ->
        closeAll()
        $('button.build').hide()
        $('li.nojob').hide()
        $.post '/', (data) ->
            if $('ul.jobs').find('li.nojob').length > 0
               $('ul.jobs').find('li.nojob').first().remove()
            job = $('ul.jobs').prepend CoffeeKup.render jobTemplate, job: data
            job = $(job).find('li').first()
            addClick job
            updateJob job
            $(job).find('.job_container').click()
        , 'json'
        return false

    $('li.job').each (iterator, job)->
        addClick job
