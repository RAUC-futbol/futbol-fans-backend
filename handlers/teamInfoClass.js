// class
class TeamInfo {
  constructor(teamData) {
    try {
      this.id = teamData.id;
      this.name = teamData.name;
      this.crest = teamData.crest;
      this.tla = teamData.tla;
      this.founded = teamData.founded;
      this.address = teamData.address;
      this.runningCompetitions = teamData.runningCompetitions.map(
        (competition) => {
          return {
            id: competition.id,
            name: competition.name,
            code: competition.code,
            type: competition.type,
            emblem: competition.emblem,
          };
        }
      );
      this.coachName = teamData.coach.name;
      this.squad = teamData.squad.map((player) => {
        return {
          id: player.id,
          name: player.name,
          position: player.position,
          nationality: player.nationality,
        };
      });
    } catch (error) {
      console.error('Error in TeamInfo constructor: ', error.message);
    }
  }
}

module.exports = TeamInfo;
