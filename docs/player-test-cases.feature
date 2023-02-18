Scenario: Play 3 tracks
    Given 3 image tracks in queue
    When playback is complete
    Then q is empty
      And history has length 3
      And current track is most recent item
      And state is Paused

    Given 3 p5js tracks in queue
    When playback is complete
    Then q is empty
      And history has length 3
      And current track is most recent item
      And state is Paused

Scenario: Paused state
  Given track A added to q
    And track A completed
  When track B added to q
  Then nothing should happen
    And q has length 1

  Given 1 track added to q
    And track A completed
    And track B added to q
    And q has length 1
    And h has length 1
  When play clicked
  Then track B should play

   Given tracks A,B added to q
      And 2 tracks completed
      And queue empty
      And history has length 2
  When play clicked
  Then raise the QueuePreviousEvent
    And track B should play
