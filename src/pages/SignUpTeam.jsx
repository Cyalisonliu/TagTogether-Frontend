import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeamIds, setExpandedTeamIds] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [alertClassName, setAlertClassName] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("");
  const { fetchWithToken } = useApi();

  const fetchTeams = useCallback(async () => {
    try {
      const response = await fetchWithToken("/api/team/all-teams/");
      const data = await response.json();
      if (response.ok) {
        setTeams(data);
        setAlertClassName("hidden");
        setAlertMessage("");
      } else {
        setAlertClassName(
          "bg-red-500 text-white p-4 rounded border border-red-700"
        );
        setAlertMessage("Failed to load teams.");
      }
    } catch (error) {
      console.error(error);
      setAlertClassName(
        "bg-red-500 text-white p-4 rounded border border-red-700"
      );
      setAlertMessage("An error occurred while fetching teams.");
    }
  }, [fetchWithToken]);

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await fetchWithToken(`/api/team/team-members/${teamId}`);
      const data = await response.json();
      if (response.ok) {
        setTeamMembers((prevMembers) => ({
          ...prevMembers,
          [teamId]: data,
        }));
      } else {
        console.error("Failed to fetch team members.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTeamExpansion = (teamId) => {
    if (expandedTeamIds.includes(teamId)) {
      setExpandedTeamIds(expandedTeamIds.filter((id) => id !== teamId));
    } else {
      setExpandedTeamIds([...expandedTeamIds, teamId]);
      if (!teamMembers[teamId]) {
        fetchTeamMembers(teamId);
      }
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await fetchWithToken("/api/team/create-team/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team_name: newTeamName }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlertClassName(
          "bg-green-500 text-white p-4 rounded border border-green-700"
        );
        setAlertMessage("Team created successfully!");
        setNewTeamName("");
        setIsModalOpen(false);
        fetchTeams();
      } else {
        setAlertClassName(
          "bg-red-500 text-white p-4 rounded border border-red-700"
        );
        setAlertMessage(data.detail || "Failed to create team.");
      }
    } catch (error) {
      console.error(error);
      setAlertClassName(
        "bg-red-500 text-white p-4 rounded border border-red-700"
      );
      setAlertMessage("An error occurred while creating the team.");
    }
  };

  // 加入团队
  const handleJoinTeam = async (teamName, teamId) => {
    try {
      const response = await fetchWithToken("/api/team/join-team/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_name: teamName,
        }),
      });
      if (response.ok) {
        setAlertClassName(
          "bg-green-500 text-white p-4 rounded border border-green-700"
        );
        setAlertMessage("Successfully joined the team!");
        // fetchTeams();
        fetchTeamMembers(teamId);
      } else {
        const data = await response.json();
        setAlertClassName(
          "bg-red-500 text-white p-4 rounded border border-red-700"
        );
        setAlertMessage(data.detail || "Failed to join team.");
      }
    } catch (error) {
      console.error(error);
      setAlertClassName(
        "bg-red-500 text-white p-4 rounded border border-red-700"
      );
      setAlertMessage("An error occurred while joining the team.");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="max-w-4xl p-6 mx-auto text-gray-200 bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-gold-400">Teams</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 mb-6 font-semibold text-white transition bg-purple-600 rounded hover:bg-purple-700"
      >
        Create New Team
      </button>

      {alertMessage && (
        <p className={`mb-6 ${alertClassName}`}>{alertMessage}</p>
      )}

      <div className="space-y-6">
        {teams.map((team) => (
          <div key={team.id} className="p-6 bg-gray-800 rounded shadow-lg">
            <div
              className="flex items-center justify-between"
              onClick={() => toggleTeamExpansion(team.id)}
            >
              <span className="text-lg font-semibold">{team.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  handleJoinTeam(team.name, team.id);
                }}
                className="px-4 py-2 font-semibold text-white transition bg-green-500 rounded hover:bg-green-600"
              >
                Join
              </button>
            </div>
            {expandedTeamIds.includes(team.id) && teamMembers[team.id] && (
              <div className="p-4 mt-4 bg-gray-700 rounded">
                <h3 className="mb-2 text-lg font-semibold text-gold-400">
                  Members:
                </h3>
                <ul className="space-y-2">
                  {teamMembers[team.id].map((member) => (
                    <li
                      key={member.user_id}
                      className="px-3 py-2 text-gray-300 bg-gray-800 rounded"
                    >
                      {member.user_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 text-gray-200 bg-gray-800 rounded shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold text-gold-400">
              Create a New Team
            </h2>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team Name"
              className="w-full p-3 mb-4 text-gray-300 bg-gray-900 border border-gray-700 rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-semibold text-gray-400 transition bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 font-semibold text-white transition bg-purple-600 rounded hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
