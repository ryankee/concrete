doctype 5
html ->
    head ->
        meta charset: 'utf-8'
        title "#{if @title then @title+' - ' else ''}Concrete"
        meta(name: 'description', content: @desc) if @desc?
        link rel: 'stylesheet', href: 'stylesheets/app.css'
        script src: '/js/jquery-1.6.2.min.js'
        coffeescript ->
            $(document).ready ->
                $('li.jobs').each (iterator, job)->
                    $(job).click (event)->
                        container = $(job).find('.job_container').first()
                        if $(container).hasClass 'open'
                            alreadyOpen = yes
                        opened = $('li.jobs').find('div.job_container.open')
                        for item in opened
                            $(item).slideToggle 'fast' 
                            $(item).removeClass 'open'
                        
                        if not alreadyOpen
                            $(container).slideToggle 'fast'
                            $(container).addClass 'open'

                        return false
        
    body ->
        header ->
            hgroup ->
                h1 'CONCRETE'
                h2 '.project', -> @project
                nav ->
                    form method: 'post', action: '/', ->
                        button 'Build'
                    
        div '#content', ->
            ul ->
                i=@jobs.length
                for job in @jobs
                    li '.jobs', ->
                        a href: "/job/#{job._id.toString()}", -> 
                            div '.time', -> new Date(job.addedTime).toTimeString()
                            div '.job', -> "Job #{i} - #{job._id.toString()}"
                            outcomeClass = if job.failed then '.failure' else '.success'
                            div ".outcome#{outcomeClass}", ->
                                if job.failed then '&#10008;&nbsp;failure' else '&#10003;&nbsp;success'
                        div '.job_container', ->
                            job.log
                                .replace /\n/g, '<br />'
                                .replace /&/g, '&amp;'
                                .replace /</g, '&lt;'
                                .replace />/g, '&gt;'
                                .replace /\n\n/g, '\n&nbsp;\n'
                    i--
                li '.jobs', ->
                    div '.job_container', -> 'job holder'
