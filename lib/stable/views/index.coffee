doctype 5
html ->
    head ->
        meta charset: 'utf-8'
        title "#{@title or 'Untitled'} | Stable"
        meta(name: 'description', content: @desc) if @desc?
        link rel: 'stylesheet', href: 'stylesheets/app.css'
        style '''
          header, nav, section, footer {display: block}
        '''
    body ->
        header ->
            h1 @title or 'Untitled'
            nav ->
                a href: '/', -> 'Home'