// Recruit button action
document.getElementById("recruit-btn").addEventListener("click", () => {
  // For now, redirect to a form/discord invite
  // Replace with your actual link
  window.location.href = "https://discord.gg/your-invite-link";
});


fetch(`${API_BASE}/clan/2L0QRVR2V/members`)
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.items.forEach(m => {
      tbody.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>${m.role}</td>
          <td>${m.trophies}</td>
          <td>
            <img src="${m.league.iconUrls.small}" 
                 alt="${m.league.name}" 
                 width="30" height="30" />
          </td>
        </tr>
      `;
    });
  })
  .catch(err => console.error(err));


fetch(`${API_BASE}/clan/2L0QRVR2V/members`)
  .then(res => res.json())
  .then(data => {
    const leaderEl = document.getElementById("leader");
    const coLeadersEl = document.getElementById("co-leaders");
    const membersEl = document.getElementById("members");

    // Find leader
    const leader = data.items.find(m => m.role === "leader");
    if (leader) leaderEl.textContent = leader.name;

    // Find co-leaders
    const coLeaders = data.items.filter(m => m.role === "coLeader");
    coLeadersEl.textContent = coLeaders.map(m => m.name).join(", ");

    // Members count
    membersEl.textContent = `${data.items.length}/50`;
  })
  .catch(err => console.error("Error:", err));

  
fetch(`${API_BASE}/clan/2L0QRVR2V`) 
    .then(res => res.json())
    .then(data => {

      if (data.badgeUrls) {

          const badge = document.getElementById("clanBadge");
          badge.src = data.badgeUrls.small;
          badge.alt = "Clan Badge";
    }
    })
    .catch(err => console.error("Error fetching clan data:", err));