var http          = require('http')
  , exercise      = require('workshopper-exercise')()
  , filecheck     = require('workshopper-exercise/filecheck')
  , execute       = require('workshopper-exercise/execute')
  , comparestdout = require('workshopper-exercise/comparestdout')

  , words = require('boganipsum/clean_words')
      .sort(function () { return 0.5 - Math.random() })
      .slice(0, 10)


// checks that the submission file actually exists
exercise = filecheck(exercise)

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise)

// compare stdout of solution and submission
exercise = comparestdout(exercise)


// set up the data file to be passed to the submission
exercise.addSetup(function (mode, callback) {
  // mode == 'run' || 'verify'

  this.server = http.createServer(function (req, res) {
    // use setTimeout to slow down the output to test timing
    ;(function next (i) {
      if (i == words.length)
        return res.end()
      res.write(words[i].trim())
      setTimeout(next.bind(null, i + 1), 10)
    }(0))
  })

  this.server.listen(0, function () {
    var url = 'http://localhost:' + String(this.server.address().port)

    this.submissionArgs.unshift(url)
    this.solutionArgs.unshift(url)

    callback()
  }.bind(this))
})


// cleanup for both run and verify
exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  this.server.close(callback)
})


module.exports = exercise
