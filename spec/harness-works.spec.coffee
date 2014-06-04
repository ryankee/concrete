describe 'harness with Given a value is true', ->
  Given -> @val = true
  context 'Then expect the value to be truthy', ->
    Then -> expect(@val).toBeTruthy()

  describe 'When the value is set to false, it becomes falsy', ->
    When -> @val = false
    Then -> expect(@val).toBeFalsy()