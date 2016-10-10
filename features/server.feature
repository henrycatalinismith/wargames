Feature: Socket.io events

  Scenario: broadcast:entrance
    Given player 1 is connected
    When player 2 connects
    Then player 1 receives a broadcast:entrance event

  Scenario: broadcast:location
    Given player 1 is connected
    And player 2 is connected
    When player 2 reports their location
    Then player 1 receives a broadcast:location event

  Scenario: broadcast:launch
    Given player 1 is connected
    And player 2 is connected
    When player 2 reports a launch
    Then player 1 receives a broadcast:launch event
