'use client';

import { Option, Select } from '@/lib/material';
import { Team } from '@/models/Team.model';
import teamsService from '@/services/teams.service';
import { useEffect, useState } from 'react';

interface SelectTeamProps {
  onSelectTeam: (teamId?: string) => void;
}

export function SelectTeam({ onSelectTeam }: Readonly<SelectTeamProps>) {
  const [teams, setTeams] = useState<Team[]>([]);

  async function fetchTeams() {
    const response = await teamsService.getTeams();
    if (response.count > 0) {
      setTeams(response.teams);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  if (teams.length === 0) return <></>;

  return (
    <Select label="Select team" onChange={(val) => onSelectTeam(val)}>
      {teams.map((team) => (
        <Option key={team.id} value={team.id}>
          {team.teamName}
        </Option>
      ))}
    </Select>
  );
}
