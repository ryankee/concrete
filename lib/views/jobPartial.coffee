li '.job', ->
    a href: "#{@baseUrl()}job/#{@job._id.toString()}", ->
        d = new Date(@job.addedTime)
        div '.time', -> "#{d.toDateString()} #{d.toTimeString()}"
        div '.job_id', -> "#{@job._id.toString()}"
        if @job.finished
            outcomeClass = if @job.failed then '.failure' else '.success'
            div ".outcome#{outcomeClass}", ->
                if @job.failed then '&#10008;&nbsp;failure' else '&#10003;&nbsp;success'
    div '.job_container', ->
        @job.log
