doctype 5
html ->
    head ->
        meta charset: 'utf-8'
        title "#{if @title then @title+' - ' else ''}Concrete"
        meta(name: 'description', content: @desc) if @desc?
        link rel: 'stylesheet', href: "#{@baseUrl()}stylesheets/app.css"
        script src: "#{@baseUrl()}js/jquery-1.6.2.min.js"
        script src: "#{@baseUrl()}js/coffeekup.js"
        script src: "#{@baseUrl()}concrete.js"
        script ->
          "window.baseUrl = '#{@baseUrl()}';"
    body ->
        header ->
            hgroup ->
                h1 'CONCRETE'
                h2 '.project', -> @project
                nav ->
                    form method: 'post', action: @baseUrl(), ->
                        button '.build', -> 'Build'

        div '#content', ->
            ul '.jobs', ->
                if @jobs.length is 0
                    li '.nojob', -> 'No jobs have been submitted.'
                for i in [@jobs.length - 1..0] by -1
                    @job = @jobs[i]
                    partial 'jobPartial'
