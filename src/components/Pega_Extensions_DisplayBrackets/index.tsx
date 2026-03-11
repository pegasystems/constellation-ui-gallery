import { withConfiguration } from '@pega/cosmos-react-core';
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets';
import type { IRoundProps } from 'react-brackets';
import '../shared/create-nonce';

export type PegaExtensionsTournamentProps = {
  JsonField: string;
  getPConnect?: any;
};

const CustomSeed = ({ seed }: { seed: any }) => {
  const team1 = seed.teams[0];
  const team2 = seed.teams[1];
  const winner = seed.winner;
  return (
    <Seed>
      <SeedItem>
        <SeedTeam
          style={{
            backgroundColor: team1.name === winner ? 'green' : '#FAFAFA',
            borderBottom: '1px solid #e0e0e0',
            color: team1.name === winner ? undefined : 'black',
          }}
        >
          {team1.name}
        </SeedTeam>
      </SeedItem>
      <SeedItem>
        <SeedTeam
          style={{
            backgroundColor: team2.name === winner ? 'green' : '#FAFAFA',
            color: team2.name === winner ? undefined : 'black',
          }}
        >
          {team2.name}
        </SeedTeam>
      </SeedItem>
      <div>Match ID: {seed.id}</div>
    </Seed>
  );
};

export const PegaExtensionsTournament = (props: any) => {
  const { JsonField } = props;

  const JsonMappings = JsonField;

  let parsedRounds: IRoundProps[] = [];
  try {
    if (JsonMappings) {
      const json = JSON.parse(JsonMappings);
      if (Array.isArray(json) && Array.isArray(json[0].bracket)) {
        parsedRounds = json[0].bracket as IRoundProps[];
      }
    }
  } catch {
    // handle parse error if needed
  }

  return <Bracket rounds={parsedRounds} renderSeedComponent={CustomSeed} />;
};
export default withConfiguration(PegaExtensionsTournament);
