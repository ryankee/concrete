# git executor
exec = require('child_process').exec
# cli colors
colors = require 'colors'

readyCallback = null

git = module.exports =
    runner: ''
    branch: ''
    config:
        runner: 'concrete.runner'
        branch: 'concrete.branch'
        
    init: (target, callback) ->
        readyCallback = callback
        path = require 'path'
        if target.toString().charAt(0) isnt '/'
            target = process.cwd()+'/'+target
        process.chdir target
        git.target = path.normalize target+'/.git/'
        git.failure = path.normalize target+'/.git/hooks/build-failed'
        git.success = path.normalize target+'/.git/hooks/build-worked'
        path.exists git.target, (exists)->
            if exists is no
                console.log "'#{target}' is not a valid Git repo".red
                process.exit 1
            getBranch()
            getRunner()
        
    pull: (next)->
        jobs = require './jobs'
        out = "Pulling '#{git.branch}' branch"
        jobs.updateLog jobs.current, out, ->
            console.log out.grey
            exec 'git pull origin ' + git.branch, (error, stdout, stderr)=>
                if error?
                    out = "#{error}"
                    jobs.updateLog jobs.current, out
                    console.log out.red
                else
                    out = "Updated '#{git.branch}' branch"
                    jobs.updateLog jobs.current, out, ->
                        console.log out.grey
                        next()

getBranch = ->
    exec 'git config --get ' + git.config.branch, (error, stdout, stderr)=>
        if error?
            git.branch = 'master'
            gitContinue()
        else
            git.branch = stdout.toString().replace /[\s\r\n]+$/, ''
            git.branch = 'master' if git.branch is ''
            gitContinue()

getRunner = ->
    exec 'git config --get ' + git.config.runner, (error, stdout, stderr)=>
        if error?
            console.log "Git.getRunner: #{error}".red
            process.exit 1
        else
            git.runner = stdout.toString().replace /[\s\r\n]+$/, ''
            git.runner = 'none' if git.runner is ''
            gitContinue()
            
gitContinue = ->
    if git.branch is 'none'
        git.branch = 'master'
    else if git.branch is ''
        return no

    if git.runner is 'none'
        console.log 'Git.gitContinue: You must specify a Git runner'.red
        process.exit 1
    else if git.runner is ''
        return no
    readyCallback()
